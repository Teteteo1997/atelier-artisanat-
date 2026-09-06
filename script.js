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

  let quantite = parseInt(inputQuantite.value);
  if (isNaN(quantite) || quantite < 1) {
    quantite = 1;
  }

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
  const messageText = `Bonjour, je souhaite commander :\n- Article : ${nomArticle}\n- Bois : ${nomBois}\n- Finition : ${nomFinition}\n- Quantité : ${quantite}\nTotal estimé : ${totalFormate} FCFA`;
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

  calculerTotal();
  chargerMeteo();
  initialiserTheme();
  initialiserRecherche();
});
