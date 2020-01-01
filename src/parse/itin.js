import { printNotification, exRE, inArray } from "../utils";

// initialize local storage for current itin
/** @type {{ cur?: string; price?: number; basefares?: number; taxes?: number; surcharges?: number; dist?: number; numPax?: number; carriers?: string[]; farebases?: string[]; itin?: { orig: string; dest: string; dist?: number; dep: { day: number; month: number; year: number; time: string; offset?: string; }; arr: { day: number; month: number; year: number; time: string; offset?: string; }; seg?: { carrier: string; orig: string; dest: string; dist?: number; dep: { day: number; month: number; year: number; time: string; time24: string; timeDisplay: string; offset?: string; }; arr: { day: number; month: number; year: number; time: string; time24: string; timeDisplay: string; offset?: string; }; fnr: string; duration: number; aircraft: string; cabin: number; bookingclass: string; codeshare: number; layoverduration: number; airportchange: number; farebase: string; farecarrier: string; }[]}[]}} */
let currentItin = new Object();

const matrixCurrencies = [
  { p: /US\$/, c: "USD" },
  { p: /\€/, c: "EUR" },
  { p: /\£/, c: "GBP" },
  { p: /CA\$/, c: "CAD" },
  { p: /RS\./, c: "INR" }
];

function readItinerary() {
  // the magical part! :-)
  var itin = new Array(),
    carrieruarray = new Array(),
    farebases = new Array(),
    dirtyFare = new Array();
  var itinCur = "";
  var html = document.getElementById("contentwrapper").innerHTML;
  var re = /colspan\=\"5\"[^\(]+\(([\w]{3})[^\(]+\(([\w]{3})/g;
  var legs = exRE(html, re);
  // Got our outer legs now:
  for (i = 0; i < legs.length; i += 2) {
    var legobj = {};
    // prepare all elements but fill later
    legobj.arr = {};
    legobj.dep = {};
    legobj.orig = legs[i];
    legobj.dest = legs[i + 1];
    legobj.seg = new Array();
    itin.push(legobj);
  }
  // extract basefares
  var re = /Carrier\s([\w]{2})\s([\w]+).*?Covers\s([\w\(\)\s\-,]+)/g;
  var bfs = exRE(html, re);
  var bf = { c: "", f: "", l: new Array() };
  for (i = 0; i < bfs.length; i += 3) {
    bf.c = bfs[i];
    bf.f = bfs[i + 1];
    farebases.push(bf.f);
    bf.l = exRE(bfs[i + 2], /(\w\w\w\-\w\w\w)/g);
    for (j = 0; j < bf.l.length; j++) {
      dirtyFare.push(bf.l[j] + "-" + bf.f + "-" + bf.c);
    }
  }
  var segs = new Array();
  var re = /35px\/(\w{2}).png[^\(]+\(([A-Z]{3})[^\(]+\(([A-Z]{3})[^\,]*\,\s*([a-zA-Z]{3})\s*([0-9]{1,2}).*?gwt-Label.*?([0-9]*)\<.*?Dep:[^0-9]+(.*?)\<.*?Arr:[^0-9]+(.*?)\<.*?([0-9]{1,2})h\s([0-9]{1,2})m.*?gwt-Label.*?\>(.*?)\<.*?gwt-Label\"\>(\w).*?\((\w)\).*?\<.*?tr(.*?)(table|airline_logos)/g;
  segs = exRE(html, re);
  // used massive regex to get all our segment-info in one extraction
  var legnr = 0;
  var segnr = 0;
  for (i = 0; i < segs.length; i += 15) {
    const dep12 = return12htime(segs[i + 6]);
    const dep24 = (dep12.length == 4 ? "0" : "") + dep12;
    const arr12 = return12htime(segs[i + 7]);
    const arr24 = (arr12.length == 4 ? "0" : "") + arr12;
    const addinformations = parseAddInfo(segs[i + 13]);
    const day = parseInt(segs[i + 4]);
    const month = monthnameToNumber(segs[i + 3]);
    const year = getFlightYear(day, month);
    let seg = {
      carrier: segs[i],
      orig: segs[i + 1],
      dest: segs[i + 2],
      dep: {
        day,
        month,
        year,
        timeDisplay: segs[i + 6],
        time: dep12,
        time24: dep24
      },
      arr: {
        day: addinformations.arrDate ? addinformations.arrDate.day : day,
        month: addinformations.arrDate ? addinformations.arrDate.month : month,
        year: addinformations.arrDate ? addinformations.arrDate.year : year,
        timeDisplay: segs[i + 7],
        time: arr12,
        time24: arr24
      },
      fnr: segs[i + 5],
      duration: parseInt(segs[i + 8]) * 60 + parseInt(segs[i + 9]),
      aircraft: segs[i + 10],
      cabin: getcabincode(segs[i + 11]),
      bookingclass: segs[i + 12],
      codeshare: addinformations.codeshare,
      layoverduration: addinformations.layoverduration,
      airportchange: addinformations.airportchange,
      farebase: "",
      farecarrier: ""
    };

    // find farecode for leg
    for (var j = 0; j < dirtyFare.length; j++) {
      if (dirtyFare[j].indexOf(seg.orig + "-" + seg.dest + "-") != -1) {
        //found farebase of this segment
        var tmp = dirtyFare[j].split("-");
        seg.farebase = tmp[2];
        seg.farecarrier = tmp[3];
        dirtyFare[j] = seg.farebase; // avoid reuse
        j = dirtyFare.length;
      }
    }
    if (itin[legnr] === undefined) itin[legnr] = new Object();
    if (itin[legnr].seg === undefined) itin[legnr].seg = new Array();
    itin[legnr].seg.push(seg);
    // push carrier
    if (!inArray(seg.carrier, carrieruarray)) {
      carrieruarray.push(seg.carrier);
    }
    // push dates and times into leg-array
    if (segnr == 0) {
      if (itin[legnr].dep === undefined) itin[legnr].dep = new Object();
      itin[legnr].dep.day = seg.dep.day;
      itin[legnr].dep.month = seg.dep.month;
      itin[legnr].dep.year = seg.dep.year;
      itin[legnr].dep.time = seg.dep.time;
    }
    if (itin[legnr].arr === undefined) itin[legnr].arr = new Object();
    itin[legnr].arr.day = seg.arr.day;
    itin[legnr].arr.month = seg.arr.month;
    itin[legnr].arr.year = seg.arr.year;
    itin[legnr].arr.time = seg.arr.time;
    segnr++;
    // check for legchange
    if (segs[i + 14] == "table") {
      legnr++;
      segnr = 0;
    }
  }
  // We need to apply remaining fares (Not nonstop - but direct flights)
  for (var i = 0; i < dirtyFare.length; i++) {
    var curfare = dirtyFare[i].split("-");
    if (curfare.length > 1) {
      var l = 0;
      //currently unused so walk through itin to find flights
      for (var legnr = 0; legnr < itin.length; legnr++) {
        for (var segnr = 0; segnr < itin[legnr].seg.length; segnr++) {
          if (
            itin[legnr].seg[segnr].orig == curfare[0] &&
            itin[legnr].seg[segnr].dest == curfare[1] &&
            itin[legnr].seg[segnr].farebase == ""
          ) {
            // found seg for fare
            itin[legnr].seg[segnr].farebase = curfare[2];
            itin[legnr].seg[segnr].farecarrier = curfare[3];
            dirtyFare[i] = curfare[2];
            segnr = itin[legnr].seg.length;
            l = 1;
          } else if (
            itin[legnr].seg[segnr].orig == curfare[0] &&
            itin[legnr].seg[segnr].dest != curfare[1] &&
            itin[legnr].seg[segnr].farebase == ""
          ) {
            // found start but multiple segs -> find end
            for (var j = segnr + 1; j < itin[legnr].seg.length; j++) {
              if (
                itin[legnr].seg[j].dest == curfare[1] &&
                itin[legnr].seg[j].farebase == ""
              ) {
                //found end attach fares
                for (var k = segnr; k <= j; k++) {
                  itin[legnr].seg[k].farebase = curfare[2];
                  itin[legnr].seg[k].farecarrier = curfare[3];
                  dirtyFare[i] = curfare[2];
                }
                j = itin[legnr].seg.length;
                segnr = itin[legnr].seg.length;
                l = 1;
              } else if (itin[legnr].seg[segnr + j].farebase != "") {
                //farebase attached - skip
                j = itin[legnr].seg.length;
              }
            }
          }
        }
        if (l == 1) {
          legnr = itin.length;
        }
      }
      if (l == 0) {
        printNotification("Unused fare:" + dirtyFare[i]);
      }
    }
  }
  // extract mileage paxcount and total price
  var milepaxprice = new Array();
  var re = /Mileage.*?([0-9,]+)\stotal\smiles.*?Total\scost\sfor\s([0-9])\spassenger.*?<div.*?>(.*?([1-9][0-9,.]+)[^\<]*)/g;
  milepaxprice = exRE(html, re);
  // detect currency
  for (i = 0; i < matrixCurrencies.length; i++) {
    if (matrixCurrencies[i].p.test(milepaxprice[2]) === true) {
      itinCur = matrixCurrencies[i].c;
      i = matrixCurrencies.length;
    }
  }
  currentItin = {
    itin: itin,
    price: Number(milepaxprice[3].replace(/\,/, "")),
    numPax: Number(milepaxprice[1]),
    carriers: carrieruarray,
    cur: itinCur,
    farebases: farebases,
    dist: Number(milepaxprice[0].replace(/\,/, ""))
  };
  console.log("parsed itinerary: ", currentItin);
}

function parseAddInfo(info) {
  var ret = {
    codeshare: 0,
    layoverduration: 0,
    airportchange: 0,
    arrDate: null
  };
  var re = /contains\s*airport\s*changes/g;
  if (re.test(info) === true) {
    ret.airportchange = 1;
  }
  var re = /OPERATED\s*BY/g;
  if (re.test(info) === true) {
    ret.codeshare = 1;
  }
  var temp = new Array();
  var re = /\,\s*([a-zA-Z]{3})\s*([0-9]{1,2})/g;
  temp = exRE(info, re);
  if (temp.length == 2) {
    // Got datechange
    const month = monthnameToNumber(temp[0]);
    const day = parseInt(temp[1]);
    ret.arrDate = {
      month,
      day,
      year: getFlightYear(day, month)
    };
  }
  var temp = new Array();
  var re = /([0-9]{1,2})h\s([0-9]{1,2})m/g;
  temp = exRE(info, re);
  if (temp.length == 2) {
    // Got layover
    ret.layoverduration = parseInt(temp[0]) * 60 + parseInt(temp[1]);
  }
  return ret;
}

/**************************************** General Functions *****************************************/
function getcabincode(cabin) {
  switch (cabin) {
    case "E":
      cabin = 0;
      break;
    case "P":
      cabin = 1;
      break;
    case "B":
      cabin = 2;
      break;
    case "F":
      cabin = 3;
      break;
    default:
      cabin = 0;
  }
  return cabin;
}

function monthnameToNumber(month) {
  var monthnames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];
  return monthnames.indexOf(month.toUpperCase()) + 1;
}

function getFlightYear(day, month) {
  //Do date magic
  var d = new Date();
  var cmonth = d.getMonth();
  var cday = d.getDate();
  var cyear = d.getFullYear();
  // make sure to handle the 0-11 issue of getMonth()
  if (cmonth > month - 1 || (cmonth == month - 1 && day < cday)) {
    cyear += 1; // The flight is next year
  }
  return cyear;
}

function return12htime(match) {
  var regex = /([01]?\d)(:\d{2})(AM|PM|am|pm| AM| PM| am| pm)/g;
  match = regex.exec(match);
  var offset = 0;
  match[3] = trimStr(match[3]);
  if ((match[3] == "AM" || match[3] == "am") && match[1] == "12") {
    offset = -12;
  } else if ((match[3] == "PM" || match[3] == "pm") && match[1] != "12") {
    offset = 12;
  }
  return +match[1] + offset + match[2];
}

function trimStr(x) {
  return x.replace(/^\s+|\s+$/gm, "");
}

export { currentItin, readItinerary };
