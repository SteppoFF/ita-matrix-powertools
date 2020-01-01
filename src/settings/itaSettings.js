// ITA Matrix CSS class definitions:
export default {
  startpage: {
    maindiv: "IR6M2QD-w-d" //Container of main content. Unfortunately id "contentwrapper" is used twice
  },
  resultpage: {
    itin: "IR6M2QD-v-d", //Container with headline: "Itinerary"
    itinRow: "IR6M2QD-j-i", // TR in itin with Orig, Dest and date
    milagecontainer: "IR6M2QD-v-e", // TD-Container on the right
    rulescontainer: "IR6M2QD-k-d", // First container before rulelinks (the one with Fare X:)
    htbContainer: "IR6M2QD-k-k", // full "how to buy"-container inner div (td=>div=>div)
    htbLeft: "IR6M2QD-k-g", // Left column in the "how to buy"-container
    htbRight: "IR6M2QD-k-f", // Class for normal right column
    htbGreyBorder: "IR6M2QD-k-l", // Class for right cell with light grey border (used for subtotal of passenger)
    //inline
    mcDiv: "IR6M2QD-y-d", // Right menu sections class (3 divs surrounding entire Mileage, Emissions, and Airport Info)
    mcHeader: "IR6M2QD-y-b", // Right menu header class ("Mileage", etc.)
    mcLinkList: "IR6M2QD-y-c" // Right menu ul list class (immediately following header)
  }
};
