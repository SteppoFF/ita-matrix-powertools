import mptUserSettings from "../../settings/userSettings";
import { printNotification } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

export const klEditions = [
  { value: "de_de", name: "Germany / Deutsch" },
  { value: "de_en", name: "Germany / English" },
  { value: "fr_en", name: "France / English" },
  { value: "fr_fr", name: "France / French" },
  { value: "nl_en", name: "Netherlands / English" },
  { value: "gb_en", name: "United Kingdom / English" },
  { value: "us_en", name: "US / English" }
];

function printKL() {
  var createUrl = function(edition) {
    var klUrl = "https://www.klm.com/travel/";
    klUrl +=
      edition[0] +
      "_" +
      edition[1] +
      "/apps/ebt/ebt_home.htm?lang=" +
      edition[1].toUpperCase();
    klUrl += "&dev=5&cffcc=ECONOMY";
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printKL");
      return;
    }
    klUrl +=
      "&adtQty=" +
      pax.adults +
      "&chdQty=" +
      pax.children.length +
      "&infQty=" +
      pax.infLap;
    var fb = "";
    var oper = "";
    for (var i = 0; i < currentItin.itin.length; i++) {
      klUrl += "&c[" + i + "].os=" + currentItin.itin[i].orig;
      klUrl += "&c[" + i + "].ds=" + currentItin.itin[i].dest;
      klUrl +=
        "&c[" +
        i +
        "].dd=" +
        currentItin.itin[i].dep.year +
        "-" +
        ("0" + currentItin.itin[i].dep.month).slice(-2) +
        "-" +
        ("0" + currentItin.itin[i].dep.day).slice(-2);
      if (i > 0) oper += "..";
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        klUrl +=
          "&c[" + i + "].s[" + j + "].os=" + currentItin.itin[i].seg[j].orig;
        klUrl +=
          "&c[" + i + "].s[" + j + "].ds=" + currentItin.itin[i].seg[j].dest;
        klUrl +=
          "&c[" +
          i +
          "].s[" +
          j +
          "].dd=" +
          currentItin.itin[i].seg[j].dep.year +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2);
        klUrl +=
          "&c[" +
          i +
          "].s[" +
          j +
          "].dt=" +
          ("0" + currentItin.itin[i].seg[j].dep.time.replace(":", "")).slice(
            -4
          );
        klUrl +=
          "&c[" + i + "].s[" + j + "].mc=" + currentItin.itin[i].seg[j].carrier;
        klUrl +=
          "&c[" +
          i +
          "].s[" +
          j +
          "].fn=" +
          ("000" + currentItin.itin[i].seg[j].fnr).slice(-4);

        if (j > 0) oper += ".";
        oper += currentItin.itin[i].seg[j].carrier;
      }
    }

    for (var i = 0; i < currentItin.farebases.length; i++) {
      if (i > 0) fb += ",";
      fb += currentItin.farebases[i];
    }

    klUrl += "&ref=fb=" + fb; //+',oper='+oper;
    return klUrl;
  };
  // get edition
  var edition = mptUserSettings.klEdition.split("_");
  if (edition.length != 2) {
    printNotification("Error:Invalid KLM-Edition");
    return;
  }
  var url = createUrl(edition);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += klEditions
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
    title: "KLM",
    extra
  };
}

registerLink("airlines", printKL);
