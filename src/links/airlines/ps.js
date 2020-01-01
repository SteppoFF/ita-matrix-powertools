import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

function printPS() {
  if (
    !mptUserSettings.showAllAirlines &&
    !inArray("PS", currentItin.carriers)
  ) {
    return;
  }

  var createUrl = function(edition, currency) {
    // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
    var cabins = ["Economy", "Economy", "Business", "First"];
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printPS");
      return false;
    }
    var url =
      "https://bookapi.flyuia.com/flights/metaSearchQuery?Adult=" +
      pax.adults +
      "&Child=" +
      pax.children.length +
      "&Infant=" +
      pax.infLap +
      "&PointOfSaleCountry=" +
      edition[1] +
      "&UserCurrency=" +
      currency +
      "&UserLanguage=" +
      edition[0] +
      "&TripType=";
    if (currentItin.itin.length == 1) {
      url += "OneWay";
    } else if (
      currentItin.itin.length == 2 &&
      currentItin.itin[0].orig == currentItin.itin[1].dest &&
      currentItin.itin[0].dest == currentItin.itin[1].orig
    ) {
      url += "RoundTrip";
    } else {
      url += "MultiCity";
    }

    var seg = 0;
    var slice = 1;
    var slicestr = "";
    //Build multi-city search based on legs
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        seg++;
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
        url += "&Origin" + seg + "=" + currentItin.itin[i].seg[j].orig;
        url += "&Destination" + seg + "=" + currentItin.itin[i].seg[j + k].dest;
        url += "&Carrier" + seg + "=" + currentItin.itin[i].seg[j].carrier;
        url +=
          "&DepartureDate" +
          seg +
          "=" +
          currentItin.itin[i].seg[j].dep.year +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2);
        url += "&FlightNumber" + seg + "=" + currentItin.itin[i].seg[j].fnr;
        url +=
          "&BookingCode" + seg + "=" + currentItin.itin[i].seg[j].bookingclass;
        url += "&Cabin" + seg + "=" + cabins[currentItin.itin[i].seg[j].cabin];
        slicestr += (slicestr === "" ? "" : "%2C") + seg;
        j += k;
      }
      url += "&Slice" + slice + "=" + slicestr;
      slice++;
      slicestr = "";
    }
    return url;
  };
  var url = createUrl(["EN", "US"], "USD");
  if (!url) {
    return;
  }

  return {
    url,
    title: "UIA"
  };
}

registerLink("airlines", printPS);
