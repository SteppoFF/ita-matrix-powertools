import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

export const azEditions = [
  { value: "de_de", name: "Germany / Deutsch" },
  { value: "at_de", name: "Austria / Deutsch" },
  { value: "ch_de", name: "Switzerland / Deutsch" },
  { value: "fr_fr", name: "France / French" },
  { value: "nl_nl", name: "Netherlands / Dutch" },
  { value: "it_it", name: "Italy / Italian" },
  { value: "ca_en", name: "Canada / Englisch" },
  { value: "us_en", name: "US / Englisch" },
  { value: "gb_en", name: "GB / Englisch" },
  { value: "en_en", name: "International / Englisch" }
];

function printAZ() {
  if (
    !mptUserSettings.showAllAirlines &&
    !(currentItin.carriers.length == 1 && inArray("AZ", currentItin.carriers))
  ) {
    return;
  }

  var createUrl = function(edition) {
    var azUrl =
      "https://www.alitalia.com/" +
      edition +
      "/home-page.metasearch.json?SearchType=BrandMetasearch";
    var cabins = ["Economy", "Economy", "Business", "First"];
    var seg = 0;
    for (var i = 0; i < currentItin.itin.length; i++) {
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        azUrl +=
          "&MetaSearchDestinations[" +
          seg +
          "].From=" +
          currentItin.itin[i].seg[j].orig;
        azUrl +=
          "&MetaSearchDestinations[" +
          seg +
          "].To=" +
          currentItin.itin[i].seg[j].dest;
        azUrl +=
          "&MetaSearchDestinations[" +
          seg +
          "].DepartureDate=" +
          currentItin.itin[i].seg[j].dep.year +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          ":" +
          ("0" + currentItin.itin[i].seg[j].dep.time).slice(-5);
        azUrl +=
          "&MetaSearchDestinations[" +
          seg +
          "].ArrivalDate=" +
          currentItin.itin[i].seg[j].arr.year +
          "-" +
          ("0" + currentItin.itin[i].seg[j].arr.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].arr.day).slice(-2) +
          ":" +
          ("0" + currentItin.itin[i].seg[j].arr.time).slice(-5);
        azUrl +=
          "&MetaSearchDestinations[" +
          seg +
          "].Flight=" +
          currentItin.itin[i].seg[j].fnr;
        azUrl +=
          "&MetaSearchDestinations[" +
          seg +
          "].code=" +
          currentItin.itin[i].seg[j].farebase;
        azUrl += "&MetaSearchDestinations[" + seg + "].MseType=";
        azUrl +=
          "&MetaSearchDestinations[" +
          seg +
          "].bookingClass=" +
          currentItin.itin[i].seg[j].bookingclass;
        azUrl +=
          "&MetaSearchDestinations[" +
          seg +
          "].cabinClass=" +
          cabins[currentItin.itin[i].seg[j].cabin];
        azUrl += "&MetaSearchDestinations[" + seg + "].slices=" + i;
        seg++;
      }
    }
    var pax = validatePaxcount({
      maxPaxcount: 7,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printAZ");
      return false;
    }
    azUrl +=
      "&children_number=" +
      pax.children.length +
      "&newborn_number=" +
      pax.infLap +
      "&adult_number=" +
      pax.adults;
    return azUrl;
  };
  // get edition
  var edition = mptUserSettings.azEdition;
  var azUrl = createUrl(edition);
  if (!azUrl) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += azEditions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.value) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url: azUrl,
    title: "Alitalia",
    extra
  };
}

registerLink("airlines", printAZ);
