import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

export const qfEditions = [
  { value: "EN_AU", name: "Australia" },
  { value: "EN_NZ", name: "New Zealand" },
  { value: "EN_US", name: "United States" }
];

export const qfCurrencies = [
  { value: "AUD", name: "AUD" },
  { value: "NZD", name: "NZD" },
  { value: "USD", name: "USD" }
];

function printQF() {
  if (
    !mptUserSettings.showAllAirlines &&
    !(
      inArray("QF", currentItin.carriers) ||
      inArray("JQ", currentItin.carriers) ||
      inArray("NZ", currentItin.carriers)
    )
  ) {
    return;
  }

  /* Qantas partner deep-link */
  var createUrl = function(edition, currency) {
    // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
    var travelClass = ["ECO", "PRM", "BUS", "FIR"];
    // Start the minimum cabin at highest possible (it will drop as we check each leg):
    var mincabin = 3;
    // Validate the passenger totals first:
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 16,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printQF");
      return false;
    }
    var nbrChildren = pax.children.length;
    if (!nbrChildren || typeof nbrChildren === "undefined") {
      // default to 0 children if undefined:
      nbrChildren = 0;
    }

    // Build search based on legs:
    console.log("printQF: begin leg traversal...");
    var url = "";
    var prefixFltNbr = "sdcFlightNumber";
    var prefixSegRbd = "sdcSegmentRbd";
    var depAirports = "&depAirports=";
    var destAirports = "&destAirports=";
    var segDepAirports = "&depAirports=";
    var segDestAirports = "&destAirports=";
    var tmpTravelDates = "";
    var finalDest = currentItin.itin[0].seg[0].dest;

    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each parent "leg" of the itinerary (a leg can have multiple flight segments)

      // Record the travel date for each leg:
      if (tmpTravelDates === "" || !tmpTravelDates) {
        tmpTravelDates +=
          currentItin.itin[i].dep.year.toString() +
          ("0" + currentItin.itin[i].dep.month).slice(-2).toString() +
          ("0" + currentItin.itin[i].dep.day).slice(-2).toString() +
          "0000";
      } else {
        tmpTravelDates +=
          "%2C" +
          currentItin.itin[i].dep.year.toString() +
          ("0" + currentItin.itin[i].dep.month).slice(-2).toString() +
          ("0" + currentItin.itin[i].dep.day).slice(-2).toString() +
          "0000";
      }

      // Grab the origin airport of each leg:
      if (segDepAirports.length > 13) segDepAirports += "%2C";
      segDepAirports += currentItin.itin[i].orig.toString();
      // Grab the destination airport of each leg:
      if (segDestAirports.length > 14) segDestAirports += "%2C";
      segDestAirports += currentItin.itin[i].dest.toString();

      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        // walks each flight segment of the parent leg
        var k = 0;
        // Do we need to skip segments? fnr has to be the same and it must be just a layover:
        while (j + k < currentItin.itin[i].seg.length - 1) {
          if (
            currentItin.itin[i].seg[j + k].fnr !=
              currentItin.itin[i].seg[j + k + 1].fnr ||
            currentItin.itin[i].seg[j + k].layoverduration >= 1440
          ) {
            break;
          }
          k++;
        }
        // Construct URL for this leg:
        url +=
          "&" +
          prefixFltNbr +
          (i + 1) +
          (j + 1) +
          "=" +
          currentItin.itin[i].seg[j].carrier +
          currentItin.itin[i].seg[j].fnr;
        url +=
          "&" +
          prefixSegRbd +
          (i + 1) +
          (j + 1) +
          "=" +
          currentItin.itin[i].seg[j].bookingclass;

        // record the departing and destination airports for this leg:
        // all departing airports:
        if (depAirports.length > 13) depAirports += "%2C";
        depAirports += currentItin.itin[i].seg[j].orig.toString();
        // all destination airports:
        if (destAirports.length > 14) destAirports += "%2C";
        destAirports += currentItin.itin[i].seg[j].dest.toString();

        if (currentItin.itin[i].seg[j].cabin < mincabin) {
          mincabin = currentItin.itin[i].seg[j].cabin;
        }
        j += k;
      }
    }

    // Add airports:
    // url += depAirports + destAirports;
    url += segDepAirports + segDestAirports;
    // Add travel dates:
    url += "&travelDates=" + tmpTravelDates;
    // Add price info:
    url += "&sdcTripPriceAmount=0.00";
    // Add device type:
    url += "&QFdeviceType=desktop";

    // Begin final deeplink URL construction:
    var urlBase =
      "https://book.qantas.com/qf-booking/dyn/air/tripflow.redirect?APPLICATION_NAME=SDC";
    // Add edition / locale:
    urlBase += "&USER_LANG=EN&USER_LOCALE=" + edition;
    // Add class(es) of service:
    urlBase +=
      "&travelClass=" +
      travelClass[mptSettings.cabin === "Auto" ? mincabin : getForcedCabin()];
    // Add passenger info:
    urlBase +=
      "&numberOfAdults=" +
      pax.adults +
      "&numberOfChildren=" +
      nbrChildren.toString() +
      "&numberOfInfants=" +
      pax.infLap;
    // Add currency:
    urlBase += "&sdcPriceCurrency=" + currency;

    return urlBase + url;
  };
  // get edition
  var url = createUrl(mptUserSettings.qfEdition, mptUserSettings.qfCurrency);
  if (!url) {
    return;
  }

  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += qfEditions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.value, mptUserSettings.qfCurrency) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "Qantas",
    extra
  };
}

registerLink("airlines", printQF);
