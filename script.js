function calculerTotal() {
  let prixUnitaire = document.getElementById("article").value;
  let quantite = document.getElementById("quantite").value;
  let total = prixUnitaire * quantite;
  
  document.getElementById("prix-total").innerText = total.toLocaleString("fr-FR");
}
