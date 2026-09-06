/**
 * 1. CALCULATEUR DE DEVIS + COMMANDES WHATSAPP
 */
function calculerTotal() {
  const selectArticle = document.getElementById("article");
  const selectBois = document.getElementById("bois");
  const selectFinition = document.getElementById("finition");
  const inputQuantite = document.getElementById("quantite");
  const affichageTotal = document.getElementById("prix-total");
  const btnWhatsappDevis = document.getElementById("btn-whatsapp-devis");

  if (!selectArticle || !inputQuantite) return;

  // Récupération souple de la quantité (0 si le champ est vide pendant la saisie)
  let quantiteSaisie = parseInt(inputQuantite.value);
  let quantite = isNaN(quantiteSaisie) || quantiteSaisie < 1 ? 0 : quantiteSaisie;

  const prixBase = parseInt(selectArticle.value);
  const nomArticle = selectArticle.options[selectArticle.selectedIndex].text.split('(')[0].trim();

  const multiplicateurBois = parseFloat(selectBois.value);
  const nomBois = selectBois.options[selectBois.selectedIndex].text.split('(')[0].trim();

  const prixFinition = parseInt(selectFinition.value);
  const nomFinition = selectFinition.options[selectFinition.selectedIndex].text.split('(')[0].trim();

  const prixUnitaire = (prixBase * multiplicateurBois) + prixFinition;
  const total = prixUnitaire * quantite;
  const totalFormate = total.toLocaleString("fr-FR");

  affichageTotal.innerText = totalFormate;

  const numeroPhone = "22899658573";
  const messageText = `Bonjour, je souhaite commander :\n- Article : ${nomArticle}\n- Bois : ${nomBois}\n- Finition : ${nomFinition}\n- Quantité : ${quantite || 1}\nTotal estimé : ${totalFormate} FCFA`;
  const messageEncode = encodeURIComponent(messageText);

  if (btnWhatsappDevis) {
    btnWhatsappDevis.href = `https://wa.me/${numeroPhone}?text=${messageEncode}`;
  }
}

/**
 * 2. APPEL API METEO EN DIRECT
 */
async function chargerMeteo() {
  const meteoElement = document.getElementById("meteo-info");
  try {
    const reponse = await fetch("https://api.open-meteo.com/v1/forecast?latitude=6.1375&longitude=1.2125&current_weather=true");
    const donnees = await reponse.json();
    const temperature = donnees.current_weather.temperature;
    
    if (meteoElement) {
      meteoElement.innerText = `🌤️ Lomé : ${temperature} °C en direct`;
    }
  } catch (erreur) {
    if (meteoElement) {
      meteoElement.innerText = "🌤️ Météo indisponible";
    }
  }
}

/**
 * 3. GESTION DU MODE SOMBRE / CLAIR (LOCALSTORAGE)
 */
function initialiserTheme() {
  const btnTheme = document.getElementById("btn-theme");
  const themeSauvegarde = localStorage.getItem("theme");

  if (themeSauvegarde === "dark") {
    document.body.classList.add("dark-mode");
    if (btnTheme) btnTheme.innerText = "☀️ Mode Clair";
  }

  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        btnTheme.innerText = "☀️ Mode Clair";
        localStorage.setItem("theme", "dark");
      } else {
        btnTheme.innerText = "🌙 Mode Sombre";
        localStorage.setItem("theme", "light");
      }
    });
  }
}

/**
 * 4. BARRE DE RECHERCHE EN DIRECT (DOM)
 */
function initialiserRecherche() {
  const inputRecherche = document.getElementById("recherche");
  const itemsGalerie = document.querySelectorAll(".galerie-item");

  if (inputRecherche) {
    inputRecherche.addEventListener("input", (e) => {
      const texteRecherche = e.target.value.toLowerCase().trim();

      itemsGalerie.forEach((item) => {
        const nomMeuble = item.getAttribute("data-nom") || item.textContent.toLowerCase();
        if (nomMeuble.toLowerCase().includes(texteRecherche)) {
          item.classList.remove("masque");
        } else {
          item.classList.add("masque");
        }
      });
    });
  }
}

/**
 * =======================================================
 * 5. SIMULATION D'UN SERVEUR BACK-END (NODE.JS / EXPRESS)
 * =======================================================
 */

// Base de Données simulée sur le serveur
let baseDeDonneesMeubles = [
  { id: 1, nom: "Chaise Design", prix: 15000 },
  { id: 2, nom: "Table à Manger", prix: 50000 },
  { id: 3, nom: "Armoire Rangement", prix: 35000 }
];

/**
 * Route GET /api/meubles (Lecture)
 */
function routeGetMeubles() {
  return baseDeDonneesMeubles;
}

/**
 * Route POST /api/meubles (Création)
 */
function routePostMeuble(nouveauMeuble) {
  const meubleAEnregistrer = {
    id: baseDeDonneesMeubles.length + 1,
    nom: nouveauMeuble.nom,
    prix: parseInt(nouveauMeuble.prix)
  };

  baseDeDonneesMeubles.push(meubleAEnregistrer);

  return { statut: 201, message: "Meuble ajouté dans la base !", data: meubleAEnregistrer };
}

/**
 * CÔTÉ CLIENT (FRONT-END) : Formulaire d'Administration
 */
function initialiserEspaceAdmin() {
  const formAdmin = document.getElementById("form-admin");
  const selectArticle = document.getElementById("article");

  if (formAdmin) {
    formAdmin.addEventListener("submit", (e) => {
      e.preventDefault();

      const nom = document.getElementById("admin-nom").value;
      const prix = document.getElementById("admin-prix").value;

      // Simulation de la requête POST au serveur
      const reponseServeur = routePostMeuble({ nom: nom, prix: prix });

      if (reponseServeur.statut === 201) {
        alert(`Succès (Serveur) : ${reponseServeur.message}`);

        const meubleCree = reponseServeur.data;
        
        // Ajout dynamique du nouvel article au menu déroulant du devis
        const nouvelleOption = document.createElement("option");
        nouvelleOption.value = meubleCree.prix;
        nouvelleOption.text = `${meubleCree.nom} (${meubleCree.prix.toLocaleString("fr-FR")} FCFA)`;
        selectArticle.add(nouvelleOption);

        formAdmin.reset();
      }
    });
  }
}

// INITIALISATION DU SITE
document.addEventListener("DOMContentLoaded", () => {
  const elements = ["article", "bois", "finition", "quantite"];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", calculerTotal);
      el.addEventListener("input", calculerTotal);
    }
  });

  const inputQuantite = document.getElementById("quantite");
  if (inputQuantite) {
    inputQuantite.addEventListener("blur", () => {
      if (!inputQuantite.value || parseInt(inputQuantite.value) < 1) {
        inputQuantite.value = 1;
        calculerTotal();
      }
    });
  }

  calculerTotal();
  chargerMeteo();
  initialiserTheme();
  initialiserRecherche();
  initialiserEspaceAdmin();
});
