import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import { registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

const SkyscannerEditions = [
  { name: "Skyscanner.com", market: "US" },
  { name: "Skyscanner.de", market: "DE" },
  { name: "Skyscanner.it", market: "IT" },
  { name: "Skyscanner.es", market: "ES" },
  { name: "Skyscanner.co.uk", market: "UK" },
  { name: "Skyscanner.dk", market: "DK" },
  { name: "Skyscanner.mx", market: "MX" },
  { name: "Skyscanner.fi", market: "FI" },
  { name: "Skyscanner.fr", market: "FR" },
  { name: "Skyscanner.no", market: "NO" },
  { name: "Skyscanner.nl", market: "NL" },
  { name: "Skyscanner.pt", market: "PT" },
  { name: "Skyscanner.se", market: "SE" },
  { name: "Skyscanner.ru", market: "RU" }
];

function printSkyscanner() {
  //example https://www.skyscanner.ru/transport/d/stoc/2017-09-02/akl/akl/2017-09-16/stoc/akl/2017-09-29/syd?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&ref=day-view#results
  var skyscannerTravelClass = ["", "premiumeconomy", "business", "first"];
  var SkyscannerCreateUrl = function(market) {
    var skyscannerUrl = "http://www.skyscanner.com/transport/d";
    var seg = 0;
    var mincabin = 3;
    for (var i = 0; i < currentItin.itin.length; i++) {
      skyscannerUrl += "/" + currentItin.itin[i].orig;
      // Add the segments:
      skyscannerUrl +=
        "/" +
        currentItin.itin[i].dep.year +
        "-" +
        ("0" + currentItin.itin[i].dep.month).slice(-2) +
        "-" +
        ("0" + currentItin.itin[i].dep.day).slice(-2);
      skyscannerUrl += "/" + currentItin.itin[i].dest;

      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        // check the min cabin:
        if (currentItin.itin[i].seg[j].cabin < mincabin) {
          mincabin = currentItin.itin[i].seg[j].cabin;
        }
      }

      seg++;
    }

    // Add passenger info:
    skyscannerUrl +=
      "?adults=" + currentItin.numPax + "adultsv2=" + currentItin.numPax;
    // Add cabin / class of service:
    skyscannerUrl +=
      "&cabinclass=" +
      skyscannerTravelClass[
        mptSettings.cabin === "Auto" ? mincabin : getForcedCabin()
      ];
    // Add locale ("market"):
    skyscannerUrl += "&ref=day-view&market=" + market;

    return skyscannerUrl;
  };
  var skyscannerUrl = SkyscannerCreateUrl("Skyscanner.com");
  var SkyscannerExtra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  SkyscannerExtra += SkyscannerEditions.map(function(obj, i) {
    return (
      '<a href="' +
      SkyscannerCreateUrl(obj.market) +
      '" target="_blank">' +
      obj.name +
      "</a>"
    );
  }).join("<br/>");
  SkyscannerExtra += "</span></span>";

  return {
    url: skyscannerUrl,
    title: "Skyscanner",
    extra: SkyscannerExtra
  };
}

registerLink("meta", printSkyscanner);
