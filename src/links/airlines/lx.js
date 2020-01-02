import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import mptUserSettings, { registerSetting } from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

const lxEditions = [
  { value: "de_de", name: "Germany" },
  { value: "us_en", name: "US" }
];

function printLX() {
  if (
    !mptUserSettings.showAllAirlines &&
    !(currentItin.itin.length <= 2 && inArray("LX", currentItin.carriers))
  ) {
    return;
  }

  // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
  var cabins = ["", "", "/class-business", "/class-first"];
  var mincabin = 3;
  var createUrl = function(edition) {
    var url =
      "https://www.swiss.com/" +
      edition[0] +
      "/" +
      edition[1] +
      "/Book/Combined";
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printLX");
      return;
    }
    //Build multi-city search based on legs
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      url +=
        "/" + currentItin.itin[i].orig + "-" + currentItin.itin[i].dest + "/";
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
        url +=
          currentItin.itin[i].seg[j].carrier +
          currentItin.itin[i].seg[j].fnr +
          "-";
        if (currentItin.itin[i].seg[j].cabin < mincabin) {
          mincabin = currentItin.itin[i].seg[j].cabin;
        }
        j += k;
      }
      url = url.substring(0, url.length - 1);
      url +=
        "/" +
        (i > 0 ? "to" : "from") +
        "-" +
        currentItin.itin[i].dep.year +
        "-" +
        ("0" + currentItin.itin[i].dep.month).slice(-2) +
        "-" +
        ("0" + currentItin.itin[i].dep.day).slice(-2);
    }
    url +=
      "/adults-" +
      pax.adults +
      "/children-" +
      pax.children.length +
      "/infants-" +
      pax.infLap;
    url += cabins[mptSettings.cabin === "Auto" ? mincabin : getForcedCabin()];
    return url;
  };
  // get edition
  var edition = mptUserSettings.lxEdition.split("_");
  if (edition.length != 2) {
    printNotification("Error:Invalid Swiss-Edition");
    return;
  }
  var url = createUrl(edition);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += lxEditions
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
    title: "Swiss",
    extra
  };
}

registerLink("airlines", printLX);
registerSetting("Swiss", "lxEdition", lxEditions, "us_en");
