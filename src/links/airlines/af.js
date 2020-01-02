import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import mptUserSettings, { registerSetting } from "../../settings/userSettings";
import { printNotification } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

const afEditions = [
  { value: "DE/de", name: "Germany / Deutsch" },
  { value: "DE/en", name: "Germany / English" },
  { value: "FR/en", name: "France / English" },
  { value: "FI/en", name: "Finland / English" },
  { value: "FR/fr", name: "France / French" },
  { value: "NL/en", name: "Netherlands / English" },
  { value: "GB/en", name: "United Kingdom / English" },
  { value: "US/en", name: "US / English" }
];

function printAF() {
  var createUrl = function(edition) {
    if (
      !mptUserSettings.showAllAirlines &&
      !(
        currentItin.itin &&
        currentItin.itin.length == 2 &&
        currentItin.itin[0].orig == currentItin.itin[1].dest &&
        currentItin.itin[0].dest == currentItin.itin[1].orig
      )
    ) {
      return;
    }

    var cabins = ["Y", "W", "C", "F"];
    var mincabin = 3;
    var afUrl =
      "https://www.airfrance.com/" +
      edition +
      "/local/process/standardbooking/DisplayUpsellAction.do?calendarSearch=1&subCabin=MCHER&typeTrip=2";
    for (var i = 0; i < currentItin.itin.length; i++) {
      if (i == 0) {
        afUrl += "&from=" + currentItin.itin[i].orig;
        afUrl += "&to=" + currentItin.itin[i].dest;
        afUrl +=
          "&outboundDate=" +
          currentItin.itin[i].dep.year +
          "-" +
          ("0" + currentItin.itin[i].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].dep.day).slice(-2);
        afUrl +=
          "&firstOutboundHour=" +
          ("0" + currentItin.itin[i].dep.time).slice(-5);

        let flights = "";
        for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
          if (j > 0) flights += "|";
          flights +=
            currentItin.itin[i].seg[j].carrier +
            ("000" + currentItin.itin[i].seg[j].fnr).slice(-4);
        }
        afUrl += "&flightOutbound=" + flights;
      } else if (i == 1) {
        afUrl +=
          "&inboundDate=" +
          currentItin.itin[i].dep.year +
          "-" +
          ("0" + currentItin.itin[i].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].dep.day).slice(-2);
        afUrl +=
          "&firstInboundHour=" + ("0" + currentItin.itin[i].dep.time).slice(-5);

        let flights = "";
        for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
          if (j > 0) flights += "|";
          flights +=
            currentItin.itin[i].seg[j].carrier +
            ("000" + currentItin.itin[i].seg[j].fnr).slice(-4);
          if (currentItin.itin[i].seg[j].cabin < mincabin) {
            mincabin = currentItin.itin[i].seg[j].cabin;
          }
        }
        afUrl += "&flightInbound=" + flights;
      }
    }
    afUrl +=
      "&cabin=" +
      cabins[mptSettings.cabin === "Auto" ? mincabin : getForcedCabin()];
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: true,
      childAsAdult: 18,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printAF");
      return;
    }
    var tmpPax = { c: 0, y: 0 };
    for (i = 0; i < pax.children.length; i++) {
      if (pax.children[i] > 11) {
        tmpPax.y++;
      } else {
        tmpPax.c++;
      }
    }
    var curPax = 0;
    afUrl += "&nbAdults=" + pax.adults;
    for (i = 0; i < pax.adults; i++) {
      afUrl += "&paxTypoList=ADT";
      curPax++;
    }
    afUrl += "&nbEnfants=" + tmpPax.y;
    for (i = 0; i < tmpPax.y; i++) {
      afUrl += "&paxTypoList=YTH_MIN";
      curPax++;
    }
    afUrl += "&nbChildren=" + tmpPax.c;
    for (i = 0; i < tmpPax.y; i++) {
      afUrl += "&paxTypoList=CHD";
      curPax++;
    }
    afUrl += "&nbBebes=" + pax.infLap;
    for (i = 0; i < pax.infLap; i++) {
      afUrl += "&paxTypoList=INF";
      curPax++;
    }
    afUrl += "&nbPassenger=" + curPax + "&nbPax=" + curPax;
    return afUrl;
  };
  // get edition
  var edition = mptUserSettings.afEdition;
  var url = createUrl(edition);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += afEditions
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
    url,
    title: "Air France",
    extra
  };
}

registerLink("airlines", printAF);
registerSetting("Air France", "afEdition", afEditions, "US/en");
