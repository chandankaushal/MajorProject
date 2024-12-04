let taxSwitch = document.getElementById("flexSwitchCheckDefault"); //TaxSwitch
let priceBeforeTax = document.querySelectorAll(".priceBeforeTax"); // Getting all Prices before Tax
let cardText = document.querySelectorAll(".card-text"); //All Card-Text Elements

taxSwitch.addEventListener("change", () => {
  if (taxSwitch.checked) {
    for (let i = 0; i < priceBeforeTax.length; i++) {
      let afterTaxElement = document.createElement("p"); //Create element to display the after tax amount
      afterTaxElement.classList = "priceAfterTax"; // Giving it a Class Name
      let result = parseFloat(
        priceBeforeTax[i].innerText.replace(/[^\d]/g, "") // Using regex to remove $ and ,
      );
      let afterTaxAmount = (result * 1.13).toLocaleString("en-US"); //Adding 13% tax
      afterTaxElement.innerHTML = `<b>$${afterTaxAmount} incl. all taxes</b>`;
      priceBeforeTax[i].style.display = "none"; //Hide Before Tax Price
      cardText[i].appendChild(afterTaxElement); //Show After Tax Price
    }
  } else {
    let afterTaxElements = document.querySelectorAll(".priceAfterTax"); //get all after tax elements
    for (let i = 0; i < priceBeforeTax.length; i++) {
      afterTaxElements[i].remove(); // remove after tax prices
      priceBeforeTax[i].style.display = "block"; // Show before tax prices
    }
  }
});
