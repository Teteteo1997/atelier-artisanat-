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
  const quantite = parseInt(inputQuantite.value) || 1;

  // Formule de calcul du total
  const totalFCFA = (prixBase * facteurBois + prixFinition) * quantite;

  // Affichage formaté en FCFA
  affichagePrixTotal.textContent = totalFCFA.toLocaleString('fr-FR');

  // Conversion approximative en Euros (1 EUR ≈ 655.957 FCFA)
  const totalEUR = (totalFCFA / 655.957).toFixed(2);
  affichagePrixEur.textContent = totalEUR + " €";

  // Récupération des noms d'options sélectionnées
  const nomArticle = selectArticle.options[selectArticle.selectedIndex].text;
  const nomBois = selectBois.options[selectBois.selectedIndex].text;
  const nomFinition = selectFinition.options[selectFinition.selectedIndex].text;

  // Génération du lien WhatsApp pré-rempli
  const messageWhatsApp = `Bonjour, je souhaite commander ce devis :\n` +
    `- Article : ${nomArticle}\n` +
    `- Bois : ${nomBois}\n` +
    `- Finition : ${nomFinition}\n` +
    `- Quantité : ${quantite}\n` +
    `- Total Estimé : ${totalFCFA.toLocaleString('fr-FR')} FCFA (~${totalEUR} €)`;

  btnDevisWhatsapp.href = `https://wa.me/22899658573?text=${encodeURIComponent(messageWhatsApp)}`;
}

// Écouteurs d'événements pour mise à jour automatique
selectArticle.addEventListener('change', calculerDevis);
selectBois.addEventListener('change', calculerDevis);
selectFinition.addEventListener('change', calculerDevis);
inputQuantite.addEventListener('input', calculerDevis);

// Lancement au chargement initial
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
