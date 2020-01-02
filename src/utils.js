export function findtarget(tclass, nth) {
  var elems = document.getElementsByTagName("*"),
    i;
  let j = 0;
  for (i in elems) {
    if ((" " + elems[i].className + " ").indexOf(" " + tclass + " ") > -1) {
      j++;
      if (j == nth) {
        return elems[i];
        break;
      }
    }
  }
}

export function findtargets(tclass) {
  var elems = document.getElementsByTagName("*"),
    i;
  var ret = new Array();
  for (i in elems) {
    if ((" " + elems[i].className + " ").indexOf(" " + tclass + " ") > -1) {
      ret.push(elems[i]);
    }
  }
  return ret;
}

export function hasClass(element, cls) {
  return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
}

export function toggleVis(target, blockType = "block") {
  if (hasClass(target, "vis")) {
    target.setAttribute("class", "invis");
    target.style.display = "none";
  } else {
    target.setAttribute("class", "vis");
    target.style.display = blockType;
  }
}

export function clearNotification() {
  var target = document.getElementById("mtpNotification");
  target.innerHTML = "";
}

export function printNotification(text) {
  // log the text to the browser's developer console:
  console.log(text);
  // display for user:
  var target = document.getElementById("mtpNotification");
  if (target === null) {
    //alert("mtp Error: Notification container not Found");
    console.log("mtp Error: Notification container not Found");
  } else {
    //possibility to print multiple notifications
    var temp = document.createElement("div");
    temp.appendChild(document.createTextNode(text));
    target.appendChild(temp);
  }
}

//Parses all of the outputs of regexp matches into an array
export function exRE(str, re) {
  var ret = new Array();
  var m;
  var i = 0;
  while ((m = re.exec(str)) != null) {
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    for (let k = 1; k < m.length; k++) {
      ret[i++] = m[k];
    }
  }
  return ret;
}

export function inArray(needle, haystack) {
  var length = haystack.length;
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true;
  }
  return false;
}

export function monthnumberToName(month) {
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
  return monthnames[month - 1];
}
