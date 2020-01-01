import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import { currentItin } from "../../parse/itin";
import { registerLink } from "../../print/links";

const MomondoEditions = [
  { name: "Momondo.com", host: "Momondo.com" },
  { name: "Momondo.de", host: "Momondo.de" },
  { name: "Momondo.it", host: "Momondo.it" },
  { name: "Momondo.es", host: "Momondo.es" },
  { name: "Momondo.co.uk", host: "Momondo.co.uk" },
  { name: "Momondo.dk", host: "Momondo.dk" },
  { name: "Momondo.mx", host: "Momondo.mx" },
  { name: "Momondo.fi", host: "Momondo.fi" },
  { name: "Momondo.fr", host: "Momondo.fr" },
  { name: "Momondo.no", host: "Momondo.no" },
  { name: "Momondo.nl", host: "Momondo.nl" },
  { name: "Momondo.pt", host: "Momondo.pt" },
  { name: "Momondo.se", host: "Momondo.se" },
  { name: "Momondo.ru", host: "Momondo.ru" }
];

function printMomondo() {
  //example https://www.Momondo.ru/flightsearch/?...false&NA=false
  //pax # &AD=2&CA=0,8 – not working with children (total amount of adults + kids goes to adult)

  var momondoTravelClass = ["economy", "premium", "business", "first"];
  var mincabin = 3;

  var MomondoCreateUrl = function(host) {
    var MomondoUrl = "https://www." + host + "/flight-search/";
    for (var i = 0; i < currentItin.itin.length; i++) {
      MomondoUrl +=
        currentItin.itin[i].orig +
        "-" +
        currentItin.itin[i].dest +
        "/" +
        currentItin.itin[i].dep.year +
        "-" +
        ("0" + currentItin.itin[i].dep.month).slice(-2) +
        "-" +
        ("0" + currentItin.itin[i].dep.day).slice(-2) +
        "/";

      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        // check the min cabin:
        if (currentItin.itin[i].seg[j].cabin < mincabin) {
          mincabin = currentItin.itin[i].seg[j].cabin;
        }
      }
    }

    // Add travel class to URL:
    MomondoUrl +=
      momondoTravelClass[
        mptSettings.cabin === "Auto" ? mincabin : getForcedCabin()
      ] + "/";
    // Add passenger info to URL:
    MomondoUrl += currentItin.numPax + "adults";
    return MomondoUrl;
  };

  var MomondoUrl = MomondoCreateUrl("Momondo.com");
  var MomondoExtra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  MomondoExtra += MomondoEditions.map(function(obj, i) {
    return (
      '<a href="' +
      MomondoCreateUrl(obj.host) +
      '" target="_blank">' +
      obj.name +
      "</a>"
    );
  }).join("<br/>");
  MomondoExtra += "</span></span>";

  return {
    url: MomondoUrl,
    title: "Momondo",
    extra: MomondoExtra
  };
}

registerLink("meta", printMomondo);
