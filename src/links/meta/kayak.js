import mptSettings from "../../settings/appSettings";
import mptUserSettings from "../../settings/userSettings";
import { registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

const KayakEditions = [
  { name: "Kayak.com", host: "Kayak.com" },
  { name: "Kayak.de", host: "Kayak.de" },
  { name: "Kayak.it", host: "Kayak.it" },
  { name: "Kayak.es", host: "Kayak.es" },
  { name: "Kayak.co.uk", host: "Kayak.co.uk" },
  { name: "Kayak.dk", host: "Kayak.dk" },
  { name: "Kayak.mx", host: "Kayak.mx" },
  { name: "Kayak.fi", host: "Kayak.fi" },
  { name: "Kayak.fr", host: "Kayak.fr" },
  { name: "Kayak.no", host: "Kayak.no" },
  { name: "Kayak.nl", host: "Kayak.nl" },
  { name: "Kayak.pt", host: "Kayak.pt" },
  { name: "Kayak.se", host: "Kayak.se" },
  { name: "Kayak.ru", host: "Kayak.ru" }
];

function printKayak(method) {
  //example https://www.Kayak.ru/flights/MOW-CPH...OW/2016-05-20/
  // pax: #adults
  // method: 0 = based on leg; 1 = based on segment
  let desc;
  var KayakCreateUrl = function(host) {
    var KayakUrl = "https://www." + host + "/flights";
    var segsize = 0;
    for (var i = 0; i < currentItin.itin.length; i++) {
      if (method != 1) {
        KayakUrl += "/" + currentItin.itin[i].orig;
        KayakUrl += "-" + currentItin.itin[i].dest;
        KayakUrl +=
          "/" +
          currentItin.itin[i].dep.year +
          "-" +
          ("0" + currentItin.itin[i].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].dep.day).slice(-2);
        segsize++;
      }
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        if (method == 1) {
          var k = 0;
          // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
          while (j + k < currentItin.itin[i].seg.length - 1) {
            if (
              currentItin.itin[i].seg[j + k].fnr !=
                currentItin.itin[i].seg[j + k + 1].fnr ||
              currentItin.itin[i].seg[j + k].layoverduration >= 1440
            )
              break;
            k++;
          }
          KayakUrl += "/" + currentItin.itin[i].seg[j].orig;
          KayakUrl += "-" + currentItin.itin[i].seg[j + k].dest;
          KayakUrl +=
            "/" +
            currentItin.itin[i].seg[j].dep.year +
            "-" +
            ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
            "-" +
            ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2);
          j += k;
          segsize++;
        }
      }
    }
    if (currentItin.numPax > 1) {
      KayakUrl += "/" + currentItin.numPax + "adults";
    }

    KayakUrl += getKayakCabin();

    if (method == 1) {
      if (mptUserSettings.language == "de") {
        desc = "Benutze " + segsize + " Segment(e)";
      } else {
        desc = "Based on " + segsize + " segment(s)";
      }
    } else {
      if (segsize == 1) {
        return false;
      }
      if (mptUserSettings.language == "de") {
        desc = "Benutze " + segsize + " Abschnitt(e)";
      } else {
        desc = "Based on " + segsize + " segment(s)";
      }
    }
    return KayakUrl;
  };
  var KayakUrl = KayakCreateUrl("Kayak.com");
  if (!KayakUrl) {
    return;
  }
  var KayakExtra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  KayakExtra += KayakEditions.map(function(obj, i) {
    return (
      '<a href="' +
      KayakCreateUrl(obj.host) +
      '" target="_blank">' +
      obj.name +
      "</a>"
    );
  }).join("<br/>");
  KayakExtra += "</span></span>";

  return {
    url: KayakUrl,
    title: "Kayak",
    desc,
    extra: KayakExtra
  };
}

function getKayakCabin() {
  switch (mptSettings.cabin) {
    case "Y+":
      return "/premium";
    case "C":
      return "/business";
    case "F":
      return "/first";
    default:
      return "/economy";
  }
}

registerLink("meta", printKayak);
