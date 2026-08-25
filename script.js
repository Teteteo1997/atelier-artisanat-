/**
 * Calculateur de devis interactif + Lien WhatsApp dynamique
 */
function calculerTotal() {
  const selectArticle = document.getElementById("article");
  const selectBois = document.getElementById("bois");
  const selectFinition = document.getElementById("finition");
  const inputQuantite = document.getElementById("quantite");
  const affichageTotal = document.getElementById("prix-total");
  const btnWhatsappDevis = document.getElementById("btn-whatsapp-devis");

  // 1. Sécurisation de la quantité
  let quantite = parseInt(inputQuantite.value);
  if (isNaN(quantite) || quantite < 1) {
    quantite = 1;
  }

  // 2. Récupération des prix et des libellés (textes)
  const prixBase = parseInt(selectArticle.value);
  const nomArticle = selectArticle.options[selectArticle.selectedIndex].text.split('(')[0].trim();

  const multiplicateurBois = parseFloat(selectBois.value);
  const nomBois = selectBois.options[selectBois.selectedIndex].text.split('(')[0].trim();

  const prixFinition = parseInt(selectFinition.value);
  const nomFinition = selectFinition.options[selectFinition.selectedIndex].text.split('(')[0].trim();

  // 3. Calcul du montant
  const prixUnitaire = (prixBase * multiplicateurBois) + prixFinition;
  const total = prixUnitaire * quantite;
  const totalFormate = total.toLocaleString("fr-FR");

  // 4. Affichage à l'écran
  affichageTotal.innerText = totalFormate;

  // 5. Génération dynamique du message WhatsApp
  const numeroPhone = "22899658573";
  const messageText = `Bonjour, je souhaite commander :\n- Article : ${nomArticle}\n- Bois : ${nomBois}\n- Finition : ${nomFinition}\n- Quantité : ${quantite}\nTotal estimé : ${totalFormate} FCFA`;

  // Encode le texte pour les liens web (remplace espaces par %20, etc.)
  const messageEncode = encodeURIComponent(messageText);

  // Mise à jour de l'URL du bouton
  if (btnWhatsappDevis) {
    btnWhatsappDevis.href = `https://wa.me/${numeroPhone}?text=${messageEncode}`;
  }
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  const elements = ["article", "bois", "finition", "quantite"];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", calculerTotal);
      el.addEventListener("input", calculerTotal);
    }
  });

  // Calcul initial au chargement
  calculerTotal();
});
