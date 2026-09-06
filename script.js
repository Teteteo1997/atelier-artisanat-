/**
 * Application Atelier Artisanat
 * - Calculateur & Commande WhatsApp
 * - API Open-Meteo & API ExchangeRate
 * - Mode Sombre avec localStorage
 */

// Globales pour la conversion
let tauxEUR = 0.00152; // Taux par défaut (1 FCFA ≈ 0.00152 EUR)

// 1. CALCULATEUR DE DEVIS & CONVERSION DE DEVISES
function calculerTotal() {
  const selectArticle = document.getElementById("article");
  const selectBois = document.getElementById("bois");
  const selectFinition = document.getElementById("finition");
  const inputQuantite = document.getElementById("quantite");
  const affichageTotal = document.getElementById("prix-total");
  const affichageEUR = document.getElementById("prix-eur");
  const btnWhatsappDevis = document.getElementById("btn-whatsapp-devis");

  if (!selectArticle || !inputQuantite) return;

  // Sécurisation quantité
  let quantite = parseInt(inputQuantite.value);
  if (isNaN(quantite) || quantite < 1) quantite = 1;

  // Extraction des prix et noms
  const prixBase = parseInt(selectArticle.value);
  const nomArticle = selectArticle.options[selectArticle.selectedIndex].text.split('(')[0].trim();

  const multiplicateurBois = parseFloat(selectBois.value);
  const nomBois = selectBois.options[selectBois.selectedIndex].text.split('(')[0].trim();

  const prixFinition = parseInt(selectFinition.value);
  const nomFinition = selectFinition.options[selectFinition.selectedIndex].text.split('(')[0].trim();

  // Calcul du total en FCFA
  const prixUnitaire = (prixBase * multiplicateurBois) + prixFinition;
  const totalFCFA = prixUnitaire * quantite;
  const totalFormate = totalFCFA.toLocaleString("fr-FR");

  // Affichage FCFA
  affichageTotal.innerText = totalFormate;

  // Conversion dynamique en EUR si l'API a répondu
  if (affichageEUR && tauxEUR > 0) {
    const totalEUR = (totalFCFA * tauxEUR).toFixed(2);
    affichageEUR.innerText = `(~ ${totalEUR} €)`;
  }

  // Génération du lien WhatsApp
  const numeroPhone = "22899658573";
  const messageText = `Bonjour, je souhaite commander :\n- Article : ${nomArticle}\n- Bois : ${nomBois}\n- Finition : ${nomFinition}\n- Quantité : ${quantite}\nTotal estimé : ${totalFormate} FCFA`;
  
  if (btnWhatsappDevis) {
    btnWhatsappDevis.href = `https://wa.me/${numeroPhone}?text=${encodeURIComponent(messageText)}`;
  }
}

// 2. API : CHARGEMENT DU TAUX DE CHANGE (FCFA -> EUR)
async function chargerTauxChange() {
  try {
    const reponse = await fetch("https://open.er-api.com/v6/latest/XOF");
    const donnees = await reponse.json();
    if (donnees && donnees.rates && donnees.rates.EUR) {
      tauxEUR = donnees.rates.EUR;
      calculerTotal(); // Recalcule avec le taux à jour
    }
  } catch (erreur) {
    console.warn("API Change indisponible, utilisation du taux par défaut.");
  }
}

// 3. API : CHARGEMENT DE LA MÉTÉO (Lomé)
async function chargerMeteo() {
  const meteoElement = document.getElementById("meteo-info");
  try {
    const reponse = await fetch("https://api.open-meteo.com/v1/forecast?latitude=6.1375&longitude=1.2125&current_weather=true");
    const donnees = await reponse.json();
    const temp = donnees.current_weather.temperature;
    if (meteoElement) meteoElement.innerText = `🌤️ Lomé : ${temp} °C en direct`;
  } catch (erreur) {
    if (meteoElement) meteoElement.innerText = "🌤️ Météo indisponible";
  }
}

// 4. GESTION DU MODE SOMBRE & LOCALSTORAGE
function initialiserTheme() {
  const btnTheme = document.getElementById("theme-toggle");
  const themeSauvegarde = localStorage.getItem("theme");

  // Applique le thème sauvegardé
  if (themeSauvegarde === "dark") {
    document.body.classList.add("dark-theme");
    if (btnTheme) btnTheme.innerText = "☀️ Mode Clair";
  }

  // Écouteur sur le bouton
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      const estSombre = document.body.classList.contains("dark-theme");

      // Mise à jour du texte et du localStorage
      btnTheme.innerText = estSombre ? "☀️ Mode Clair" : "🌙 Mode Sombre";
      localStorage.setItem("theme", estSombre ? "dark" : "light");
    });
  }
}

// INITIALISATION GLOBALE
document.addEventListener("DOMContentLoaded", () => {
  initialiserTheme();
  chargerMeteo();
  chargerTauxChange();

  const elements = ["article", "bois", "finition", "quantite"];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", calculerTotal);
      el.addEventListener("input", calculerTotal);
    }
  });

  calculerTotal();
});
