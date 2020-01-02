import mptUserSettings, { registerSetting } from "../../settings/userSettings";
import { printNotification } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

const aaEditions = [
  { value: "en_AU", name: "Australia" },
  { value: "en_BE", name: "Belgium" },
  { value: "en_CN", name: "China" },
  { value: "en_DK", name: "Denmark" },
  { value: "en_FI", name: "Finland" },
  { value: "en_FR", name: "France / English" },
  { value: "fr_FR", name: "France / French" },
  { value: "en_DE", name: "Germany / English" },
  { value: "de_DE", name: "Germany / Deutsch" },
  { value: "en_GR", name: "Greece" },
  { value: "en_HK", name: "Hong Kong" },
  { value: "en_IN", name: "India" },
  { value: "en_IE", name: "Ireland" },
  { value: "en_IL", name: "Israel" },
  { value: "en_IT", name: "Italy" },
  { value: "en_JP", name: "Japan" },
  { value: "en_KR", name: "Korea" },
  { value: "en_NL", name: "Netherlands" },
  { value: "en_NZ", name: "New Zealand" },
  { value: "en_NO", name: "Norway" },
  { value: "en_PT", name: "Portugal" },
  { value: "en_RU", name: "Russia" },
  { value: "en_ES", name: "Spain / English" },
  { value: "es_ES", name: "Spain / Spanish" },
  { value: "en_SE", name: "Sweden" },
  { value: "en_CH", name: "Switzerland" }
];

function printAA() {
  var createUrl = function(edition) {
    var url =
      "http://i11l-services.aa.com/xaa/mseGateway/entryPoint.php?PARAM=";
    var search = "1,,USD0.00," + currentItin.itin.length + ",";
    var legs = new Array();
    var leg = "";
    var segs = new Array();
    var seg = "";

    //Build multi-city search based on legs
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      segs = new Array();
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        //walks each segment of leg
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
        seg =
          currentItin.itin[i].seg[j + k].arr.year +
          "-" +
          ("0" + currentItin.itin[i].seg[j + k].arr.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j + k].arr.day).slice(-2) +
          "T" +
          ("0" + currentItin.itin[i].seg[j + k].arr.time).slice(-5) +
          (typeof currentItin.itin[i].seg[j + k].arr.offset == "undefined"
            ? "+00:00"
            : currentItin.itin[i].seg[j + k].arr.offset) +
          ",";
        seg += currentItin.itin[i].seg[j].bookingclass + ",";
        seg +=
          currentItin.itin[i].seg[j].dep.year +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          "T" +
          ("0" + currentItin.itin[i].seg[j].dep.time).slice(-5) +
          (typeof currentItin.itin[i].seg[j].dep.offset == "undefined"
            ? "+00:00"
            : currentItin.itin[i].seg[j].dep.offset) +
          ",";
        seg += currentItin.itin[i].seg[j + k].dest + ",";
        seg +=
          currentItin.itin[i].seg[j].carrier +
          currentItin.itin[i].seg[j].fnr +
          ",";
        seg += currentItin.itin[i].seg[j].orig; // NO , here!
        segs.push(seg);
        j += k;
      }
      search += segs.length + "," + segs.join() + ",";
      //build leg structure
      leg =
        currentItin.itin[i].dep.year +
        "-" +
        ("0" + currentItin.itin[i].dep.month).slice(-2) +
        "-" +
        ("0" + currentItin.itin[i].dep.day).slice(-2) +
        ",";
      leg += currentItin.itin[i].dest + ",,";
      leg += currentItin.itin[i].orig + ","; // USE , here!
      legs.push(leg);
    }
    search += "DIRECT,";
    search += edition[0].toUpperCase() + ","; // Language
    search += "3,";
    // validate Passengers here: Max Paxcount = 7 (Infs not included) - >11 = Adult - InfSeat = Child
    var pax = validatePaxcount({
      maxPaxcount: 7,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printAA");
      return;
    }
    search += pax.adults + ","; // ADT
    search += pax.children.length + ","; // Child
    search += pax.infLap + ","; // Inf
    search += "0,"; // Senior
    search += edition[1].toUpperCase() + ","; // Country
    // push outer search
    search += currentItin.itin.length + "," + legs.join();
    url += encodeURIComponent(search);
    return url;
  };

  // get edition
  var edition = mptUserSettings.aaEdition.split("_");
  if (edition.length != 2) {
    printNotification("Error:Invalid AA-Edition");
    return;
  }
  var url = createUrl(edition);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += aaEditions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.value.split("_")) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "American",
    desc: "Europe/Asia/Pacific",
    extra
  };
}

registerLink("airlines", printAA);
registerSetting(
  "American (Europe/Asia/Pacific)",
  "aaEdition",
  aaEditions,
  "en_DE"
);
