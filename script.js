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

  // 1. SÉCURITÉ : Corriger toute quantité négative ou égale à zéro
  if (isNaN(quantite) || quantite < 1) {
    if (inputQuantite.value !== "") {
      inputQuantite.value = 1;
      quantite = 1;
    }
  }

  // 2. VÉRIFICATION : L'utilisateur a-t-il sélectionné toutes les options ?
  const toutEstSelectionne = !isNaN(prixBase) && !isNaN(facteurBois) && !isNaN(prixFinition) && !isNaN(quantite) && quantite >= 1;

  if (!toutEstSelectionne) {
    // État d'attente professionnel
    affichagePrixTotal.textContent = "---";
    affichagePrixEur.textContent = "Veuillez choisir toutes les options";
    btnDevisWhatsapp.classList.add('disabled-btn');
    btnDevisWhatsapp.href = "#";
    return;
  }

  // SÉCURITÉ SUPPLÉMENTAIRE : Vérification contre les prix négatifs
  const prixBaseSecurise = Math.max(0, prixBase);
  const facteurBoisSecurise = Math.max(0, facteurBois);
  const prixFinitionSecurise = Math.max(0, prixFinition);

  // 3. CALCUL DU TOTAL
  const totalFCFA = (prixBaseSecurise * facteurBoisSecurise + prixFinitionSecurise) * quantite;

  // Affichage formaté en FCFA
  affichagePrixTotal.textContent = totalFCFA.toLocaleString('fr-FR') + " FCFA";

  // Conversion approximative en Euros (1 EUR ≈ 655.957 FCFA)
  const totalEUR = (totalFCFA / 655.957).toFixed(2);
  affichagePrixEur.textContent = totalEUR + " €";

  // Récupération des noms d'options sélectionnées
  const nomArticle = selectArticle.options[selectArticle.selectedIndex].text;
  const nomBois = selectBois.options[selectBois.selectedIndex].text;
  const nomFinition = selectFinition.options[selectFinition.selectedIndex].text;

  // Réactivation du bouton WhatsApp
  btnDevisWhatsapp.classList.remove('disabled-btn');

  // Génération du message WhatsApp
  const messageWhatsApp = `Bonjour, je souhaite commander ce devis :\n` +
    `- Article : ${nomArticle}\n` +
    `- Bois : ${nomBois}\n` +
    `- Finition : ${nomFinition}\n` +
    `- Quantité : ${quantite}\n` +
    `- Total Estimé : ${totalFCFA.toLocaleString('fr-FR')} FCFA (~${totalEUR} €)`;

  btnDevisWhatsapp.href = `https://wa.me/22899658573?text=${encodeURIComponent(messageWhatsApp)}`;
}

// Écouteurs d'événements pour mise à jour en temps réel
selectArticle.addEventListener('change', calculerDevis);
selectBois.addEventListener('change', calculerDevis);
selectFinition.addEventListener('change', calculerDevis);
inputQuantite.addEventListener('input', calculerDevis);

// Verification initiale au chargement
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
// 3. BOUTON MODE SOMBRE (DARK MODE)
// ==========================================
const btnTheme = document.getElementById('theme-toggle');

btnTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');

  if (document.body.classList.contains('dark-theme')) {
    btnTheme.textContent = '☀️ Mode Clair';
  } else {
    btnTheme.textContent = '🌙 Mode Sombre';
  }
});
