import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import { printNotification } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

const editions = [
  { name: "expedia.com", host: "expedia.com" },
  { name: "orbitz.com", host: "orbitz.com" },
  { name: "expedia.ca", host: "expedia.ca" },
  { name: "expedia.de", host: "expedia.de" },
  { name: "expedia.it", host: "expedia.it" },
  { name: "expedia.es", host: "expedia.es" },
  { name: "expedia.co.uk", host: "expedia.co.uk" },
  { name: "expedia.dk", host: "expedia.dk" },
  { name: "expedia.mx", host: "expedia.mx" },
  { name: "expedia.fi", host: "expedia.fi" },
  { name: "expedia.fr", host: "expedia.fr" },
  { name: "expedia.no", host: "expedia.no" },
  { name: "expedia.nl", host: "expedia.nl" },
  { name: "expedia.ch", host: "expedia.ch" },
  { name: "expedia.se", host: "expedia.se" },
  { name: "expedia.at", host: "expedia.at" },
  { name: "expedia.co.jp", host: "expedia.co.jp" }
];

function printExpedia() {
  var pax = validatePaxcount({
    maxPaxcount: 9,
    countInf: true,
    childAsAdult: 18,
    sepInfSeat: false,
    childMinAge: 2
  });
  if (!pax) {
    printNotification("Error: Failed to validate Passengers in printExpedia");
    return;
  }
  let expediaClasses = ["coach", "premium", "business", "first"];
  let minCabin = 3;
  let ExpediaCreateUrl = function(expediaBase) {
    let segUrl = "";
    for (var i = 0; i < currentItin.itin.length; i++) {
      segUrl +=
        "&legs%5B" + i + "%5D.departureAirport=" + currentItin.itin[i].orig;
      segUrl +=
        "&legs%5B" + i + "%5D.arrivalAirport=" + currentItin.itin[i].dest;
      segUrl +=
        "&legs%5B" +
        i +
        "%5D.departureDate=" +
        currentItin.itin[i].arr.year.toString() +
        "-" +
        ("0" + currentItin.itin[i].dep.month).slice(-2) +
        "-" +
        ("0" + currentItin.itin[i].dep.day).slice(-2);
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        segUrl += (
          "&legs%5B" +
          i +
          "%5D.segments%5B" +
          j +
          "%5D=" +
          currentItin.itin[i].seg[j].dep.year.toString() +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          "-" +
          expediaClasses[
            mptSettings.cabin === "Auto" ? minCabin : getForcedCabin()
          ] +
          "-" +
          currentItin.itin[i].seg[j].orig +
          "-" +
          currentItin.itin[i].seg[j].dest +
          "-" +
          currentItin.itin[i].seg[j].carrier +
          "-" +
          currentItin.itin[i].seg[j].fnr
        ).toLowerCase();

        // check the min cabin:
        if (currentItin.itin[i].seg[j].cabin < minCabin) {
          minCabin = currentItin.itin[i].seg[j].cabin;
        }
      }
    }
    // Build the URL:
    let baseUrl =
      "https://www." +
      expediaBase +
      "/Flight-Search-Details?action=dl&trip=MultipleDestination";
    // Add travel class to URL:
    baseUrl +=
      "&cabinClass=" +
      expediaClasses[
        mptSettings.cabin === "Auto" ? minCabin : getForcedCabin()
      ];
    // Add passenger info to URL:
    baseUrl += "&adults=" + pax.adults;
    return baseUrl + segUrl;
  };
  var ExpediaUrl = ExpediaCreateUrl("expedia.com");
  var container =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  container += editions
    .map(function(obj, i) {
      return (
        '<a href="' +
        ExpediaCreateUrl(obj.host) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  container += "</span></span>";

  return {
    url: ExpediaUrl,
    title: "Expedia",
    extra: container
  };
}

registerLink("otas", printExpedia);
