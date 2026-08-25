/**
 * Calculateur de devis dynamique avancé
 */
function calculerTotal() {
  const selectArticle = document.getElementById("article");
  const selectBois = document.getElementById("bois");
  const selectFinition = document.getElementById("finition");
  const inputQuantite = document.getElementById("quantite");
  const affichageTotal = document.getElementById("prix-total");

  // Sécurisation de la quantité
  let quantite = parseInt(inputQuantite.value);
  if (isNaN(quantite) || quantite < 1) {
    quantite = 1;
  }

  // Récupération des prix
  const prixBase = parseInt(selectArticle.value);
  const multiplicateurBois = parseFloat(selectBois.value); // Coefficient selon le bois
  const prixFinition = parseInt(selectFinition.value);     // Supplément finition

  // Calcul du prix unitaire puis du total
  const prixUnitaire = (prixBase * multiplicateurBois) + prixFinition;
  const total = prixUnitaire * quantite;

  // Affichage formaté
  affichageTotal.innerText = total.toLocaleString("fr-FR");
}

// Écouteurs d'événements
document.addEventListener("DOMContentLoaded", () => {
  const elements = ["article", "bois", "finition", "quantite"];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", calculerTotal);
      el.addEventListener("input", calculerTotal);
    }
  });
});
