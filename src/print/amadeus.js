import mptSettings, { getForcedCabin } from "../settings/appSettings";
import { currentItin } from "../parse/itin";

// **** START AMADEUS ****
export function getAmadeusUrl(config) {
  config = config || {
    sepcabin: 1,
    detailed: 0,
    inctimes: 1,
    enablesegskip: 1,
    allowpremium: 1
  };
  config.sepcabin = config.sepcabin === undefined ? 1 : config.sepcabin;
  config.detailed = config.detailed === undefined ? 0 : config.detailed;
  config.inctimes = config.inctimes === undefined ? 1 : config.inctimes;
  config.enablesegskip =
    config.enablesegskip === undefined ? 1 : config.enablesegskip;
  config.allowpremium =
    config.allowpremium === undefined ? 1 : config.allowpremium;
  var curleg = 0;
  var lastcabin = 0;
  var curseg = 0;
  var lastdest = "";
  var maxcabin = 0;
  var url = "";
  var lastarrtime = "";
  var cabins = ["E", "N", "B", "F"];
  cabins[1] = config.allowpremium != 1 ? cabins[0] : cabins[1];
  //Build multi-city search based on legs
  for (var i = 0; i < currentItin.itin.length; i++) {
    curseg = 3; // need to toggle segskip on first leg
    lastcabin = currentItin.itin[i].seg[0].cabin;
    // walks each leg
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      //walks each segment of leg
      var k = 0;
      // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
      while (j + k < currentItin.itin[i].seg.length - 1) {
        if (
          currentItin.itin[i].seg[j + k].fnr !=
            currentItin.itin[i].seg[j + k + 1].fnr ||
          currentItin.itin[i].seg[j + k].layoverduration >= 1440 ||
          config.enablesegskip == 0
        )
          break;
        k++;
      }
      curseg++;
      if (
        curseg > 3 ||
        (currentItin.itin[i].seg[j].cabin != lastcabin && config.sepcabin == 1)
      ) {
        if (lastdest != "") {
          //close prior flight
          url += "&E_LOCATION_" + curleg + "=" + lastdest;
          url += "&E_DATE_" + curleg + "=" + lastarrtime;
        }
        curseg = 1;
        curleg++;
        url += "&B_LOCATION_" + curleg + "=" + currentItin.itin[i].seg[j].orig;
        url += "&B_ANY_TIME_" + curleg + "=FALSE";
        url +=
          "&B_DATE_" +
          curleg +
          "=" +
          currentItin.itin[i].seg[j].dep.year +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          (config.inctimes == 1
            ? (
                "0" + currentItin.itin[i].seg[j].dep.time.replace(":", "")
              ).slice(-4)
            : "0000");
        url +=
          "&CABIN_" + curleg + "=" + cabins[currentItin.itin[i].seg[j].cabin];
        url += "&ALLOW_ALTERNATE_AVAILABILITY_" + curleg + "=FALSE";
        url += "&DATE_RANGE_VALUE_" + curleg + "=0";
      }
      lastarrtime =
        currentItin.itin[i].seg[j + k].arr.year +
        ("0" + currentItin.itin[i].seg[j + k].arr.month).slice(-2) +
        ("0" + currentItin.itin[i].seg[j + k].arr.day).slice(-2) +
        (config.inctimes == 1
          ? (
              "0" + currentItin.itin[i].seg[j + k].arr.time.replace(":", "")
            ).slice(-4)
          : "0000");
      if (config.detailed === 1) {
        url +=
          "&B_LOCATION_" +
          curleg +
          "_" +
          curseg +
          "=" +
          currentItin.itin[i].seg[j].orig;
        url +=
          "&B_LOCATION_CITY_" +
          curleg +
          "_" +
          curseg +
          "=" +
          currentItin.itin[i].seg[j].orig;
        url +=
          "&B_DATE_" +
          curleg +
          "_" +
          curseg +
          "=" +
          currentItin.itin[i].seg[j].dep.year +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          (config.inctimes == 1
            ? (
                "0" + currentItin.itin[i].seg[j].dep.time.replace(":", "")
              ).slice(-4)
            : "0000");
        url +=
          "&E_LOCATION_" +
          curleg +
          "_" +
          curseg +
          "=" +
          currentItin.itin[i].seg[j + k].dest;
        url +=
          "&E_LOCATION_CITY_" +
          curleg +
          "_" +
          curseg +
          "=" +
          currentItin.itin[i].seg[j + k].dest;
        url += "&E_DATE_" + curleg + "_" + curseg + "=" + lastarrtime;
      }
      url +=
        "&AIRLINE_" +
        curleg +
        "_" +
        curseg +
        "=" +
        currentItin.itin[i].seg[j].carrier;
      url +=
        "&FLIGHT_NUMBER_" +
        curleg +
        "_" +
        curseg +
        "=" +
        currentItin.itin[i].seg[j].fnr;
      url +=
        "&RBD_" +
        curleg +
        "_" +
        curseg +
        "=" +
        currentItin.itin[i].seg[j].bookingclass;
      url +=
        "&FARE_CLASS_" +
        curleg +
        "_" +
        curseg +
        "=" +
        currentItin.itin[i].seg[j].farebase;
      lastdest = currentItin.itin[i].seg[j + k].dest;
      lastcabin = currentItin.itin[i].seg[j].cabin;
      if (currentItin.itin[i].seg[j].cabin > maxcabin)
        maxcabin = currentItin.itin[i].seg[j].cabin;
      j += k;
    }
  }
  url += "&E_LOCATION_" + curleg + "=" + lastdest; // push final dest
  url += "&E_DATE_" + curleg + "=" + lastarrtime; // push arr time
  url +=
    "&CABIN=" +
    cabins[mptSettings.cabin === "Auto" ? maxcabin : getForcedCabin()] +
    ""; // push cabin
  return url;
}

export function getAmadeusPax(pax, config) {
  config = config || {
    allowinf: 1,
    youthage: 0
  };
  config.allowinf = config.allowinf === undefined ? 1 : config.allowinf;
  config.youthage = config.sepyouth === undefined ? 0 : config.sepyouth;
  var tmpPax = { c: 0, y: 0 };
  var curPax = 1;
  var url = "&IS_PRIMARY_TRAVELLER_1=True";
  for (let i = 0; i < pax.children.length; i++) {
    if (pax.children[i] >= config.youthage && config.youthage > 0) {
      tmpPax.y++;
    } else if (pax.children[i] >= 12) {
      pax.adults++;
    } else {
      tmpPax.c++;
    }
  }
  for (let i = 0; i < pax.adults; i++) {
    url += "&TRAVELER_TYPE_" + curPax + "=ADT";
    url +=
      "&HAS_INFANT_" +
      curPax +
      "=" +
      (i < pax.infLap && config.allowinf == 1 ? "True" : "False");
    url += "&IS_YOUTH_" + curPax + "=False";
    curPax++;
  }
  for (let i = 0; i < tmpPax.y; i++) {
    url += "&TRAVELER_TYPE_" + curPax + "=ADT";
    url += "&HAS_INFANT_" + curPax + "=False";
    url += "&IS_YOUTH_" + curPax + "=True";
    curPax++;
  }
  for (let i = 0; i < tmpPax.c; i++) {
    url += "&TRAVELER_TYPE_" + curPax + "=CHD";
    url += "&HAS_INFANT_" + curPax + "=False";
    url += "&IS_YOUTH_" + curPax + "=False";
    curPax++;
  }
  return {
    url: url,
    adults: pax.adults,
    youth: tmpPax.y,
    children: tmpPax.c,
    infants: pax.infLap
  };
}

export function getAmadeusTriptype() {
  return currentItin.itin.length > 1
    ? currentItin.itin.length == 2 &&
      currentItin.itin[0].orig == currentItin.itin[1].dest &&
      currentItin.itin[0].dest == currentItin.itin[1].orig
      ? "R"
      : "M"
    : "O";
}
// **** END AMADEUS ****
