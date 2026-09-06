// ==========================================
// TAUX DE CHANGE DYNAMIQUE (API EXCHANGE)
// ==========================================
let tauxEurXof = 655.957; // Valeur par défaut de sécurité

async function chargerTauxChange() {
  try {
    const reponse = await fetch('https://open.er-api.com/v6/latest/EUR');
    const donnees = await reponse.json();
    if (donnees && donnees.rates && donnees.rates.XOF) {
      tauxEurXof = donnees.rates.XOF;
      calculerDevis(); // Recalculer si le taux a changé
    }
  } catch (erreur) {
    console.log("Utilisation du taux de change fixe de secours");
  }
}
chargerTauxChange();

// ==========================================
// 1. CALCULATEUR DE DEVIS & WHATSAPP
// ==========================================
const selectArticle = document.getElementById('article');
const selectBois = document.getElementById('bois');
const selectFinition = document.getElementById('finition');
const inputQuantite = document.getElementById('quantite');

const affichagePrixTotal = document.getElementById('prix-total');
const affichagePrixEur = document.getElementById('prix-eur');
const btnDevisWhatsapp = document.getElementById('btn-devis-whatsapp');

function calculerDevis() {
  const prixBase = parseFloat(selectArticle.value);
  const facteurBois = parseFloat(selectBois.value);
  const prixFinition = parseFloat(selectFinition.value);
  let quantite = parseInt(inputQuantite.value);

  // Sécurité quantité
  if (isNaN(quantite) || quantite < 1) {
    if (inputQuantite.value !== "") {
      inputQuantite.value = 1;
      quantite = 1;
    }
  }

  // Vérification des sélections
  const toutEstSelectionne = !isNaN(prixBase) && !isNaN(facteurBois) && !isNaN(prixFinition) && !isNaN(quantite) && quantite >= 1;

  if (!toutEstSelectionne) {
    affichagePrixTotal.textContent = "---";
    affichagePrixEur.textContent = "Veuillez choisir toutes les options";
    btnDevisWhatsapp.classList.add('disabled-btn');
    btnDevisWhatsapp.href = "#";
    return;
  }

  const prixBaseSecurise = Math.max(0, prixBase);
  const facteurBoisSecurise = Math.max(0, facteurBois);
  const prixFinitionSecurise = Math.max(0, prixFinition);

  // Calcul du total FCFA
  const totalFCFA = (prixBaseSecurise * facteurBoisSecurise + prixFinitionSecurise) * quantite;
  affichagePrixTotal.textContent = totalFCFA.toLocaleString('fr-FR') + " FCFA";

  // Conversion avec le taux dynamique d'API
  const totalEUR = (totalFCFA / tauxEurXof).toFixed(2);
  affichagePrixEur.textContent = totalEUR + " €";

  // Récupération des textes
  const nomArticle = selectArticle.options[selectArticle.selectedIndex].text;
  const nomBois = selectBois.options[selectBois.selectedIndex].text;
  const nomFinition = selectFinition.options[selectFinition.selectedIndex].text;

  btnDevisWhatsapp.classList.remove('disabled-btn');

  const messageWhatsApp = `Bonjour, je souhaite commander ce devis :\n` +
    `- Article : ${nomArticle}\n` +
    `- Bois : ${nomBois}\n` +
    `- Finition : ${nomFinition}\n` +
    `- Quantité : ${quantite}\n` +
    `- Total Estimé : ${totalFCFA.toLocaleString('fr-FR')} FCFA (~${totalEUR} €)`;

  btnDevisWhatsapp.href = `https://wa.me/22899658573?text=${encodeURIComponent(messageWhatsApp)}`;
}

selectArticle.addEventListener('change', calculerDevis);
selectBois.addEventListener('change', calculerDevis);
selectFinition.addEventListener('change', calculerDevis);
inputQuantite.addEventListener('input', calculerDevis);

calculerDevis();

// ==========================================
// 2. METEO EN DIRECT (API Open-Meteo)
// ==========================================
async function chargerMeteo() {
  const divMeteo = document.getElementById('meteo');
  try {
    const reponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=6.1375&longitude=1.2125&current_weather=true');
    const donnees = await reponse.json();
    const temp = donnees.current_weather.temperature;
    divMeteo.textContent = `🌤️ Lomé : ${temp} °C en direct`;
  } catch (erreur) {
    divMeteo.textContent = '🌤️ Lomé : Météo indisponible';
  }
}
chargerMeteo();

// ==========================================
// 3. BOUTON MODE SOMBRE AVEC LOCALSTORAGE
// ==========================================
const btnTheme = document.getElementById('theme-toggle');

// 1. Lire la préférence sauvegardée
const themeSauvegarde = localStorage.getItem('theme');

if (themeSauvegarde === 'dark') {
  document.body.classList.add('dark-theme');
  btnTheme.textContent = '☀️ Mode Clair';
} else {
  document.body.classList.remove('dark-theme');
  btnTheme.textContent = '🌙 Mode Sombre';
}

// 2. Basculer et enregistrer la préférence
btnTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');

  if (document.body.classList.contains('dark-theme')) {
    btnTheme.textContent = '☀️ Mode Clair';
    localStorage.setItem('theme', 'dark'); // Sauvegarde Sombre
  } else {
    btnTheme.textContent = '🌙 Mode Sombre';
    localStorage.setItem('theme', 'light'); // Sauvegarde Clair
  }
});
