export function printNotification(text) {
  // log the text to the browser's developer console:
  text !== "empty" && console.log(text);
  // display for user:
  var target = document.getElementById("mtpNotification");
  if (target === null) {
    //alert("mtp Error: Notification container not Found");
    console.log("mtp Error: Notification container not Found");
  } else {
    if (text == "empty") {
      target.innerHTML = "";
    } else {
      //possibility to print multiple notifications
      var temp = document.createElement("div");
      temp.appendChild(document.createTextNode(text));
      target.appendChild(temp);
    }
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
