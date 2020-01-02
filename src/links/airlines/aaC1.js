import mptUserSettings, { registerSetting } from "../../settings/userSettings";
import { printNotification } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

const aac1Editions = [
  { value: "CA", name: "Canada" },
  { value: "US", name: "United States" },
  { value: "GB", name: "United Kingdom" }
];

function printAAc1() {
  var dateToEpoch = function(y, m, d) {
    var dateStr =
      y +
      "-" +
      ("0" + m).slice(-2) +
      "-" +
      ("0" + d).slice(-2) +
      "T00:00:00-06:00";
    return Date.parse(dateStr);
  };

  // validate Passengers here: Max Paxcount = 7 (Infs not included) - >11 = Adult - InfSeat = Child
  var createUrl = function(edition) {
    var pax = validatePaxcount({
      maxPaxcount: 6,
      countInf: true,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printAAc1");
      return false;
    }
    var url = "https://www.aa.com/goto/metasearch?ITEN=GOOGLE,,";
    url += (edition || "US") + ",";
    if (currentItin.itin.length === 1) {
      url += "oneWay";
    } else {
      url += "multi";
    }
    url +=
      ",4,A" +
      pax.adults +
      "S0C" +
      pax.children.length +
      "I" +
      pax.infLap +
      "Y0L0,0,";
    url += currentItin.itin[0].orig + ",0," + currentItin.itin[0].dest;
    url += ",0";

    for (var i = 0; i < currentItin.itin.length; i++) {
      url +=
        ",false," +
        dateToEpoch(
          currentItin.itin[i].seg[0].dep.year,
          currentItin.itin[i].seg[0].dep.month,
          currentItin.itin[i].seg[0].dep.day
        );
    }

    if (currentItin.itin.length > 1) {
      url += ",0,0";
    }
    url += "," + currentItin.price + ",1,";

    if (currentItin.itin.length > 1) {
      var addon = "";
      for (var i = 0; i < currentItin.itin.length; i++) {
        addon +=
          "#" +
          currentItin.itin[i].orig +
          "|" +
          currentItin.itin[i].dest +
          "|0|0|";
        addon += dateToEpoch(
          currentItin.itin[i].seg[0].dep.year,
          currentItin.itin[i].seg[0].dep.month,
          currentItin.itin[i].seg[0].dep.day
        );
      }
      url += encodeURIComponent(addon) + ",";
    }

    var itinsegs = new Array();

    //Build multi-city search based on legs
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        //walks each segment of leg
        var k = 0;
        // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
        while (j + k < currentItin.itin[i].seg.length - 1) {
          if (
            currentItin.itin[i].seg[j + k].fnr !==
              currentItin.itin[i].seg[j + k + 1].fnr ||
            currentItin.itin[i].seg[j + k].layoverduration >= 1440
          )
            break;
          k++;
        }
        var itinseg =
          "#" +
          currentItin.itin[i].seg[j].carrier +
          "|" +
          currentItin.itin[i].seg[j].fnr +
          "|" +
          currentItin.itin[i].seg[j].bookingclass;
        itinseg += "|" + currentItin.itin[i].seg[j].orig;
        itinseg += "|" + currentItin.itin[i].seg[j + k].dest;
        itinseg +=
          "|" +
          Date.parse(
            currentItin.itin[i].seg[j].dep.year +
              "-" +
              ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
              "-" +
              ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
              "T" +
              ("0" + currentItin.itin[i].seg[j].dep.time).slice(-5) +
              ":00" +
              (typeof currentItin.itin[i].seg[j].dep.offset === "undefined"
                ? "+00:00"
                : currentItin.itin[i].seg[j].dep.offset)
          );
        itinseg += "|" + i;
        itinsegs.push(itinseg);
        j += k;
      }
    }
    url += encodeURIComponent(itinsegs.join(""));
    return url;
  };
  var url = createUrl(mptUserSettings.aac1Edition.toUpperCase());
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += aac1Editions
    .map(function(edition, i) {
      return (
        '<a href="' +
        createUrl(edition.value.toUpperCase()) +
        '" target="_blank">' +
        edition.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "American",
    desc: "America & UK",
    extra
  };
}

registerLink("airlines", printAAc1);
registerSetting("American (America & UK)", "aac1Edition", aac1Editions, "US");
