import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

function printAS() {
  if (
    !mptUserSettings.showAllAirlines &&
    !inArray("AS", currentItin.carriers)
  ) {
    return;
  }

  // validate Passengers here: Max Paxcount = 7 (Infs not included) - >11 = Adult - InfSeat = Child
  var createUrl = function() {
    var pax = validatePaxcount({
      maxPaxcount: 6,
      countInf: true,
      childAsAdult: 6,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printAAc1");
      return;
    }
    var url = "https://www.alaskaair.com/planbook/shoppingstart?";
    url += "A=" + pax.adults + "&C=" + pax.children.length + "&FT=";
    if (currentItin.itin.length == 1) {
      url += "ow";
    } else {
      url += "rt";
    }

    var k = 0;
    //Build multi-city search based on legs
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        //walks each segment of leg
        var itinseg =
          currentItin.itin[i].seg[j].orig +
          "|" +
          currentItin.itin[i].seg[j].dest;
        itinseg +=
          "|" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "/" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2);
        itinseg += "/" + currentItin.itin[i].seg[j].dep.year;
        itinseg += "|" + currentItin.itin[i].seg[j].fnr + "|";
        itinseg += currentItin.itin[i].seg[j].cabin ? "f" : "c";
        url += "&F" + ++k + "=" + encodeURIComponent(itinseg);
      }
    }
    url +=
      "&DEST=" +
      currentItin.itin[0].seg[currentItin.itin[0].seg.length - 1].dest;
    url += "&FARE=" + currentItin.price + "&frm=cart&META=GOO_CS";
    return url;
  };
  var url = createUrl();
  if (!url) {
    return;
  }

  return {
    url,
    title: "Alaska"
  };
}

registerLink("airlines", printAS);
