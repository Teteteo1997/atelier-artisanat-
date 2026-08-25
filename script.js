/**
 * Calculateur de devis automatique
 * Atelier Artisanat
 */
function calculerTotal() {
  // 1. Récupération des éléments HTML
  const selectArticle = document.getElementById("article");
  const inputQuantite = document.getElementById("quantite");
  const affichageTotal = document.getElementById("prix-total");

  // 2. Conversion et vérification de la quantité (Sécurité)
  let quantite = parseInt(inputQuantite.value);

  // Si la quantité n'est pas un nombre ou est inférieure à 1, on force à 1
  if (isNaN(quantite) || quantite < 1) {
    quantite = 1;
  }

  // 3. Récupération du prix unitaire
  const prixUnitaire = parseInt(selectArticle.value);

  // 4. Calcul du montant total
  const total = prixUnitaire * quantite;

  // 5. Affichage propre avec espaces pour les milliers (ex: 50 000 FCFA)
  affichageTotal.innerText = total.toLocaleString("fr-FR");
}

// Écouteurs d'événements dynamiques : Le calcul s'exécute dès qu'on touche aux champs
document.addEventListener("DOMContentLoaded", () => {
  const selectArticle = document.getElementById("article");
  const inputQuantite = document.getElementById("quantite");

  if (selectArticle && inputQuantite) {
    selectArticle.addEventListener("change", calculerTotal);
    inputQuantite.addEventListener("input", calculerTotal);
  }
});
