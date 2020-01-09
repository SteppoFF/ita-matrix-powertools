// ITA Matrix CSS class definitions:
export default {
  startpage: {
    maindiv: "KIR33AB-w-d" //Container of main content. Unfortunately id "contentwrapper" is used twice
  },
  resultpage: {
    itin: "KIR33AB-v-d", //Container with headline: "Itinerary"
    itinRow: "KIR33AB-j-i", // TR in itin with Orig, Dest and date
    milagecontainer: "KIR33AB-v-e", // TD-Container on the right
    rulescontainer: "KIR33AB-k-d", // First container before rulelinks (the one with Fare X:)
    htbContainer: "KIR33AB-k-k", // full "how to buy"-container inner div (td=>div=>div)
    htbLeft: "KIR33AB-k-g", // Left column in the "how to buy"-container
    htbRight: "KIR33AB-k-f", // Class for normal right column
    htbGreyBorder: "KIR33AB-k-l", // Class for right cell with light grey border (used for subtotal of passenger)
    //inline
    mcDiv: "KIR33AB-y-d", // Right menu sections class (3 divs surrounding entire Mileage, Emissions, and Airport Info)
    mcHeader: "KIR33AB-y-b", // Right menu header class ("Mileage", etc.)
    mcLinkList: "KIR33AB-y-c" // Right menu ul list class (immediately following header)
  }
};
