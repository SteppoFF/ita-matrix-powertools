import mptUserSettings from "../settings/userSettings";
import classSettings from "../settings/itaSettings";
import translations from "../settings/translations";
import { currentItin, readItinerary } from "../parse/itin";
import {
  printNotification,
  findtarget,
  hasClass,
  findtargets,
  toggleVis
} from "../utils";
import { printLinksContainer, printItemInline } from "./links";

export function render() {
  // Editor mode?
  if (
    mptUserSettings.enableEditormode == 1 &&
    findtargets("editoritem").length === 0
  ) {
    toggleVis(document.getElementById("mptStartparse"), "inline-block");
    addEditor();
    return;
  } else if (findtargets("editoritem").length > 0) {
    toggleVis(document.getElementById("mptStartparse"));
    removeEditor();
    readItinerary();
  }

  bindPageLayout();

  if (mptUserSettings.enableFarerules == 1) bindRulelinks();

  if (mptUserSettings.timeformat == "24h") bind24HourTime();

  if (
    mptUserSettings.language !== "en" &&
    translations[mptUserSettings.language].resultpage !== undefined
  )
    bindTranslations(
      "resultpage",
      mptUserSettings.language,
      findtarget(classSettings.resultpage.itin, 1).nextElementSibling
    );

  if (mptUserSettings.enablePricebreakdown == 1) bindPriceBreakdown();

  if (mptUserSettings.enableInlineMode == 1) printCPM();

  printLinksContainer();

  if (mptUserSettings.enableSeatguru == 1) bindSeatguru();
  if (mptUserSettings.enablePlanefinder == 1) bindPlanefinder();
  if (mptUserSettings.enableWheretocredit == 1) bindWheretocredit();
}

export function cleanUp() {
  // empty outputcontainer
  if (document.getElementById("powertoolslinkcontainer") != undefined) {
    var div = document.getElementById("powertoolslinkcontainer");
    div.innerHTML = "";
  }
  //  S&D powertool items
  var elems = findtargets("powertoolsitem");
  for (var i = elems.length - 1; i >= 0; i--) {
    elems[i].parentElement.removeChild(elems[i]);
  }
  // S&D price breakdown
  var pbd = findtarget("pricebreakdown", 1);
  if (pbd != undefined) pbd.parentElement.removeChild(pbd);
}

function addEditor() {
  for (var i = 0; i < currentItin.itin.length; i++) {
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      var target = findItinTarget(i + 1, j + 1, "cabin").firstElementChild;
      var tmp = target.innerHTML;
      var bc = tmp.substr(tmp.length - 2, 1);
      var cabin = tmp.substr(0, tmp.length - 4);
      var cabins = [
        ["Economy", "Y"],
        ["Premium Economy", "Y+"],
        ["Business", "C"],
        ["First", "F"]
      ];
      var str = '<select style="width:40px" class="editoritem">';
      for (var k = 0; k < cabins.length; k++) {
        str +=
          '<option value="' +
          cabins[k][0] +
          '"' +
          (cabins[k][0] === cabin ? ' selected="selected"' : "") +
          ">" +
          cabins[k][1] +
          "</option>";
      }
      str += "</select>";
      str +=
        ' (<input type="text" class="editoritem" value="' +
        bc +
        '" style="width:20px;text-align:center">)';
      target.innerHTML = str;
    }
  }
}

function removeEditor() {
  for (var i = 0; i < currentItin.itin.length; i++) {
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      var target = findItinTarget(i + 1, j + 1, "cabin").firstElementChild;
      var cabin =
        target.firstElementChild.options[target.firstElementChild.selectedIndex]
          .value;
      var bc = target.firstElementChild.nextElementSibling.value;
      var str = cabin + " (" + bc + ")";
      target.innerHTML = str;
    }
  }
}

function bindPageLayout() {
  if (mptUserSettings.enableInlineMode == 1) {
    findtarget(classSettings.resultpage.milagecontainer, 1).setAttribute(
      "rowspan",
      "10"
    );
  } else if (
    mptUserSettings.enableInlineMode == 0 &&
    mptUserSettings.enablePricebreakdown == 1
  ) {
    findtarget(classSettings.resultpage.milagecontainer, 1).setAttribute(
      "rowspan",
      "3"
    );
  } else {
    findtarget(classSettings.resultpage.milagecontainer, 1).setAttribute(
      "rowspan",
      "2"
    );
  }
}

function bind24HourTime() {
  // lets do the time-replacement
  const segs = currentItin.itin
    .map(function(p) {
      return p.seg;
    })
    .reduce(function(a, b) {
      return a.concat(b);
    }, []);
  if (segs.length > 0) {
    const target = findtarget(classSettings.resultpage.itin, 1)
      .nextElementSibling;
    for (let i = 0; i < segs.length; i++) {
      target.innerHTML = target.innerHTML.replace(
        new RegExp(segs[i].dep.timeDisplay, "g"),
        segs[i].dep.time24
      );
      target.innerHTML = target.innerHTML.replace(
        new RegExp(segs[i].arr.timeDisplay, "g"),
        segs[i].arr.time24
      );
    }
  }
}

function bindRulelinks() {
  var i = 0;
  var j = 0;
  var t = 1;
  let target = findtarget(classSettings.resultpage.rulescontainer, t);
  if (target != undefined) {
    do {
      var current = Number(
        target.firstElementChild.innerHTML.replace(/[^\d]/gi, "")
      );
      if (i > current) {
        j++;
        i = 0;
      }
      target = target.nextElementSibling.nextElementSibling.nextElementSibling;
      var targeturl =
        window.location.href.replace(/view-details/, "view-rules") +
        ";fare-key=" +
        j +
        "/" +
        i;
      var newlink = document.createElement("a");
      newlink.setAttribute("class", "gwt-Anchor");
      newlink.setAttribute("href", targeturl);
      newlink.setAttribute("target", "_blank");
      var linkText = document.createTextNode("rules");
      newlink.appendChild(linkText);
      target.parentElement.replaceChild(newlink, target);
      i++;
      t++;
      target = findtarget(classSettings.resultpage.rulescontainer, t);
    } while (target != undefined);
  }
}

function bindPriceBreakdown() {
  var basefares = 0;
  var taxes = 0;
  var surcharges = 0;
  var basefound = 0;
  var cur = "";
  // define searchpattern to detect carrier imposed surcharges
  var searchpatt = new RegExp("((YQ|YR))");
  var t = 1;
  var target = findtarget(classSettings.resultpage.htbLeft, t);
  if (mptUserSettings.enableInlineMode == 0) {
    var output = "";
    var count = 0;
  }
  if (target != undefined) {
    do {
      var type = target.firstChild.firstChild.nodeType;
      if (type == 1) {
        basefound = 1;
        //it's a basefare
        var price = Number(
          target.nextElementSibling.firstElementChild.innerHTML.replace(
            /[^\d]/gi,
            ""
          )
        );
        if (cur == "")
          cur = target.nextElementSibling.firstElementChild.innerHTML.replace(
            /[\d,.]/g,
            ""
          );
        basefares += price;
      } else if (basefound == 1 && type == 3) {
        //its a pricenode
        var name = target.firstElementChild.innerHTML;
        var price = Number(
          target.nextElementSibling.firstElementChild.innerHTML.replace(
            /[^\d]/gi,
            ""
          )
        );
        if (
          hasClass(
            target.nextElementSibling,
            classSettings.resultpage.htbGreyBorder
          )
        ) {
          //we are done for this container
          var sum = basefares + taxes + surcharges;
          if (mptUserSettings.enableInlineMode == 1) {
            var newtr = document.createElement("tr");
            newtr.innerHTML =
              '<td class="' +
              classSettings.resultpage.htbLeft +
              '"><div class="gwt-Label">Basefare per passenger (' +
              ((basefares / sum) * 100).toFixed(2).toString() +
              '%)</div></td><td class="' +
              classSettings.resultpage.htbGreyBorder +
              '"><div class="gwt-Label">' +
              cur +
              (basefares / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</div></td>";
            target.parentElement.parentElement.insertBefore(
              newtr,
              target.parentElement
            );
            var newtr = document.createElement("tr");
            newtr.innerHTML =
              '<td class="' +
              classSettings.resultpage.htbLeft +
              '"><div class="gwt-Label">Taxes per passenger (' +
              ((taxes / sum) * 100).toFixed(2).toString() +
              '%)</div></td><td class="' +
              classSettings.resultpage.htbRight +
              '"><div class="gwt-Label">' +
              cur +
              (taxes / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</div></td>";
            target.parentElement.parentElement.insertBefore(
              newtr,
              target.parentElement
            );
            var newtr = document.createElement("tr");
            newtr.innerHTML =
              '<td class="' +
              classSettings.resultpage.htbLeft +
              '"><div class="gwt-Label">Surcharges per passenger (' +
              ((surcharges / sum) * 100).toFixed(2).toString() +
              '%)</div></td><td class="' +
              classSettings.resultpage.htbRight +
              '"><div class="gwt-Label">' +
              cur +
              (surcharges / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</div></td>";
            target.parentElement.parentElement.insertBefore(
              newtr,
              target.parentElement
            );
            var newtr = document.createElement("tr");
            newtr.innerHTML =
              '<td class="' +
              classSettings.resultpage.htbLeft +
              '"><div class="gwt-Label">Basefare + Taxes per passenger (' +
              (((basefares + taxes) / sum) * 100).toFixed(2).toString() +
              '%)</div></td><td class="' +
              classSettings.resultpage.htbGreyBorder +
              '"><div class="gwt-Label">' +
              cur +
              ((basefares + taxes) / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</div></td>";
            target.parentElement.parentElement.insertBefore(
              newtr,
              target.parentElement
            );
          } else {
            count++;
            output += '<table style="float:left; margin-right:15px;"><tbody>';
            output +=
              '<tr><td colspan=3 style="text-align:center;">Price breakdown ' +
              count +
              ": </td></tr>";
            output +=
              "<tr><td>" +
              cur +
              ' per mile</td><td colspan=2 style="text-align:center;">' +
              (sum / currentItin.dist / 100).toFixed(4).toString() +
              "</td></tr>";
            output +=
              '<tr><td>Basefare</td><td style="padding:0px 3px;text-align:right;">' +
              ((basefares / sum) * 100).toFixed(1).toString() +
              '%</td><td style="text-align:right;">' +
              cur +
              (basefares / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</td></tr>";
            output +=
              '<tr><td>Tax</td><td style="padding:0px 3px;text-align:right;">' +
              ((taxes / sum) * 100).toFixed(1).toString() +
              '%</td><td style="text-align:right;">' +
              cur +
              (taxes / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</td></tr>";
            output +=
              '<tr><td>Surcharges</td><td style="padding:0px 3px;text-align:right;">' +
              ((surcharges / sum) * 100).toFixed(1).toString() +
              '%</td><td style="text-align:right;">' +
              cur +
              (surcharges / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</td></tr>";
            output +=
              '<tr><td style="border-top: 1px solid #878787;padding:2px 0">Bf+Tax</td><td style="border-top: 1px solid #878787;padding:2px 3px;text-align:right;">' +
              (((basefares + taxes) / sum) * 100).toFixed(1).toString() +
              '%</td><td style="border-top: 1px solid #878787;padding:2px 0; text-align:right;">' +
              cur +
              ((basefares + taxes) / 100)
                .toFixed(2)
                .toString()
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") +
              "</td></tr>";
            output += "</tbody></table>";
          }
          currentItin.basefares = +(basefares / 100).toFixed(2);
          currentItin.taxes = +(taxes / 100).toFixed(2);
          currentItin.surcharges = +(surcharges / 100).toFixed(2);

          // reset var
          basefound = 0;
          basefares = 0;
          taxes = 0;
          surcharges = 0;
        } else {
          //Carrier surcharge?
          if (searchpatt.test(name) === true) {
            surcharges += price;
          } else {
            taxes += price;
          }
        }
      }
      t++;
      target = findtarget(classSettings.resultpage.htbLeft, t);
    } while (target != undefined);
  }
  if (mptUserSettings.enableInlineMode == 0) {
    var printtarget = findtarget(classSettings.resultpage.htbContainer, 1)
      .parentElement.parentElement.parentElement;
    var newtr = document.createElement("tr");
    newtr.setAttribute("class", "pricebreakdown");
    newtr.innerHTML = "<td><div>" + output + "</div></td>";
    printtarget.parentElement.insertBefore(newtr, printtarget);
  }
}

function bindTranslations(page, lang, target) {
  if (translations[lang] === undefined) {
    printNotification("Error: Translation " + lang + " not found");
    return false;
  }
  if (translations[lang][page] === undefined) {
    printNotification(
      "Error: Translation " + lang + " not found for page " + page
    );
    return false;
  }
  for (let i in translations[lang][page]) {
    const re = new RegExp(i, "g");
    target.innerHTML = target.innerHTML.replace(
      re,
      translations[lang][page][i]
    );
  }
}

function printCPM() {
  printItemInline(
    (Number(currentItin.price) / Number(currentItin.dist)).toFixed(4) + " cpm",
    "",
    1
  );
}

function bindSeatguru() {
  for (var i = 0; i < currentItin.itin.length; i++) {
    // walks each leg
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
      // build the search to identify flight:
      var target = findItinTarget(i + 1, j + 1, "plane");
      if (!target) {
        printNotification("Error: Could not find target in bindSeatguru");
        return false;
      } else {
        var url =
          "http://www.seatguru.com/findseatmap/findseatmap.php?carrier=" +
          currentItin.itin[i].seg[j].carrier +
          "&flightno=" +
          currentItin.itin[i].seg[j].fnr +
          "&date=" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "%2F" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          "%2F" +
          currentItin.itin[i].seg[j].dep.year +
          "&to=&from=" +
          currentItin.itin[i].seg[j].orig;
        target.children[0].innerHTML =
          '<a href="' +
          url +
          '" target="_blank" style="text-decoration:none;color:black">' +
          target.children[0].innerHTML +
          "</a>";
      }
      j += k;
    }
  }
}

function bindPlanefinder() {
  for (var i = 0; i < currentItin.itin.length; i++) {
    // walks each leg
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
      // build the search to identify flight:
      var target = findItinTarget(i + 1, j + 1, "flight");
      if (!target) {
        printNotification("Error: Could not find target in bindPlanefinder");
        return false;
      } else {
        var url =
          "http://www.planefinder.net/data/flight/" +
          currentItin.itin[i].seg[j].carrier +
          currentItin.itin[i].seg[j].fnr;
        target.children[0].innerHTML =
          '<a href="' +
          url +
          '" target="_blank" style="text-decoration:none;color:black">' +
          target.children[0].innerHTML +
          "</a>";
      }
      j += k;
    }
  }
}

function bindWheretocredit() {
  for (var i = 0; i < currentItin.itin.length; i++) {
    // walks each leg
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      //walks each segment of leg
      var target = findItinTarget(i + 1, j + 1, "cabin");
      if (!target) {
        printNotification("Error: Could not find target in bindWheretocredit");
        return false;
      } else {
        var url =
          "http://www.wheretocredit.com/" +
          currentItin.itin[i].seg[j].carrier.toLowerCase() +
          "/" +
          currentItin.itin[i].seg[j].bookingclass.toLowerCase();
        target.children[0].innerHTML = target.children[0].innerHTML
          .replace(
            /<a.*?\/a>/,
            "(" + currentItin.itin[i].seg[j].bookingclass + ")"
          )
          .replace(
            "(" + currentItin.itin[i].seg[j].bookingclass + ")",
            '<a href="' +
              url +
              '" target="_blank" style="text-decoration:none;color:black">(' +
              currentItin.itin[i].seg[j].bookingclass +
              ")</a>"
          );
      }
    }
  }
}

function findItinTarget(leg, seg, tcell) {
  var target = findtarget(classSettings.resultpage.itin, 1);
  if (!target) {
    printNotification("Error: Itin not found in findItinTarget-function");
    return;
  }

  // go to leg
  var targetLeg = target.nextElementSibling.children[leg - 1];
  if (targetLeg === undefined) {
    printNotification("Error: Leg not found in findItinTarget-function");
    return;
  }
  // go to segments of leg
  var targetSeg = targetLeg.children[1].children;
  if (targetSeg.length >= 2) {
    // go to desired segment
    var index = 0;
    var j = 0;
    let i = 0;
    for (i = 0; i < targetSeg.length; i++) {
      if (hasClass(targetSeg[i], classSettings.resultpage.itinRow)) {
        j++;
        if (j >= seg) {
          index = i;
          //special handling for one-seg-legs here
          if (targetSeg.length === 2 || targetSeg.length === 3) {
            // 1. Headline 2. Flight-details 3. arrival next day..
            index--;
          }
          break;
        }
      }
    } // end-for
    if (i == targetSeg.length) {
      //target not found
      printNotification(
        "Error: Call to unreachable Segment in Leg " +
          leg +
          " in findItinTarget-function"
      );
      return;
    }
    var rowoffset = 0;
    var columnoffset = 0;

    switch (tcell) {
      case "headline":
        // special case here allways first row... even in one-seg-legs
        rowoffset = index * -1;
        columnoffset = 1;
        break;
      case "logo":
        rowoffset = 0;
        columnoffset = 0;
        break;
      case "airportsdate":
        rowoffset = 0;
        columnoffset = 1;
        break;
      case "flight":
        rowoffset = 1;
        columnoffset = 0;
        break;
      case "deptime":
        rowoffset = 1;
        columnoffset = 1;
        break;
      case "arrtime":
        rowoffset = 1;
        columnoffset = 2;
        break;
      case "duration":
        rowoffset = 1;
        columnoffset = 2;
        break;
      case "plane":
        rowoffset = 1;
        columnoffset = 4;
        break;
      case "cabin":
        rowoffset = 1;
        columnoffset = 5;
        break;
      default:
        printNotification("Error: Unknown Target in findItinTarget-function");
        return;
    }
    return targetSeg[index + rowoffset].children[columnoffset];
  } else {
    printNotification("Error: Unknown error in findItinTarget-function");
    return;
  }
}
