import { getCabin } from "../../settings/appSettings";
import mptUserSettings, { registerSetting } from "../../settings/userSettings";
import {
  printNotification,
  to2digits,
  to4digits,
  to4digitTime,
  inArray
} from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin, getCurrentSegs } from "../../parse/itin";

const klEditions = [
  { value: "de_de", name: "Germany / Deutsch" },
  { value: "de_en", name: "Germany / English" },
  { value: "fr_en", name: "France / English" },
  { value: "fr_fr", name: "France / French" },
  { value: "nl_en", name: "Netherlands / English" },
  { value: "gb_en", name: "United Kingdom / English" },
  { value: "us_en", name: "US / English" }
];

const cabins = ["M", "W", "C", "F"];

function printKL() {
  if (
    !mptUserSettings.showAllAirlines &&
    !inArray("KL", currentItin.carriers)
  ) {
    return;
  }

  var createUrl = function(edition) {
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

    const segs = getCurrentSegs();

    let url =
      "https://www.klm.com/ams/search-web/api/metasearch?application=EBT7";
    url +=
      "&trip=" +
      segs
        .map(
          seg =>
            `${seg.orig}:${seg.dep.year}${to2digits(seg.dep.month)}${to2digits(
              seg.dep.day
            )}@${to4digitTime(seg.dep.time)}:${seg.carrier}${to4digits(
              seg.fnr
            )}:${seg.bookingclass}>${seg.dest}`
        )
        .join("-");
    url += "&ref=MS,fb=" + currentItin.farebases.join(".");
    url += "&numberOfAdults=" + pax.adults;
    url += "&numberOfChildren=" + pax.children.length;
    url += "&numberOfInfants=" + pax.infLap;
    url +=
      "&cabinClass=" +
      cabins[getCabin(Math.min(...segs.map(seg => seg.cabin)))];
    url += "&country=" + edition[0];
    url += "&language=" + edition[1];

    return url;
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
registerSetting("KLM", "klEdition", klEditions, "us_en");
