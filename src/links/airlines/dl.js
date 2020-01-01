import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import mptUserSettings from "../../settings/userSettings";
import { printNotification, monthnumberToName } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

export const dlEditions = [
  { value: "de_de", name: "Germany" },
  { value: "www_us", name: "US" }
];

function printDL() {
  /* Steppo: What about farebasis?
   * What about segmentskipping? */
  var createUrl = function(edition) {
    // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
    // Defaults for cabin identifiers for DL pricing engine; exceptions handled later
    var cabins = ["MAIN", "DPPS", "BU", "FIRST"];
    var mincabin = 3;
    var farebases = new Array();
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: true,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printDL");
      return;
    }

    var deltaURL =
      "http://" +
      edition[0] +
      ".delta.com/air-shopping/priceTripAction.action?ftw_reroute=true&tripType=multiCity";
    deltaURL += "&currencyCd=" + (currentItin.cur == "EUR" ? "EUR" : "USD");
    deltaURL += "&exitCountry=" + edition[1];
    var segcounter = 0;
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        //walks each segment of leg
        deltaURL +=
          "&itinSegment[" +
          segcounter.toString() +
          "]=" +
          i.toString() +
          ":" +
          currentItin.itin[i].seg[j].bookingclass;
        deltaURL +=
          ":" +
          currentItin.itin[i].seg[j].orig +
          ":" +
          currentItin.itin[i].seg[j].dest +
          ":" +
          currentItin.itin[i].seg[j].carrier +
          ":" +
          currentItin.itin[i].seg[j].fnr;
        deltaURL +=
          ":" +
          monthnumberToName(currentItin.itin[i].seg[j].dep.month) +
          ":" +
          (currentItin.itin[i].seg[j].dep.day < 10 ? "0" : "") +
          currentItin.itin[i].seg[j].dep.day +
          ":" +
          currentItin.itin[i].seg[j].dep.year +
          ":0";
        farebases.push(currentItin.itin[i].seg[j].farebase);
        if (currentItin.itin[i].seg[j].cabin < mincabin) {
          mincabin = currentItin.itin[i].seg[j].cabin;
        }
        // Exceptions to cabin identifiers for pricing
        switch (currentItin.itin[i].seg[j].bookingclass) {
          // Basic Economy fares
          case "E":
            cabins[0] = "BASIC-ECONOMY";
            break;
          // Comfort+ fares
          case "W":
            cabins[1] = "DCP";
            break;
          default:
        }
        segcounter++;
      }
    }
    deltaURL +=
      "&cabin=" +
      cabins[mptSettings.cabin === "Auto" ? mincabin : getForcedCabin()];
    deltaURL += "&fareBasis=" + farebases.join(":");
    //deltaURL += "&price=0";
    deltaURL +=
      "&numOfSegments=" +
      segcounter.toString() +
      "&paxCount=" +
      (pax.adults + pax.children.length + pax.infLap);
    deltaURL += "&vendorRedirectFlag=true&vendorID=Google";
    return deltaURL;
  };
  // get edition
  var edition = mptUserSettings.dlEdition.split("_");
  if (edition.length != 2) {
    printNotification("Error:Invalid Delta-Edition");
    return;
  }
  var url = createUrl(edition);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += dlEditions
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
    title: "Delta",
    extra
  };
}

registerLink("airlines", printDL);
