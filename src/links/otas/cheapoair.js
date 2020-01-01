import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import { validatePaxcount, registerLink } from "../../print/links";
import { printNotification } from "../../utils";
import { currentItin } from "../../parse/itin";

function printCheapOair() {
  // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
  var cabins = ["Economy", "PremiumEconomy", "Business", "First"];
  var coaUrl = "http://www.cheapoair.com/default.aspx?tabid=1832&ulang=en";
  var pax = validatePaxcount({
    maxPaxcount: 9,
    countInf: true,
    childAsAdult: 12,
    sepInfSeat: true,
    childMinAge: 2
  });
  if (!pax) {
    printNotification("Error: Failed to validate Passengers in printCheapOair");
    return;
  }
  coaUrl +=
    "&ad=" +
    pax.adults +
    "&ch=" +
    pax.children.length +
    "&il=" +
    pax.infLap +
    "&is=" +
    pax.infSeat;
  var seg = 0;
  var slices = {};
  for (var i = 0; i < currentItin.itin.length; i++) {
    slices[i] = "";
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      seg++;
      if (slices[i]) slices[i] += ",";
      slices[i] += seg;

      coaUrl +=
        "&cbn" +
        seg +
        "=" +
        cabins[
          mptSettings.cabin === "Auto"
            ? cabins[currentItin.itin[i].seg[j].cabin]
            : getForcedCabin()
        ];
      coaUrl += "&carr" + seg + "=" + currentItin.itin[i].seg[j].carrier;
      coaUrl +=
        "&dd" +
        seg +
        "=" +
        currentItin.itin[i].seg[j].dep.year +
        ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
        ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2);
      coaUrl += "&og" + seg + "=" + currentItin.itin[i].seg[j].orig;
      coaUrl += "&dt" + seg + "=" + currentItin.itin[i].seg[j].dest;
      coaUrl += "&fbc" + seg + "=" + currentItin.itin[i].seg[j].bookingclass;
      coaUrl += "&fnum" + seg + "=" + currentItin.itin[i].seg[j].fnr;
    }
    coaUrl += "&Slice" + (i + 1) + "=" + slices[i];
  }

  if (currentItin.itin.length == 1) {
    coaUrl += "&tt=OneWay";
  } else if (
    currentItin.itin.length == 2 &&
    currentItin.itin[0].orig == currentItin.itin[1].dest &&
    currentItin.itin[0].dest == currentItin.itin[1].orig
  ) {
    coaUrl += "&tt=RoundTrip";
  } else {
    coaUrl += "&tt=MultiCity";
  }

  return {
    url: coaUrl,
    title: "CheapOair"
  };
}

registerLink("otas", printCheapOair);
