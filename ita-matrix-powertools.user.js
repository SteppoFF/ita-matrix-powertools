// ==UserScript==
// @name DL/ORB Itinary Builder
// @namespace https://github.com/SteppoFF/ita-matrix-powertools
// @description Builds fare purchase links
// @version 0.16
// @grant GM_getValue
// @grant GM_setValue
// @include http*://matrix.itasoftware.com/*
// ==/UserScript==
/*
 Written by paul21, Steppo & IAkH of FlyerTalk.com
 http://www.flyertalk.com/forum/members/paul21.html
 Includes contriutions by 18sas
 Copyright Reserved -- At least share with credit if you do
*********** Latest Changes **************
**** Version 0.16 ****
# 2015-10-12 Edited by IAkH ( added wheretocredit.com calculator )
**** Version 0.15 ****
# 2015-09-30 Edited by IAkH ( added additional edition flyout menu,
                                added Ebookers, 
                                added Etraveli )
**** Version 0.14a ****
# 2015-09-26 Edited by Steppo ( fixed AA-POS )
**** Version 0.14 ****
# 2015-09-25 Edited by Steppo ( added American Airlines )
**** Version 0.13 ****
# 2015-06-15 Edited by Steppo ( fixed miles/passenger/price extraction,
                                 moved itin-data to global var "currentItin" -> capability to modify/reuse itin,
                                 rearranged config section,
                                 introduced wheretocredit.com,
                                 introduced background resolving of detailed distances using farefreaks.com based on data of OurAirports.com,
                                 tested on FF38, IE11, IE10 (emulated)
                                 )
**** Version 0.12 ****
# 2015-06-13 Edited by IAkH ( added CheapOair )
**** Version 0.11 ****
# 2015-04-19 Edited by Steppo (added SeatGuru,
                                added Planefinder,
                                moved translation to external var/function adding capability to add translations,
                                added possibility to print notifications,
                                added self-test to prevent crashing on class-changes,
                                set timeout of resultpage to 10s,
                                added powerfull selector-function to get desired td in itin => see findItinTarget,
                                moved exit in frames to top,
                                some cleanups,
                                moved older changelogitems to seperate file on GitHub - no one wants to read such lame stuff :-) )
*********** About **************
 --- Resultpage ---
  # collecting a lot of information in data-var
  # based on gathered data-var: creating links to different OTAs and other pages
  # able to transform timeformat into 24h format
  # able to translate some things
 *********** Hints ***********
  Unsure about handling of different fares/pax. 
  Unsure about correct usage of cabins while creating links.
  Unsure about correct usage of farebase-per-leg - usage in order of appearance.
  Unsere about segment-skipping - should be fine but needs heavy testing.
*/
/**************************************** Start Script *****************************************/
// User settings
var mptUsersettings = new Object();
mptUsersettings["timeformat"] = "12h"; // replaces times on resultpage - valid: 12h / 24h
mptUsersettings["language"] = "en"; // replaces several items on resultpage - valid: en / de
mptUsersettings["enableDeviders"] = 1; // Print deviders in links after group (airlines/otas/other stuff) - valid: 0 / 1
mptUsersettings["enableInlinemode"] =  0; // enables inline mode - valid: 0 / 1
mptUsersettings["enableIMGautoload"] = 0; // enables images to auto load - valid: 0 / 1
mptUsersettings["enableFarerules"] = 1; // enables fare rule opening in new window - valid: 0 / 1
mptUsersettings["enablePricebreakdown"] =  1; // enables price breakdown - valid: 0 / 1
mptUsersettings["enableMilesbreakdown"] =  1; // enables miles breakdown - valid: 0 / 1
mptUsersettings["enableMilesbreakdownautoload"] =  0; // enables autoload of miles breakdown - valid: 0 / 1
mptUsersettings["enableMilesInlinemode"] =  0; // always print miles breakdown inline - valid: 0 / 1


mptUsersettings["enablePlanefinder"] =  1; // enables Planefinder - click on flight numbers to open Planefinder for this flight - valid: 0 / 1
mptUsersettings["enableSeatguru"] =  1; // enables Seatguru - click on plane type to open Seatguru for this flight - valid: 0 / 1
mptUsersettings["enableWheretocredit"] =  1; // enables Wheretocredit - click on booking class to open wheretocredit for this flight - valid: 0 / 1
mptUsersettings["acEdition"] = "us"; // sets the local edition of AirCanada.com for itinerary pricing - valid: "us", "ca", "ar", "au", "ch", "cl", "cn", "co", "de", "dk", "es", "fr", "gb", "hk", "ie", "il", "it", "jp", "mx", "nl", "no", "pa", "pe", "se"
mptUsersettings["aaEdition"] = "en_DE"; // sets the local edition of AA-Europe/Asia for itinerary pricing - NO US available

// *** DO NOT CHANGE BELOW THIS LINE***/
// General settings
var mptSettings = new Object();
mptSettings["itaLanguage"]="en";
mptSettings["retrycount"]=1;
mptSettings["laststatus"]="";
mptSettings["scriptrunning"]=1;

if (typeof GM_info === "undefined") {
   mptSettings["scriptEngine"]=0; // console mode
  }
else {
  mptSettings["scriptEngine"]=1; // tamper or grease mode
  var mptSavedUsersettings = GM_getValue("mptUsersettings", "");
  if (mptSavedUsersettings) {
    mptSavedUsersettings = JSON.parse(mptSavedUsersettings);
    mptUsersettings["timeformat"] = (mptSavedUsersettings["timeformat"] === undefined ? mptUsersettings["timeformat"] : mptSavedUsersettings["timeformat"]);
    mptUsersettings["language"] = (mptSavedUsersettings["language"] === undefined ? mptUsersettings["language"] : mptSavedUsersettings["language"]);
    mptUsersettings["enableDeviders"]=(mptSavedUsersettings["enableDeviders"] === undefined ? mptUsersettings["enableDeviders"] : mptSavedUsersettings["enableDeviders"]);
    mptUsersettings["enableInlinemode"] = (mptSavedUsersettings["enableInlinemode"] === undefined ? mptUsersettings["enableInlinemode"] : mptSavedUsersettings["enableInlinemode"]);
    mptUsersettings["enableIMGautoload"] = (mptSavedUsersettings["enableIMGautoload"] === undefined ? mptUsersettings["enableIMGautoload"] : mptSavedUsersettings["enableIMGautoload"]);
    mptUsersettings["enableFarerules"] = (mptSavedUsersettings["enableFarerules"] === undefined ? mptUsersettings["enableFarerules"] : mptSavedUsersettings["enableFarerules"]);
    mptUsersettings["enablePricebreakdown"] = (mptSavedUsersettings["enablePricebreakdown"] === undefined ? mptUsersettings["enablePricebreakdown"] : mptSavedUsersettings["enablePricebreakdown"]);
    mptUsersettings["enableMilesbreakdown"] = (mptSavedUsersettings["enableMilesbreakdown"] === undefined ? mptUsersettings["enableMilesbreakdown"] : mptSavedUsersettings["enableMilesbreakdown"]);
    mptUsersettings["enableMilesbreakdownautoload"] = (mptSavedUsersettings["enableMilesbreakdownautoload"] === undefined ? mptUsersettings["enableMilesbreakdownautoload"] : mptSavedUsersettings["enableMilesbreakdownautoload"]);
    mptUsersettings["enableMilesInlinemode"] = (mptSavedUsersettings["enableMilesInlinemode"] === undefined ? mptUsersettings["enableMilesInlinemode"] : mptSavedUsersettings["enableMilesInlinemode"]);
    mptUsersettings["enablePlanefinder"] = (mptSavedUsersettings["enablePlanefinder"] === undefined ? mptUsersettings["enablePlanefinder"] : mptSavedUsersettings["enablePlanefinder"]);
    mptUsersettings["enableSeatguru"] = (mptSavedUsersettings["enableSeatguru"] === undefined ? mptUsersettings["enableSeatguru"] : mptSavedUsersettings["enableSeatguru"]);
    mptUsersettings["enableWheretocredit"] = (mptSavedUsersettings["enableWheretocredit"] === undefined ? mptUsersettings["enableWheretocredit"] : mptSavedUsersettings["enableWheretocredit"]);
    mptUsersettings["acEdition"] = (mptSavedUsersettings["acEdition"] === undefined ? mptUsersettings["acEdition"] : mptSavedUsersettings["acEdition"]);
    mptUsersettings["aaEdition"] = (mptSavedUsersettings["aaEdition"] === undefined ? mptUsersettings["aaEdition"] : mptSavedUsersettings["aaEdition"]);    
  }
}

var acEditions = ["us", "ca", "ar", "au", "ch", "cl", "cn", "co", "de", "dk", "es", "fr", "gb", "hk", "ie", "il", "it", "jp", "mx", "nl", "no", "pa", "pe", "se"];
var aaEditions = [{value:"en_AU", name:"Australia"},{value:"en_BE", name:"Belgium"},{value:"en_CN", name:"China"},{value:"en_DK", name:"Denmark"},{value:"en_FI", name:"Finland"},{value:"en_FR", name:"France / English"},{value:"fr_FR", name:"France / French"},{value:"en_DE", name:"Germany / English"},{value:"de_DE", name:"Germany / Deutsch"},{value:"en_GR", name:"Greece"},{value:"en_HK", name:"Hong Kong"},{value:"en_IN", name:"India"},{value:"en_IE", name:"Ireland"},{value:"en_IL", name:"Israel"},{value:"en_IT", name:"Italy"},{value:"en_JP", name:"Japan"},{value:"en_KR", name:"Korea"},{value:"en_NL", name:"Netherlands"},{value:"en_NZ", name:"New Zealand"},{value:"en_NO", name:"Norway"},{value:"en_PT", name:"Portugal"},{value:"en_RU", name:"Russia"},{value:"en_ES", name:"Spain"},{value:"en_SE", name:"Sweden"},{value:"en_CH", name:"Switzerland"}];

var classSettings = new Object();
classSettings["startpage"] = new Object();
classSettings["startpage"]["maindiv"]="IR6M2QD-w-d"; //Container of main content. Unfortunately id "contentwrapper" is used twice
classSettings["resultpage"] = new Object();
classSettings["resultpage"]["itin"]="IR6M2QD-A-d"; //Container with headline: "Intinerary"
classSettings["resultpage"]["itinRow"]="IR6M2QD-k-i"; // TR in itin with Orig, Dest and date
classSettings["resultpage"]["milagecontainer"]="IR6M2QD-A-e"; // TD-Container on the right
classSettings["resultpage"]["rulescontainer"]="IR6M2QD-l-d"; // First container before rulelinks (the one with Fare X:)
classSettings["resultpage"]["htbContainer"]="IR6M2QD-F-k"; // full "how to buy"-container inner div (td=>div=>div) 
classSettings["resultpage"]["htbLeft"]="IR6M2QD-l-g"; // Left column in the "how to buy"-container
classSettings["resultpage"]["htbRight"]="IR6M2QD-l-f"; // Class for normal right column
classSettings["resultpage"]["htbGreyBorder"]="IR6M2QD-l-l"; // Class for right cell with light grey border (used for subtotal of passenger)
//inline
classSettings["resultpage"]["mcDiv"]="IR6M2QD-U-e";  // Right menu sections class (3 divs surrounding entire Mileage, Emissions, and Airport Info)
classSettings["resultpage"]["mcHeader"]="IR6M2QD-U-b"; // Right menu header class ("Mileage", etc.)
classSettings["resultpage"]["mcLinkList"]="IR6M2QD-U-c"; // Right menu ul list class (immediately following header)

var translations = new Object();
translations["de"] = new Object();
translations["de"]["openwith"]="&Ouml;ffne mit";
translations["de"]["resultpage"] = new Object();
translations["de"]["resultpage"]["Dep:"]="Abflug:";
translations["de"]["resultpage"]["Arr:"]="Ankunft:";
translations["de"]["resultpage"]["Layover in"]="Umst. in";
translations["de"]["resultpage"][" to "]=" nach ";
translations["de"]["resultpage"]["Mon,"]="Mo.,";
translations["de"]["resultpage"]["Tue,"]="Di.,";
translations["de"]["resultpage"]["Wed,"]="Mi.,";
translations["de"]["resultpage"]["Thu,"]="Do.,";
translations["de"]["resultpage"]["Fri,"]="Fr.,";
translations["de"]["resultpage"]["Sat,"]="Sa.,";
translations["de"]["resultpage"]["Sun,"]="So.,";
translations["de"]["resultpage"][" Jan "]=" Januar ";
translations["de"]["resultpage"][" Feb "]=" Februar ";
translations["de"]["resultpage"][" Mar "]=" M&auml;rz ";
translations["de"]["resultpage"][" Apr "]=" April ";
translations["de"]["resultpage"][" May "]=" Mai ";
translations["de"]["resultpage"][" Jun "]=" Juni ";
translations["de"]["resultpage"][" Jul "]=" Juli ";
translations["de"]["resultpage"][" Aug "]=" August ";
translations["de"]["resultpage"][" Sep "]=" September ";
translations["de"]["resultpage"][" Oct "]=" Oktober ";
translations["de"]["resultpage"][" Nov "]=" November ";
translations["de"]["resultpage"][" Dez "]=" Dezember ";
translations["de"]["resultpage"]["OPERATED BY "]="Durchgef&uuml;hrt von ";

// initialize local storage for resolved distances
var distances = new Object();
// initialize local storage for current itin
var currentItin = new Object();

if (mptSettings["scriptEngine"] === 0 && window.top === window.self) {
 startScript(); 
} else if( window.top === window.self ) {
  // execute language detection and afterwards functions for current page
  if (typeof window.addEventListener !== "undefined"){
  window.addEventListener('load', startScript(), false);
  } else if (typeof window.attachEvent !== "undefined") {
  window.attachEvent("onload", startScript());    
  } else {
  window.onload = startScript();
  }
}

function startScript(){
  if (document.getElementById("mptSettingsContainer") === null ) {
    // Create CSS and Settings or anything else that needs to be executed once
    injectCss();
    createUsersettings();
  }
  if (window.location.href !== mptSettings["laststatus"]){
    setTimeout(function(){getPageLang();}, 100);
    mptSettings["laststatus"]=window.location.href;
  }
  if ( mptSettings["scriptrunning"] === 1 ){
   setTimeout(function(){startScript();}, 500); 
  }  
}

/**************************************** Settings Stuff *****************************************/
function createUsersettings(){
    var str="";
    var settingscontainer = document.createElement('div');
    settingscontainer.setAttribute('id', 'mptSettingsContainer');
    settingscontainer.setAttribute('style', 'border-bottom: 1px dashed grey;');
    settingscontainer.innerHTML = '<div><div style="display:inline-block;float:left;">Powertools running</div><div id="mtpNotification" style="margin-left:50px;display:inline-block;"></div><div id="settingsvistoggler" style="display:inline-block;float:right;cursor:pointer;">Show/Hide Settings</div><div id="mptSettings" class="invis" style="display:none;border-top: 1px dotted grey;"><div>';
    var target=document.getElementById("contentwrapper");
    target.parentNode.insertBefore(settingscontainer, target);
    document.getElementById('settingsvistoggler').onclick=function(){toggleSettingsvis();};
    target=document.getElementById("mptSettings");
    str ='<div style="float:left;width:25%">';
    str +='<div id="mpttimeformat" style="cursor:pointer;">Timeformat:<label>'+printSettingsvalue("timeformat")+'</label></div>';   
    str +='<div id="mptlanguage" style="cursor:pointer;">Language:<label>'+printSettingsvalue("language")+'</label></div>';
    str +='<div id="mptenableDeviders" style="cursor:pointer;">Enable deviders:<label>'+printSettingsvalue("enableDeviders")+'</label></div>';
    str +='<div id="mptenableInlinemode" style="cursor:pointer;">Inlinemode:<label>'+printSettingsvalue("enableInlinemode")+'</label></div>';
    str +='<div id="mptenableFarerules" style="cursor:pointer;">Open fare-rules in new window:<label>'+printSettingsvalue("enableFarerules")+'</label></div>';
    str +='</div><div style="float:left;width:25%">';
    str +='<div id="mptenablePricebreakdown" style="cursor:pointer;">Price breakdown:<label>'+printSettingsvalue("enablePricebreakdown")+'</label></div>'; 
    str +='<div id="mptenableMilesbreakdown" style="cursor:pointer;">Miles breakdown:<label>'+printSettingsvalue("enableMilesbreakdown")+'</label></div>';
    str +='<div id="mptenableMilesbreakdownautoload" style="cursor:pointer;">Miles breakdown autoload:<label>'+printSettingsvalue("enableMilesbreakdownautoload")+'</label></div>';
    str +='<div id="mptenableMilesInlinemode" style="cursor:pointer;">Print miles breakdown inline:<label>'+printSettingsvalue("enableMilesInlinemode")+'</label></div>';
    str +='<div id="mptenableIMGautoload" style="cursor:pointer;">Images autoload:<label>'+printSettingsvalue("enableIMGautoload")+'</label></div>';
    str +='</div><div style="float:left;width:25%">';
    str +='<div id="mptenablePlanefinder" style="cursor:pointer;">Enable Planefinder:<label>'+printSettingsvalue("enablePlanefinder")+'</label></div>';
    str +='<div id="mptenableSeatguru" style="cursor:pointer;">Enable Seatguru:<label>'+printSettingsvalue("enableSeatguru")+'</label></div>';
    str +='<div id="mptenableWheretocredit" style="cursor:pointer;">Enable WhereToCredit:<label>'+printSettingsvalue("enableWheretocredit")+'</label></div>';
    str +='</div><div style="float:left;width:25%">';  
    str +='<div id="mptacEdition" style="cursor:pointer;">Air Canada Edition:<label>'+printSettingsvalue("acEdition")+'</label></div>';
    str +='<div id="mptaaEdition" style="cursor:pointer;">American Edition:<label>'+printSettingsvalue("aaEdition")+'</label></div>';
    str +='</div><div style="clear:both;"></div>';
    target.innerHTML=str;
    document.getElementById('mpttimeformat').onclick=function(){toggleSettings("timeformat");};
    document.getElementById('mptlanguage').onclick=function(){toggleSettings("language");};
    document.getElementById('mptenableDeviders').onclick=function(){toggleSettings("enableDeviders");};
    document.getElementById('mptenableInlinemode').onclick=function(){toggleSettings("enableInlinemode");};
    document.getElementById('mptenableIMGautoload').onclick=function(){toggleSettings("enableIMGautoload");};
    document.getElementById('mptenableFarerules').onclick=function(){toggleSettings("enableFarerules");};
    document.getElementById('mptenablePricebreakdown').onclick=function(){toggleSettings("enablePricebreakdown");};
    document.getElementById('mptenableMilesbreakdown').onclick=function(){toggleSettings("enableMilesbreakdown");};
    document.getElementById('mptenableMilesbreakdownautoload').onclick=function(){toggleSettings("enableMilesbreakdownautoload");}; 
    document.getElementById('mptenableMilesInlinemode').onclick=function(){toggleSettings("enableMilesInlinemode");};
    document.getElementById('mptenablePlanefinder').onclick=function(){toggleSettings("enablePlanefinder");};
    document.getElementById('mptenableSeatguru').onclick=function(){toggleSettings("enableSeatguru");};
    document.getElementById('mptenableWheretocredit').onclick=function(){toggleSettings("enableWheretocredit");};
    document.getElementById('mptacEdition').onclick=function(){toggleSettings("acEdition");};
    document.getElementById('mptaaEdition').onclick=function(){toggleSettings("aaEdition");};  
}
function toggleSettingsvis(){
  var target=document.getElementById("mptSettings");
  if (hasClass(target,"vis")){
    target.setAttribute('class', 'invis');
    target.style.display="none"; 
  } else {
    target.setAttribute('class', 'vis');
    target.style.display="block"; 
  }
}
function toggleSettings(target){
   switch(target) {
      case "timeformat":
         if (mptUsersettings["timeformat"]=="12h"){
           mptUsersettings["timeformat"]="24h";
         } else {
           mptUsersettings["timeformat"]="12h";
         }
          break;
      case "language":
         if (mptUsersettings["language"]=="de"){
           mptUsersettings["language"]="en";
         } else {
           mptUsersettings["language"]="de";
         }
          break;
      case "acEdition":
      		if (acEditions.indexOf(mptUsersettings["acEdition"]) == (acEditions.length - 1)) {
			      mptUsersettings["acEdition"] = acEditions[0];
      		} else {
      			mptUsersettings["acEdition"] = acEditions[(acEditions.indexOf(mptUsersettings["acEdition"]) + 1)];	
      		}
      	break;
     case "aaEdition":
          var pos=findPositionForValue(mptUsersettings["aaEdition"],aaEditions);
      		if (pos >= (aaEditions.length - 1) || pos === -1) {
			      mptUsersettings["aaEdition"] = aaEditions[0]["value"];
      		} else {
            pos++;
      			mptUsersettings["aaEdition"] = aaEditions[pos]["value"];	
      		}
      	break;        
      default:
        if (mptUsersettings[target]==1){
           mptUsersettings[target]=0;
         } else {
           mptUsersettings[target]=1;
         };
  }
  document.getElementById("mpt"+target).firstChild.nextSibling.innerHTML=printSettingsvalue(target);
  if (mptSettings["scriptEngine"] === 1) {
      GM_setValue("mptUsersettings", JSON.stringify(mptUsersettings));
    }
}

function printSettingsvalue(target){
   var ret="";
   switch(target) {
      case "timeformat":
          ret=mptUsersettings["timeformat"];
          break;
      case "language":
          ret=mptUsersettings["language"];
          break;
      case "acEdition":
          ret=mptUsersettings["acEdition"];
          break;
      case "aaEdition":
          ret=findNameForValue(mptUsersettings["aaEdition"],aaEditions);
          break;        
      default:
          ret=boolToEnabled(mptUsersettings[target]);
  }
  return ret; 
}
function findNameForValue(needle, haystack){  
  var ret="Unknown";
  for (var i in haystack){
    if (haystack[i]["value"]==needle) {
      ret = haystack[i]["name"];
      break;
    }
  }
  return ret;  
}
function findPositionForValue(needle, haystack){
  var ret=-1;
  for (var i in haystack){
    if (haystack[i]["value"]==needle) {
      ret = [i];
      break;
    }
  }
  return ret;  
}
function printNotification(text) {
  var target = document.getElementById('mtpNotification');
  if (target===null){
    alert("mtp Error: Notification container not Found");
  } else {
   if (text=="empty"){
     target.innerHTML= "";
   } else {
     //possibility to print multiple notifications
     target.innerHTML= target.innerHTML+"<div>"+text+"</div>";
   }   
  } 
}
/**************************************** Get Language *****************************************/
function getPageLang(){
    // reset Notification due to pagechange
    printNotification("empty");
    mptSettings["itaLanguage"]="en";
    mptSettings["retrycount"]=1;
    if (window.location.href.indexOf("view-details") !=-1) {
       setTimeout(function(){fePS();}, 200);   
    } else if (window.location.href.indexOf("#search:") !=-1 || window.location.href == "https://matrix.itasoftware.com/" || window.location.href == "https://matrix.itasoftware.com/") {
       setTimeout(function(){startPage();}, 200);   
    }
}
/**************************************** General Functions *****************************************/
//Parses all of the outputs of regexp matches into an array
function exRE(str,re){
  var ret= new Array();
  var m;
  var i=0;
  while( (m = re.exec(str)) != null ) {
  if (m.index === re.lastIndex) {
  re.lastIndex++;
  }
  for (k=1;k<m.length;k++) {
  ret[i++]=m[k];
  }
  }
  return ret;
}
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}
function monthnameToNumber(month){
  var monthnames=["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP","OCT", "NOV", "DEC"];
  return (monthnames.indexOf(month.toUpperCase())+1);
}
function monthnumberToName(month){
  var monthnames=["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP","OCT", "NOV", "DEC"];
  return (monthnames[month-1]);
}
function getFlightYear(day,month){
 //Do date magic
    var d = new Date();
    var cmonth=d.getMonth();
    var cday=d.getDate();
    var cyear=d.getFullYear();
  // make sure to handle the 0-11 issue of getMonth()
    if (cmonth > (month-1) || (cmonth == (month-1) && day < cday)) {
    cyear += 1; //The flight is next year
    }
   return cyear;
}
function return12htime(match){
        var regex = /([01]?\d)(:\d{2})(AM|PM|am|pm| AM| PM| am| pm)/g;
        match = regex.exec(match);
        var offset = 0;
        match[3]=trimStr(match[3]);
        if  ((match[3]=='AM' || match[3]=='am') && match[1]=='12'){offset = -12;}
        else if  ((match[3]=='PM' || match[3]=='pm') && match[1]!='12'){ offset = 12;}
        return (+match[1] + offset) +match[2];        
};
function trimStr(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}
function boolToEnabled(value){
   if (value==1) {
   return "enabled"
   } else {
   return "disabled"
   }
}
function getcabincode(cabin){
  switch(cabin) {
      case "E":
          cabin=0;
          break;
      case "P":
          cabin=1;
          break;
      case "B":
          cabin=2;
          break;
      case "F":
          cabin=3;
          break;
      default:
          cabin=0;
  }
  return cabin;
}
function findtarget(tclass,nth){
  var elems = document.getElementsByTagName('*'), i;
  j=0;
  for (i in elems) {
       if((' ' + elems[i].className + ' ').indexOf(' '+tclass+' ') > -1) {
        j++;
        if (j==nth){
         return elems[i];
         break;
        }
       }
   }
}
function findtargets(tclass){
  var elems = document.getElementsByTagName('*'), i;
  var ret = new Array();
  for (i in elems) {
       if((' ' + elems[i].className + ' ').indexOf(' '+tclass+' ') > -1) {
         ret.push(elems[i]);
       }
   }
  return ret;
}
function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
function doHttpRequest(url,callback){
  if (typeof(callback) !== "function") {
       printNotification("Error: Invalid callback in doHttpRequest -> not a function");
       return false;  
  }
  var xmlHttpObject = false;
  if (typeof(XMLHttpRequest) !== "undefined"){ xmlHttpObject = new XMLHttpRequest(); }
  if (!xmlHttpObject) {
       printNotification("Error: Failed to initialize http request");
       return false;  
  }
  xmlHttpObject.onreadystatechange=function(){
    if (xmlHttpObject.readyState==4 && xmlHttpObject.status==200)
      {
      callback(xmlHttpObject);
      } else if (xmlHttpObject.readyState==4 && xmlHttpObject.status!=200) {
       printNotification("Error: Failed to complete http request");
       return false;  
      }   
   } 
  xmlHttpObject.open("GET",url,true);
  xmlHttpObject.send();
}
function findItinTarget(leg,seg,tcell){
  var target = findtarget(classSettings["resultpage"]["itin"],1);
  if (target === false) {
  printNotification("Error: Itin not found in findItinTarget-function");
  return false;
  }
  
  target=target.nextSibling.nextSibling;
  // go to leg
  var target=target.children[(leg-1)];
  if (target === undefined) {
  printNotification("Error: Leg not found in findItinTarget-function");
  return false;
  }
  // go to segments of leg
  target=target.children[1].children;
  if (target.length >= 2) {
      // go to desired segment
      var index = 0;
      var j = 0;
      for(i=0;i<target.length;i++) {
       if( hasClass(target[i], classSettings["resultpage"]["itinRow"]) == 1) {
         j++;
          if (j>=seg){
            index = i;
            //special handling for one-seg-legs here
            if (target.length === 2 || target.length === 3){
              // 1. Headline 2. Flight-details 3. arrival next day.. 
              index--;
            }
            break;
          }
        }
      } // end-for
      if (i==target.length){
        //target not found
        printNotification("Error: Call to unreachable Segment in Leg "+leg+" in findItinTarget-function");
        return false;
      }
      var rowoffset=0;
      var columnoffset=0;
      
      switch(tcell) {
          case "headline":
              // special case here allways first row... even in one-seg-legs
              rowoffset= index * -1;
              columnoffset=1;
              break;          
          case "logo":
              rowoffset=0;
              columnoffset=0;
              break;
          case "airportsdate":
              rowoffset=0;
              columnoffset=1;
              break;
          case "flight":
              rowoffset=1;
              columnoffset=0;
              break;
          case "deptime":
              rowoffset=1;
              columnoffset=1;
              break;
          case "arrtime":
              rowoffset=1;
              columnoffset=2;
              break;
          case "duration":
              rowoffset=1;
              columnoffset=2;
              break;          
          case "plane":
              rowoffset=1;
              columnoffset=4;
              break;
          case "cabin":
              rowoffset=1;
              columnoffset=5;
              break;  
          default:
              printNotification("Error: Unknown Target in findItinTarget-function");
              return false;
      }
      return target[index+rowoffset].children[columnoffset];    
  } else {
     printNotification("Error: Unknown error in findItinTarget-function");
     return false;
  }  
}
/********************************************* Start page *********************************************/
function startPage() {
    // try to get content  
    if (findtarget( classSettings["startpage"]["maindiv"],1)===undefined){
      printNotification("Error: Unable to find content on start page.");
      return false;
    } else {
      // apply style-fix
      target = findtarget( classSettings["startpage"]["maindiv"],1);
      target.children[0].children[0].children[0].children[0].setAttribute('valign', 'top');
    }
  
}
/********************************************* Result page *********************************************/
//Primary function for extracting flight data from ITA/Matrix
function fePS() {
    // try to get content
    if (findtarget(classSettings["resultpage"]["itin"],1)===undefined){
      printNotification("Error: Unable to find Content on result page.");
      return false;
    }
    // retry if itin not loaded  
    if (findtarget(classSettings["resultpage"]["itin"],1).parentNode.previousSibling.previousSibling.style.display!="none") { 
      mptSettings["retrycount"]++;
      if (mptSettings["retrycount"]>50) {
        printNotification("Error: Timeout on result page. Content not found after 10s.");
        return false;
      };
      setTimeout(function(){fePS();}, 200);    
      return false;
    };
    // do some self-testing to prevent crashing on class-changes
    for (i in classSettings["resultpage"]) {
       if (findtarget(classSettings["resultpage"][i],1) === undefined) {
          printNotification("Error: Unable to find class "+classSettings["resultpage"][i]+" for "+i+".");
          return false;                  
       }
   }
   
   
    if (mptUsersettings["enableFarerules"]==1) bindRulelinks();
       
    // empty outputcontainer
    if (document.getElementById('powertoolslinkcontainer')!=undefined){
        var div = document.getElementById('powertoolslinkcontainer');
        div.innerHTML ="";
    }
	
    // remove powertool items
  	var elems = findtargets('powertoolsitem');
  	for(var i = elems.length - 1; i >= 0; i--){
  		elems[i].parentNode.removeChild(elems[i]);
  	}
    
    // configure sidebar
    if (mptUsersettings["enableInlinemode"]==1) {
    findtarget(classSettings["resultpage"]["milagecontainer"],1).setAttribute('rowspan', 10);
    //findtarget('GE-ODR-BET',1).setAttribute('class', 'GE-ODR-BBFB');
    } else if (mptUsersettings["enableInlinemode"]==0 && mptUsersettings["enablePricebreakdown"]==1) {
      findtarget(classSettings["resultpage"]["milagecontainer"],1).setAttribute('rowspan', 3);
    } else {
      findtarget(classSettings["resultpage"]["milagecontainer"],1).setAttribute('rowspan', 2);
    }
  
    readItinerary();
    // Translate page
    if (mptUsersettings["language"]!=="en" && translations[mptUsersettings["language"]]["resultpage"]!==undefined) translate("resultpage",mptUsersettings["language"],findtarget(classSettings["resultpage"]["itin"],1).nextSibling.nextSibling);
    // Search - Remove - Add Pricebreakdown
    var target=findtarget('pricebreakdown',1);
    if (target!=undefined) target.parentNode.removeChild(target);
  
    if (mptUsersettings["enablePricebreakdown"]==1) rearrangeprices(currentItin.dist);
    
    if (mptUsersettings["enableInlinemode"]==1) printCPM();
 
    /*** Airlines ***/
    printAA();  
    printAC();   
    if (currentItin["itin"].length == 2 &&
        currentItin["itin"][0]["orig"] == currentItin["itin"][1]["dest"] &&
        currentItin["itin"][0]["dest"] == currentItin["itin"][1]["orig"]) {
        printAF();
    } 
    // we print AZ if its only on AZ-flights
    if (currentItin["carriers"].length==1 && currentItin["carriers"][0]=="AZ"){ printAZ(); }  
    printDelta();   
    printKL();
    printUA();
    // we print US if its only on US-flights
    if (currentItin["carriers"].length==1 && currentItin["carriers"][0]=="US"){ printUS(); }
  
    if(mptUsersettings["enableDeviders"]==1) printSeperator();
    /*** OTAs ***/
    printCheapOair();   
    printOrbitz();
    printHipmunk ();
    printPriceline ();
    printEtraveli();
  
    if(mptUsersettings["enableDeviders"]==1) printSeperator();
    /*** other stuff ***/
    printFarefreaks (0);
    printFarefreaks (1);
    printGCM ();
    printWheretocredit();

    /*** inline binding ***/
    if(mptUsersettings["enableSeatguru"]==1) bindSeatguru();
    if(mptUsersettings["enablePlanefinder"]==1) bindPlanefinder();  
    if(mptUsersettings["enableMilesbreakdown"]==1 && typeof(JSON) !== "undefined") printMilesbreakdown();  
    if(mptUsersettings["enableWheretocredit"]==1) bindWheretocredit();
}
//*** Rulelinks ****//
function bindRulelinks(){
    var i = 0;
    var j = 0;
    var t = 1;
    var target=findtarget(classSettings["resultpage"]["rulescontainer"],t);
    if (target!=undefined){
      do {
          var current=Number(target.firstChild.innerHTML.replace(/[^\d]/gi, ""));
          if (i>current){
            j++;
            i=0;  
          }
          target=target.nextSibling.nextSibling.nextSibling;
          var targeturl = window.location.href.replace(/view-details/, "view-rules")+";fare-key="+j+"/"+i;
          var newlink = document.createElement('a');
          newlink.setAttribute('class', 'gwt-Anchor');
          newlink.setAttribute('href', targeturl);
          newlink.setAttribute('target', "_blank");
          var linkText = document.createTextNode("rules");
          newlink.appendChild(linkText);
          target.parentNode.replaceChild(newlink,target);    
          i++;
          t++;
          target=findtarget(classSettings["resultpage"]["rulescontainer"],t);
      }
      while (target!=undefined);  
    }   
}
//*** Price breakdown ****//
function rearrangeprices(){
    var basefares = 0;
    var taxes = 0;
    var surcharges =0;
    var basefound=0;
    var cur="";
    // define searchpattern to detect carrier imposed surcharges
    var searchpatt = new RegExp("\((YQ|YR)\)");
    var t=1;
    var target=findtarget(classSettings["resultpage"]["htbLeft"],t);
    if (mptUsersettings["enableInlinemode"] == 0){
     var output="";
     var count=0;
    }
    if (target!=undefined){
      do {    
          var type = target.firstChild.firstChild.nodeType;
          if (type == 1) {
            basefound=1;
            //it's a basefare
            var price = Number(target.nextSibling.firstChild.innerHTML.replace(/[^\d]/gi, ""));
            if (cur=="") cur=target.nextSibling.firstChild.innerHTML.replace(/[\d,.]/g, "");
            basefares+=price;
          } else if(basefound==1 && type == 3) {
            //its a pricenode
            var name  = target.firstChild.innerHTML;    
            var price = Number(target.nextSibling.firstChild.innerHTML.replace(/[^\d]/gi, ""));            
            if( hasClass(target.nextSibling, classSettings["resultpage"]["htbGreyBorder"]) == 1) {
             //we are done for this container
              //console.log( "Basefare: "+ basefares);    
              //console.log( "Taxes: "+ taxes); 
              //console.log( "Surcharges: "+ surcharges);
              var sum=basefares+taxes+surcharges;
              if (mptUsersettings["enableInlinemode"] == 1){
                  var newtr = document.createElement('tr');
                  newtr.innerHTML = '<td class="'+classSettings["resultpage"]["htbLeft"]+'"><div class="gwt-Label">Basefare per passenger ('+((basefares/sum)*100).toFixed(2).toString()+'%)</div></td><td class="'+classSettings["resultpage"]["htbGreyBorder"]+'"><div class="gwt-Label">'+cur+(basefares/100).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')+'</div></td>';
                  target.parentNode.parentNode.insertBefore(newtr, target.parentNode);  
                  var newtr = document.createElement('tr');
                  newtr.innerHTML = '<td class="'+classSettings["resultpage"]["htbLeft"]+'"><div class="gwt-Label">Taxes per passenger ('+((taxes/sum)*100).toFixed(2).toString()+'%)</div></td><td class="'+classSettings["resultpage"]["htbRight"]+'"><div class="gwt-Label">'+cur+(taxes/100).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')+'</div></td>';
                  target.parentNode.parentNode.insertBefore(newtr, target.parentNode); 
                  var newtr = document.createElement('tr');
                  newtr.innerHTML = '<td class="'+classSettings["resultpage"]["htbLeft"]+'"><div class="gwt-Label">Surcharges per passenger ('+((surcharges/sum)*100).toFixed(2).toString()+'%)</div></td><td class="'+classSettings["resultpage"]["htbRight"]+'"><div class="gwt-Label">'+cur+(surcharges/100).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')+'</div></td>';
                  target.parentNode.parentNode.insertBefore(newtr, target.parentNode);  
                  var newtr = document.createElement('tr');
                  newtr.innerHTML = '<td class="'+classSettings["resultpage"]["htbLeft"]+'"><div class="gwt-Label">Basefare + Taxes per passenger ('+(((basefares+taxes)/sum)*100).toFixed(2).toString()+'%)</div></td><td class="'+classSettings["resultpage"]["htbGreyBorder"]+'"><div class="gwt-Label">'+cur+((basefares+taxes)/100).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')+'</div></td>';
                  target.parentNode.parentNode.insertBefore(newtr, target.parentNode); 
              } else {
                 count++;
                 output +='<table style="float:left; margin-right:15px;"><tbody>';
                 output +='<tr><td colspan=3 style="text-align:center;">Price breakdown '+count+':</td></tr>';
                 output +='<tr><td>'+cur+' per mile</td><td colspan=2 style="text-align:center;">'+((sum/currentItin["dist"])/100).toFixed(4).toString()+'</td></tr>';
                 output +='<tr><td>Basefare</td><td style="padding:0px 3px;text-align:right;">'+((basefares/sum)*100).toFixed(1).toString()+'%</td><td style="text-align:right;">'+cur+(basefares/100).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')+"</td></tr>";
                 output +='<tr><td>Tax</td><td style="padding:0px 3px;text-align:right;">'+((taxes/sum)*100).toFixed(1).toString()+'%</td><td style="text-align:right;">'+cur+(taxes/100).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')+"</td></tr>";
                 output +='<tr><td>Surcharges</td><td style="padding:0px 3px;text-align:right;">'+((surcharges/sum)*100).toFixed(1).toString()+'%</td><td style="text-align:right;">'+cur+(surcharges/100).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')+"</td></tr>";
                 output +='<tr><td style="border-top: 1px solid #878787;padding:2px 0">Bf+Tax</td><td style="border-top: 1px solid #878787;padding:2px 3px;text-align:right;">'+(((basefares+taxes)/sum)*100).toFixed(1).toString()+'%</td><td style="border-top: 1px solid #878787;padding:2px 0; text-align:right;">'+cur+((basefares+taxes)/100).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')+"</td></tr>";
                 output +="</tbody></table>"; 
              }      
              // reset var
              basefound=0;
              basefares = 0;
              taxes = 0;
              surcharges =0;         
            } else {
              //Carrier surcharge?
              if (searchpatt.test(name)===true){
               surcharges+=price; 
              } else {
               taxes+=price; 
              }           
            }
          }    
          t++;
          target=findtarget(classSettings["resultpage"]["htbLeft"],t);
      }
      while (target!=undefined);  
    }
    if (mptUsersettings["enableInlinemode"] == 0){
      var printtarget=findtarget(classSettings["resultpage"]["htbContainer"],1).parentNode.parentNode.parentNode;
      var newtr = document.createElement('tr');
      newtr.setAttribute('class','pricebreakdown');
      newtr.innerHTML = '<td><div>'+output+'</div></td>';
      printtarget.parentNode.insertBefore(newtr, printtarget); 
    }
}
//*** Mileage breakdown ****//
function printMilesbreakdown(){
 if (mptUsersettings["enableMilesbreakdownautoload"] == 1) {
   retrieveMileages();
 } else {
  target = findItinTarget(1,1,"headline");
  target.innerHTML = target.innerHTML.replace(target.firstChild.className, target.firstChild.className + '" style="display:inline-block')+'<div id="loadmileage" class="'+target.firstChild.className+'" style="display:inline-block;cursor:pointer;float:right;">Load mileage</div>'; 
  document.getElementById("loadmileage").onclick=function() {
        document.getElementById("loadmileage").parentNode.removeChild(document.getElementById("loadmileage"));
        retrieveMileages();
      };        
 }
  
}
function retrieveMileages(){
   // collect all airport cominations
  var routes = new Object();
  var params = ""
  for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
        //walks each segment of leg
        // check if data is localy stored or already part of current task
        if ( distances[currentItin["itin"][i]["seg"][j]["orig"]+currentItin["itin"][i]["seg"][j]["dest"]] === undefined &&
             distances[currentItin["itin"][i]["seg"][j]["dest"]+currentItin["itin"][i]["seg"][j]["orig"]] === undefined &&
             routes[currentItin["itin"][i]["seg"][j]["orig"]+currentItin["itin"][i]["seg"][j]["dest"]] === undefined &&
             routes[currentItin["itin"][i]["seg"][j]["dest"]+currentItin["itin"][i]["seg"][j]["orig"]] === undefined ) {
             routes[currentItin["itin"][i]["seg"][j]["orig"]+currentItin["itin"][i]["seg"][j]["dest"]] = currentItin["itin"][i]["seg"][j]["orig"]+"-"+currentItin["itin"][i]["seg"][j]["dest"];
        }       
      }
   }
  //build request
  for (i in routes) {
    params+=(params===""?"":"&")+"r[]="+routes[i];
  }
  if (params==="") {
    //no request needed.. call final print function
    printMileages();
    return false; 
  }
  doHttpRequest("https://www.farefreaks.com/ajax/calcroutedist.php?"+params,function(xmlHttpObject) {
     var response=false;
     if (typeof(JSON) !== "undefined"){
       try {
          response = JSON.parse(xmlHttpObject.responseText);
        } catch (e){
          response=false;
        }
     } else {
       // do not(!) use eval here :-/
       printNotification("Error: Failed parsing route data - Browser not supporting JSON");
       return false;
     }     
     if (typeof(response) !== "object"){
      printNotification("Error: Failed parsing route data");
      return false;
     }
     if (response["success"]===undefined || response["error"]===undefined || response["data"]===undefined ){
      printNotification("Error: wrong route data format");
      return false;
     }
     if (response["success"]!=="1"){
      printNotification("Error: "+response["error"]+" in retrieveMileages function");
      return false; 
     }
     // add new routes to distances
     for (i in response["data"]) {
        distances[i]=parseFloat(response["data"][i]);
     }
     printMileages(); 
    });  
}
function printMileages(){
  var legdistance=0;
  for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
        //walks each segment of leg
        // check if data is localy stored
        if ( distances[currentItin["itin"][i]["seg"][j]["orig"]+currentItin["itin"][i]["seg"][j]["dest"]] === undefined &&
             distances[currentItin["itin"][i]["seg"][j]["dest"]+currentItin["itin"][i]["seg"][j]["orig"]] === undefined ) {
             printNotification("Error: Missing route data for "+currentItin["itin"][i]["seg"][j]["orig"]+" => "+currentItin["itin"][i]["seg"][j]["dest"]);
             return false;
        } else if ( distances[currentItin["itin"][i]["seg"][j]["orig"]+currentItin["itin"][i]["seg"][j]["dest"]] !== undefined &&
                    distances[currentItin["itin"][i]["seg"][j]["dest"]+currentItin["itin"][i]["seg"][j]["orig"]] === undefined ) {         
          currentItin["itin"][i]["seg"][j]["dist"]=distances[currentItin["itin"][i]["seg"][j]["orig"]+currentItin["itin"][i]["seg"][j]["dest"]];
        } else {
          currentItin["itin"][i]["seg"][j]["dist"]=distances[currentItin["itin"][i]["seg"][j]["dest"]+currentItin["itin"][i]["seg"][j]["orig"]];
        }          
        legdistance+=currentItin["itin"][i]["seg"][j]["dist"];          
        currentItin["itin"][i]["seg"][j]["dist"]=Math.floor(currentItin["itin"][i]["seg"][j]["dist"]);
      }
     currentItin["itin"][i]["dist"]=Math.floor(legdistance);
     legdistance=0;
   }
  // lets finally print it:
  if (mptUsersettings["enableInlinemode"] === 1 || mptUsersettings["enableMilesInlinemode"] === 1) {
  var target = "";
      for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
      target = findItinTarget((i+1),1,"headline");
      target.innerHTML = target.innerHTML.replace(target.firstChild.className, target.firstChild.className + '" style="display:inline-block')+'<div style="display:inline-block;float:right;"> '+currentItin["itin"][i]["dist"]+' miles</div>'; 
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
        //walks each segment of leg
         if (currentItin["itin"][i]["seg"].length>1) {
         target = findItinTarget((i+1),(j+1),"airportsdate");
         target.innerHTML = target.innerHTML.replace(target.firstChild.className, target.firstChild.className + '" style="display:inline-block')+'<div style="display:inline-block;float:right;margin-right:110px;"> '+currentItin["itin"][i]["seg"][j]["dist"]+' miles</div>';       
        }
      }
   }
  } else {  
  var output="";
  output +='<tbody>';
  output +='<tr><td colspan="4" style="text-align:center;">Mileage breakdown:</td></tr>';         
  for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
    output +='<tr><td style="border-bottom: 1px solid #878787;padding:2px 2px">Leg '+(i+1)+'</td><td style="border-bottom: 1px solid #878787;padding:2px 0">'+currentItin["itin"][i]["orig"]+'</td><td style="border-bottom: 1px solid #878787;padding:2px 0">'+currentItin["itin"][i]["dest"]+'</td><td style="border-bottom: 1px solid #878787;padding:2px 0;text-align:right;">'+currentItin["itin"][i]["dist"]+'</td></tr>';
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
        //walks each segment of leg
        if (currentItin["itin"][i]["seg"].length>1) output +='<tr><td></td><td>'+currentItin["itin"][i]["seg"][j]["orig"]+'</td><td>'+currentItin["itin"][i]["seg"][j]["dest"]+'</td><td style="text-align:right;">'+currentItin["itin"][i]["seg"][j]["dist"]+'</td></tr>';       
      }
   }
  output +="</tbody>"; 
  if (findtarget("pricebreakdown",1)===undefined){
       // create container
        var printtarget=findtarget(classSettings["resultpage"]["htbContainer"],1).parentNode.parentNode.parentNode;
        var newtr = document.createElement('tr');
        newtr.setAttribute('class','pricebreakdown');
        newtr.innerHTML = '<td><div><table style="float:left; margin-right:15px;">'+output+'</table></div></td>';
        printtarget.parentNode.insertBefore(newtr, printtarget); 
    } else {
      // add to existing container
      var printtarget = findtarget("pricebreakdown",1).firstChild.firstChild.firstChild; 
      var newtable = document.createElement('table');
      newtable.setAttribute('style','float:left; margin-right:15px;');
      newtable.innerHTML = output;
      printtarget.parentNode.insertBefore(newtable, printtarget);    
    }
  }    
}
//*** Readfunction ****//
function parseAddInfo(info){
  var ret= {codeshare:0, layoverduration:0, airportchange:0, arrDate:""};
  if (info.indexOf("This flight contains airport changes") ==-1){
               airportchange=1; 
              }
  if (info.indexOf("OPERATED BY") ==-1){
               codeshare=1; 
              }
  var temp = new Array();
  var re=/\,\s*([a-zA-Z]{3})\s*([0-9]{1,2})/g;
  temp = exRE(info,re);
  if (temp.length == 2){
    // Got datechange
      ret["arrDate"]={};
      ret["arrDate"]["month"]=monthnameToNumber(temp[0]);
      ret["arrDate"]["day"]=parseInt(temp[1]);
      ret["arrDate"]["year"]=getFlightYear(ret["arrDate"]["day"],ret["arrDate"]["month"]);
    }
  var temp = new Array();
  var re=/([0-9]{1,2})h\s([0-9]{1,2})m/g;
  temp = exRE(info,re);
  if (temp.length == 2){
     // Got layover
      ret["layoverduration"]=parseInt(temp[0])*60 + parseInt(temp[1]);
    }
  return ret;
}
function readItinerary(){
      // the magical part! :-)
      var replacementsold = new Array();
      var replacementsnew = new Array();

      var itin= new Array();
      var carrieruarray= new Array();
      var html = document.getElementById("contentwrapper").innerHTML;
      var re=/colspan\=\"5\"[^\(]+\(([\w]{3})[^\(]+\(([\w]{3})/g
      legs = exRE(html,re);
      // Got our outer legs now:
      for(i=0;i<legs.length;i+=2) {
        var legobj={};
        // prepare all elements but fill later
        legobj["arr"]={};
        legobj["dep"]={};
        legobj["orig"]=legs[i];
        legobj["dest"]=legs[i+1];
        legobj["seg"]= new Array();
        itin.push(legobj);
      }
      // extract basefares
      var farebases = new Array();
      var re=/Carrier\s[\w]{2}\s([\w]+).*?Covers\s([\w\(\)\s\-,]+)/g;
      farebases = exRE(html,re);
      var fareBaseLegs = { fares :new Array(), legs:new Array()};
      for(i=0;i<farebases.length;i+=2) {
        fareBaseLegs["fares"].push(farebases[i]);
        // find the covered airports
        fareBaseLegs["legs"].push(exRE(farebases[i+1],/(\w\w\w\-\w\w\w)/g));
      }
      var dirtyFare= new Array();  
      // dirty but handy for later usage since there is no each function
      for(var i=0;i<fareBaseLegs["legs"].length;i++) {
              for(var j=0;j<fareBaseLegs["legs"][i].length;j++) {
               dirtyFare.push(fareBaseLegs["legs"][i][j]+"-"+fareBaseLegs["fares"][i]);
              }
        }   
      var segs = new Array();
      var re=/35px\/(\w{2}).png[^\(]+\(([A-Z]{3})[^\(]+\(([A-Z]{3})[^\,]*\,\s*([a-zA-Z]{3})\s*([0-9]{1,2}).*?gwt-Label.*?([0-9]*)\<.*?Dep:[^0-9]+(.*?)\<.*?Arr:[^0-9]+(.*?)\<.*?([0-9]{1,2})h\s([0-9]{1,2})m.*?gwt-Label.*?\<.*?gwt-Label\"\>(\w).*?\((\w)\).*?\<.*?tr(.*?)(table|airline_logos)/g;
      segs = exRE(html,re);
      // used massive regex to get all our segment-info in one extraction
      var legnr=0;
      var segnr=0;
      for(i=0;i<segs.length;i+=14) {
            temp={};
            temp["carrier"]=segs[i];
            temp["orig"]=segs[i+1];
            temp["dest"]=segs[i+2];
            temp["dep"]={};
            temp["arr"]={};
            temp["dep"]["month"]=monthnameToNumber(segs[i+3]);
            temp["dep"]["day"]=parseInt(segs[i+4]);
            temp["dep"]["year"]=getFlightYear(temp["dep"]["day"],temp["dep"]["month"]);
            temp["fnr"]=segs[i+5];      
            if (mptUsersettings["timeformat"]=="24h") {
                 replacementsold.push(segs[i+6]);
                 replacementsold.push(segs[i+7]); 
                }
            segs[i+6]=return12htime(segs[i+6]);
            segs[i+7]=return12htime(segs[i+7]);
            if (mptUsersettings["timeformat"]=="24h") {          
                  replacementsnew.push((segs[i+6].length==4? "0":"")+segs[i+6]) ;
                  replacementsnew.push((segs[i+7].length==4? "0":"")+segs[i+7]);
                }
            temp["dep"]["time"]=segs[i+6];  
            temp["arr"]["time"]=segs[i+7];  
            temp["duration"]=parseInt(segs[i+8])*60 + parseInt(segs[i+9]);
            temp["cabin"]=getcabincode(segs[i+10]);   
            temp["bookingclass"]=segs[i+11];
            var addinformations=parseAddInfo(segs[i+12]);  
            if (addinformations["arrDate"]!=""){
            temp["arr"]["day"]=addinformations["arrDate"]["day"];
            temp["arr"]["month"]=addinformations["arrDate"]["month"];
            temp["arr"]["year"]=addinformations["arrDate"]["year"]; 
            } else {
            temp["arr"]["day"]=temp["dep"]["day"];
            temp["arr"]["month"]=temp["dep"]["month"];
            temp["arr"]["year"]=temp["dep"]["year"];
            }
            temp["codeshare"]=addinformations["codeshare"];
            temp["layoverduration"]=addinformations["layoverduration"];  
            temp["airportchange"]=addinformations["airportchange"];
            // find farecode for leg
             for(var j=0;j<dirtyFare.length;j++) {
                 if (dirtyFare[j].indexOf(temp["orig"]+"-"+temp["dest"]+"-")!= -1) {
                    //found farebase of this segment
                     temp["farebase"]=dirtyFare[j].replace(temp["orig"]+"-"+temp["dest"]+"-","");
                     dirtyFare[j]=temp["farebase"]; // avoid reuse
                     j=dirtyFare.length;
                     }
             }
            if (itin[legnr]===undefined) itin[legnr] = new Object();
            if (itin[legnr]["seg"]===undefined) itin[legnr]["seg"] = new Array();
            itin[legnr]["seg"].push(temp);     
            // push carrier
            if (!inArray(temp["carrier"],carrieruarray)) {carrieruarray.push(temp["carrier"]);};
            // push dates and times into leg-array
            if ( segnr == 0 ){
              if (itin[legnr]["dep"]===undefined) itin[legnr]["dep"] = new Object();
              itin[legnr]["dep"]["day"]=temp["dep"]["day"];
              itin[legnr]["dep"]["month"]=temp["dep"]["month"];
              itin[legnr]["dep"]["year"]=temp["dep"]["year"];
              itin[legnr]["dep"]["time"]=temp["dep"]["time"];
            }
            if (itin[legnr]["arr"]===undefined) itin[legnr]["arr"] = new Object();
            itin[legnr]["arr"]["day"]=temp["arr"]["day"];
            itin[legnr]["arr"]["month"]=temp["arr"]["month"];
            itin[legnr]["arr"]["year"]=temp["arr"]["year"];
            itin[legnr]["arr"]["time"]=temp["arr"]["time"];
            segnr++;
            // check for legchange
            if(segs[i+13]=="table") {
              legnr++;
              segnr=0;
            }

      }
      // extract mileage paxcount and total price
      var milepaxprice = new Array();
      var re=/Mileage.*?([0-9,]+)\stotal\smiles.*?Total\scost\sfor\s([0-9])\spassenger.*?<div.*?([0-9,.]+)/g;
      milepaxprice = exRE(html,re);
      // detect currency
      itinCur="";
      var re = /Total\scost\sfor\s[0-9]\spassenger([^0-9]+[^\<]+)/g;
      var curstring=new Array();
      curstring = exRE(html,re);
      curstring=curstring[0].replace(/<[^>]+>/g,"")
      var searchpatt = /\€/;
      if (searchpatt.test(curstring)===true){
            itinCur="EUR";
                    }
      var searchpatt = /US\$/;
      if (searchpatt.test(curstring)===true){
            itinCur="USD";
                    }
      currentItin={itin:itin, price: milepaxprice[2].replace(/\,/g,""), numPax:milepaxprice[1] , carriers:carrieruarray, cur : itinCur, farebases:fareBaseLegs["fares"], dist:milepaxprice[0].replace(/\./g,"").replace(/\,/g,"")}; 
      //console.log(currentItin); //Remove to see flightstructure 
      // lets do the time-replacement
       if(replacementsold.length>0) {
         target=findtarget(classSettings["resultpage"]["itin"],1).nextSibling.nextSibling;
         for(i=0;i<replacementsold.length;i++) {
           re = new RegExp(replacementsold[i],"g");
           target.innerHTML = target.innerHTML.replace(re, replacementsnew[i]);
         }
       }
}  
//*** Printfunctions ****//
function translate(page,lang,target){
       if (translations[lang]===undefined){
         printNotification("Error: Translation "+lang+" not found");
         return false;
       }
       if (translations[lang][page]===undefined){
         printNotification("Error: Translation "+lang+" not found for page "+page);
         return false;
       }
      for (i in translations[lang][page]) {
           re = new RegExp(i,"g");
           target.innerHTML = target.innerHTML.replace(re, translations[lang][page][i]);
       }  
}

function printCPM(){
  printItemInline((Number(currentItin.price) / Number(currentItin.dist)).toFixed(4) + ' cpm','',1);
}
function printAA(){
  var createUrl = function (edition) {
    var url = "http://i11l-services.aa.com/xaa/mseGateway/entryPoint.php?PARAM=";
    var search ="1,,USD0.00,"+currentItin["itin"].length+",";
    var legs = new Array();
    var leg ="";
    var segs = new Array();
    var seg = ""; 
    
    //Build multi-city search based on legs
    for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
      segs = new Array();
            for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
            //walks each segment of leg
                var k=0;
                // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
                while ((j+k)<currentItin["itin"][i]["seg"].length-1){
                 if (currentItin["itin"][i]["seg"][j+k]["fnr"] != currentItin["itin"][i]["seg"][j+k+1]["fnr"] || 
                     currentItin["itin"][i]["seg"][j+k]["layoverduration"] >= 1440) break;
                 k++;
                }
                seg    = currentItin['itin'][i]['seg'][j+k]['arr']['year']+'-'+('0'+currentItin['itin'][i]['seg'][j+k]['arr']['month']).slice(-2)+'-'+('0'+currentItin['itin'][i]['seg'][j+k]['arr']['day']).slice(-2)+'T'+('0'+currentItin['itin'][i]['seg'][j+k]['arr']['time']).slice(-5)+'+00:00,';
                seg   += currentItin['itin'][i]['seg'][j]['bookingclass']+",";
                seg   += currentItin['itin'][i]['seg'][j]['dep']['year']+'-'+('0'+currentItin['itin'][i]['seg'][j]['dep']['month']).slice(-2)+'-'+('0'+currentItin['itin'][i]['seg'][j]['dep']['day']).slice(-2)+'T'+('0'+currentItin['itin'][i]['seg'][j]['dep']['time']).slice(-5)+'+00:00,';                
                seg   += currentItin['itin'][i]['seg'][j+k]['dest']+",";
                seg   += currentItin['itin'][i]['seg'][j]['carrier']+currentItin['itin'][i]['seg'][j]['fnr']+",";
                seg   += currentItin['itin'][i]['seg'][j]['orig']; // NO , here!
                segs.push(seg);
                j+=k;
      }
      search+=segs.length+","+segs.join()+",";
      //build leg structure
      leg =currentItin["itin"][i]["dep"]['year']+"-"+("0"+currentItin["itin"][i]["dep"]['month']).slice(-2)+"-"+("0"+currentItin["itin"][i]["dep"]['day']).slice(-2)+",";
      leg+=currentItin["itin"][i]["dest"]+",,";
      leg+=currentItin["itin"][i]["orig"]+","; // USE , here!
      legs.push(leg);     
    }
    search+="DIRECT,";
    search+=edition[0].toUpperCase()+","; // Language
    search+="3,";
    search+=currentItin["numPax"]+",";  // ADT
    search+="0,";  // Child
    search+="0,";  // Inf
    search+="0,";  // Senior
    search+=edition[1].toUpperCase()+","; // Country  
    // push outer search
    search+=currentItin["itin"].length+","+legs.join();  
    url+=encodeURIComponent(search);
    return url;
  };
  
  // get edition
  var edition=mptUsersettings["aaEdition"].split("_");
  if (edition.length!=2) {
    printNotification("Error:Invalid AA-Edition");
    return false;
  }
  var url = createUrl(edition);
  
  var extra = ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += aaEditions.map(function (obj, i) { return '<a href="' + createUrl(obj.value.split("_")) + '" target="_blank">' + obj.name +'</a>'; }).join('<br/>');
  extra += '</span></span>';
  
  if (mptUsersettings["enableInlinemode"]==1){
    printUrlInline(url,"American","",null,extra);
  } else {
    printUrl(url,"American","",extra);
  } 
}

function printAC(){
  var createUrl = function (edition) {
    var acUrl = 'http://www.aircanada.com/aco/flights.do?AH_IATA_NUMBER=0005118&AVAIL_EMMBEDDED_TRANSACTION=FlexPricerAvailabilityServlet'
      if (mptSettings["itaLanguage"]=="de"||mptUsersettings["language"]=="de"){
      acUrl += '&country=DE&countryOfResidence=DE&language=de&LANGUAGE=DE';
      } else {
        acUrl += '&country=' + edition + '&countryofResidence=' + edition + '&language=en&LANGUAGE=US';
      }
    acUrl += '&CREATION_MODE=30&EMBEDDED_TRANSACTION=FareServelet&FareRequest=YES&fromThirdParty=YES&HAS_INFANT_1=False&IS_PRIMARY_TRAVELLER_1=True&SITE=SAADSAAD&thirdPartyID=0005118&TRAVELER_TYPE_1=ADT&PRICING_MODE=0';
    acUrl += '&numberOfChildren=0&numberOfInfants=0&numberOfYouth=0&numberOfAdults=' + currentItin["numPax"];
    acUrl += '&tripType=' + (currentItin['itin'].length > 1 ? 'R' : 'O');
    for (var i=0; i < currentItin['itin'].length; i++) {
      if (i == 0) {
        acUrl += '&departure1='+('0'+currentItin['itin'][i]['dep']['day']).slice(-2)+'/'+('0'+currentItin['itin'][i]['dep']['month']).slice(-2)+'/'+currentItin['itin'][i]['dep']['year']+'&org1='+currentItin['itin'][i]['orig']+'&dest1='+currentItin['itin'][i]['dest'];
      }
      else if (i == 1) {
        acUrl += '&departure2='+('0'+currentItin['itin'][i]['dep']['day']).slice(-2)+'/'+('0'+currentItin['itin'][i]['dep']['month']).slice(-2)+'/'+currentItin['itin'][i]['dep']['year'];
      }
      
      for (var j=0; j < currentItin['itin'][i]['seg'].length; j++) {
        acUrl += '&AIRLINE_'      +(i+1)+'_'+(j+1)+'='+currentItin['itin'][i]['seg'][j]['carrier'];
        acUrl += '&B_DATE_'       +(i+1)+'_'+(j+1)+'='+currentItin['itin'][i]['seg'][j]['dep']['year']+('0'+currentItin['itin'][i]['seg'][j]['dep']['month']).slice(-2)+('0'+currentItin['itin'][i]['seg'][j]['dep']['day']).slice(-2)+('0'+currentItin['itin'][i]['seg'][j]['dep']['time'].replace(':','')).slice(-4);
        acUrl += '&B_LOCATION_'   +(i+1)+'_'+(j+1)+'='+currentItin['itin'][i]['seg'][j]['orig'];
        acUrl += '&E_DATE_'       +(i+1)+'_'+(j+1)+'='+currentItin['itin'][i]['seg'][j]['arr']['year']+('0'+currentItin['itin'][i]['seg'][j]['arr']['month']).slice(-2)+('0'+currentItin['itin'][i]['seg'][j]['arr']['day']).slice(-2)+('0'+currentItin['itin'][i]['seg'][j]['arr']['time'].replace(':','')).slice(-4);
        acUrl += '&E_LOCATION_'   +(i+1)+'_'+(j+1)+'='+currentItin['itin'][i]['seg'][j]['dest'];
        acUrl += '&FLIGHT_NUMBER_'+(i+1)+'_'+(j+1)+'='+currentItin['itin'][i]['seg'][j]['fnr'];
        acUrl += '&RBD_'          +(i+1)+'_'+(j+1)+'='+currentItin['itin'][i]['seg'][j]['bookingclass'];
      }
    }
    return acUrl;
  };
  
  var acUrl = createUrl(mptUsersettings["acEdition"].toUpperCase());
  
  var extra = ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += acEditions.map(function (edition, i) { return '<a href="' + createUrl(edition.toUpperCase()) + '" target="_blank">' + edition +'</a>'; }).join('<br/>');
  extra += '</span></span>';
  
  if (mptUsersettings["enableInlinemode"]==1){
    printUrlInline(acUrl,"Air Canada","",null,extra);
  } else {
    printUrl(acUrl,"Air Canada","",extra);
  }
}
function printAF() {
  var afUrl = 'https://www.airfrance.com/';
  var flights="";
  if (mptSettings["itaLanguage"]=="de"||mptUsersettings["language"]=="de"){
    afUrl += 'DE/de';
    } else {
    afUrl += 'US/en';
   }
  afUrl += '/local/process/standardbooking/DisplayUpsellAction.do?cabin=Y&calendarSearch=1&listPaxTypo=ADT&subCabin=MCHER&typeTrip=2';
  afUrl += '&nbPax=' + currentItin["numPax"];
  for (var i=0; i < currentItin['itin'].length; i++) {
    if (i == 0) {
      afUrl += '&from='+currentItin['itin'][i]['orig'];
      afUrl += '&to='+currentItin['itin'][i]['dest'];
      afUrl += '&outboundDate='+currentItin['itin'][i]['dep']['year']+'-'+('0'+currentItin['itin'][i]['dep']['month']).slice(-2)+'-'+('0'+currentItin['itin'][i]['dep']['day']).slice(-2);
      afUrl += '&firstOutboundHour='+('0'+currentItin['itin'][i]['dep']['time']).slice(-5);
      
      flights = '';
      for (var j=0; j < currentItin['itin'][i]['seg'].length; j++) {
        if (j > 0) flights += '|';
        flights += currentItin['itin'][i]['seg'][j]['carrier'] + ('000'+currentItin['itin'][i]['seg'][j]['fnr']).slice(-4);
      }
      afUrl += '&flightOutbound=' + flights;
    }
    else if (i == 1) {
      afUrl += '&inboundDate='+currentItin['itin'][i]['dep']['year']+'-'+('0'+currentItin['itin'][i]['dep']['month']).slice(-2)+'-'+('0'+currentItin['itin'][i]['dep']['day']).slice(-2);
      afUrl += '&firstInboundHour='+('0'+currentItin['itin'][i]['dep']['time']).slice(-5);
      
      flights = '';
      for (var j=0; j < currentItin['itin'][i]['seg'].length; j++) {
        if (j > 0) flights += '|';
        flights += currentItin['itin'][i]['seg'][j]['carrier'] + ('000'+currentItin['itin'][i]['seg'][j]['fnr']).slice(-4);
      }
      afUrl += '&flightInbound=' + flights;
    }
  }
  if (mptUsersettings["enableInlinemode"]==1){
    printUrlInline(afUrl,"Air France","");
  } else {
    printUrl(afUrl,"Air France","");
  }
}
function printAZ() {
  var azUrl = 'http://booking.alitalia.com/Booking/'+(mptSettings["itaLanguage"]=='de'||mptUsersettings["language"]=='de'?'de_de':'us_en')+'/Flight/ExtMetaSearch?SearchType=BrandMetasearch';
  azUrl += '&children_number=0&Children=0&newborn_number=0&Infants=0';
  azUrl += '&adult_number='+currentItin["numPax"]+'&Adults='+currentItin["numPax"];
  var seg = 0;
  for (var i=0; i < currentItin['itin'].length; i++) {
    for (var j=0; j < currentItin['itin'][i]['seg'].length; j++) {
      azUrl += '&MetaSearchDestinations['+seg+'].From='         +currentItin['itin'][i]['seg'][j]['orig'];
      azUrl += '&MetaSearchDestinations['+seg+'].to='           +currentItin['itin'][i]['seg'][j]['dest'];
      azUrl += '&MetaSearchDestinations['+seg+'].DepartureDate='+currentItin['itin'][i]['seg'][j]['dep']['year']+'-'+('0'+currentItin['itin'][i]['seg'][j]['dep']['month']).slice(-2)+'-'+('0'+currentItin['itin'][i]['seg'][j]['dep']['day']).slice(-2);
      azUrl += '&MetaSearchDestinations['+seg+'].Flight='       +currentItin['itin'][i]['seg'][j]['fnr']
      azUrl += '&MetaSearchDestinations['+seg+'].code='         +currentItin['itin'][i]['seg'][j]['farebase'];
      azUrl += '&MetaSearchDestinations['+seg+'].slices='       +i;
      seg++;
    }
  }
  
  if (mptUsersettings["enableInlinemode"]==1){
   printUrlInline(azUrl,"Alitalia","");
  } else {
   printUrl(azUrl,"Alitalia","");
  } 
}
function getDeltaCabin(cabin){
// 0 = Economy; 1=Premium Economy; 2=Business; 3=First
// // B5-Coach / B2-Business on DL
  switch(cabin) {
      case 2:
          cabin="B2-Business";
          break;
      case 3:
          cabin="B2-Business";
          break;
      default:
          cabin="B5-Coach";
  }
  return cabin;
}
function printDelta(){
// Steppo: Cabincodefunction needs some care!?
// Steppo: What about farebasis?
// Steppo: What about segmentskipping?
    var deltaURL ="http://"+(mptSettings["itaLanguage"]=="de" || mptUsersettings["language"]=="de" ? "de" : "www");
    deltaURL +=".delta.com/booking/priceItin.do?dispatchMethod=priceItin&tripType=multiCity&cabin=B5-Coach";
    deltaURL +="&currencyCd=" + (currentItin["cur"]=="EUR" ? "EUR" : "USD") + "&exitCountry="+(mptSettings["itaLanguage"]=="de" || mptUsersettings["language"]=="de" ? "US" : "US");
    var segcounter=0;
    for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
         //walks each segment of leg
        deltaURL +="&itinSegment["+segcounter.toString()+"]="+i.toString()+":"+currentItin["itin"][i]["seg"][j]["bookingclass"];
        deltaURL +=":"+currentItin["itin"][i]["seg"][j]["orig"]+":"+currentItin["itin"][i]["seg"][j]["dest"]+":"+currentItin["itin"][i]["seg"][j]["carrier"]+":"+currentItin["itin"][i]["seg"][j]["fnr"];
        deltaURL +=":"+monthnumberToName(currentItin["itin"][i]["seg"][j]["dep"]["month"])+":"+ ( currentItin["itin"][i]["seg"][j]["dep"]["day"] < 10 ? "0":"") +currentItin["itin"][i]["seg"][j]["dep"]["day"]+":"+currentItin["itin"][i]["seg"][j]["dep"]["year"]+":0";
        segcounter++; 
      }
    }
    deltaURL += "&fareBasis="+currentItin["farebases"].toString().replace(/,/g, ":");
    deltaURL += "&price=0";
    deltaURL += "&numOfSegments=" + segcounter.toString() + "&paxCount=" + currentItin["numPax"];
    deltaURL += "&vendorRedirectFlag=true&vendorID=Google";      
    if (mptUsersettings["enableInlinemode"]==1){
     printUrlInline(deltaURL,"Delta","");
    } else {
     printUrl(deltaURL,"Delta","");
    }    
}
function printKL() {
  var klUrl = 'https://www.klm.com/travel/';
   if (mptSettings["itaLanguage"]=="de"||mptUsersettings["language"]=="de"){
    klUrl += 'de_de/apps/ebt/ebt_home.htm?lang=DE';
    } else {
    klUrl += 'us_en/apps/ebt/ebt_home.htm?lang=EN';
    }
  klUrl += '&chdQty=0&infQty=0&dev=5&cffcc=ECONOMY';
  var fb = '';
  var oper = '';
  klUrl += '&adtQty=' + currentItin["numPax"];
  for (var i=0; i < currentItin['itin'].length; i++) {
    klUrl += '&c['+i+'].os='+currentItin['itin'][i]['orig'];
    klUrl += '&c['+i+'].ds='+currentItin['itin'][i]['dest'];
    klUrl += '&c['+i+'].dd='+currentItin['itin'][i]['dep']['year']+'-'+('0'+currentItin['itin'][i]['dep']['month']).slice(-2)+'-'+('0'+currentItin['itin'][i]['dep']['day']).slice(-2);   
    if (i > 0) oper += '..';
    for (var j=0; j < currentItin['itin'][i]['seg'].length; j++) {
      klUrl += '&c['+i+'].s['+j+'].os='+currentItin['itin'][i]['seg'][j]['orig'];
      klUrl += '&c['+i+'].s['+j+'].ds='+currentItin['itin'][i]['seg'][j]['dest'];
      klUrl += '&c['+i+'].s['+j+'].dd='+currentItin['itin'][i]['seg'][j]['dep']['year']+'-'+('0'+currentItin['itin'][i]['seg'][j]['dep']['month']).slice(-2)+'-'+('0'+currentItin['itin'][i]['seg'][j]['dep']['day']).slice(-2);
      klUrl += '&c['+i+'].s['+j+'].dt='+('0'+currentItin['itin'][i]['seg'][j]['dep']['time'].replace(':','')).slice(-4);
      klUrl += '&c['+i+'].s['+j+'].mc='+currentItin['itin'][i]['seg'][j]['carrier'];
      klUrl += '&c['+i+'].s['+j+'].fn='+('000'+currentItin['itin'][i]['seg'][j]['fnr']).slice(-4);
      
      if (j > 0) oper += '.';
      oper += currentItin['itin'][i]['seg'][j]['carrier'];
    }
  }
  
  for (var i=0; i < currentItin['farebases'].length; i++) {
    if (i > 0) fb += ',';
    fb += currentItin['farebases'][i];
  }
  
  klUrl += '&ref=fb='+fb;//+',oper='+oper;
    if (mptUsersettings["enableInlinemode"]==1){
     printUrlInline(klUrl,"KLM","");
    } else {
     printUrl(klUrl,"KLM","");
    } 
}
function getUACabin(cabin){
// 0 = Economy; 1=Premium Economy; 2=Business; 3=First
// Coach - Coach / Business - Business / First - First on UA
  switch(cabin) {
      case 2:
          cabin="Business";
          break;
      case 3:
          cabin="First";
          break;
      default:
          cabin="Coach";
  }
  return cabin;
}
function printUA(){
var uaUrl='{\"post\": {\"pax\": '+currentItin["numPax"];
uaUrl += ', \"trips\": [';
    for (var i=0;i<currentItin["itin"].length;i++) {
      var minCabin=3;
      uaUrl += '{\"origin\": \"'+currentItin["itin"][i]["orig"]+'\", \"dest\": \"'+currentItin["itin"][i]["dest"]+'\", \"dep_date\": \"'+currentItin["itin"][i]["dep"]["month"]+'/'+currentItin["itin"][i]["dep"]["day"]+'/'+currentItin["itin"][i]["dep"]["year"]+'\", \"segments\": [';
      // walks each leg
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
         //walks each segment of leg
          var k = 0;
         // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
          while ((j+k)<currentItin["itin"][i]["seg"].length-1){
          if (currentItin["itin"][i]["seg"][j+k]["fnr"] != currentItin["itin"][i]["seg"][j+k+1]["fnr"] || 
                   currentItin["itin"][i]["seg"][j+k]["layoverduration"] >= 1440) break;
                 k++;
          }
          uaUrl += '{\"origin\": \"'+currentItin["itin"][i]["seg"][j]["orig"]+'\", \"dep_date\": \"'+ currentItin["itin"][i]["seg"][j]["dep"]["month"].toString() +'/'+ currentItin["itin"][i]["seg"][j]["dep"]["day"].toString() +'/'+currentItin["itin"][i]["seg"][j]["dep"]["year"].toString() +'\", \"dest_date\": \" \", \"dest\": \"'+currentItin["itin"][i]["seg"][j+k]["dest"]+'\", ';
          uaUrl += '\"flight_num\": '+currentItin["itin"][i]["seg"][j]["fnr"]+', \"carrier\": \"'+currentItin["itin"][i]["seg"][j]["carrier"]+'\", \"fare_code\": \"'+currentItin["itin"][i]["seg"][j]["farebase"]+'\"},';         
          if (currentItin["itin"][i]["seg"][j]["cabin"] < minCabin) {minCabin=currentItin["itin"][i]["seg"][j]["cabin"];};
          j+=k; 
      }
      uaUrl = uaUrl.substring(0,uaUrl.length-1)+'],\"cabin\": \"'+getUACabin(minCabin)+'\"},';
    }
    uaUrl = 'https://www.hipmunk.com/bookjs?booking_info=' + encodeURIComponent(uaUrl.substring(0,uaUrl.length-1) +']}, \"kind\": \"flight\", \"provider_code\": \"UA\" }');
        if (mptUsersettings["language"]=="de"){
        desc="Kopiere den Link bei Hipmunk";
      } else {
        desc="Copy Link in Text, via Hipmunk";
      }     
    if (mptUsersettings["enableInlinemode"]==1){
      printUrlInline(uaUrl,"United",desc);
    } else {
      printUrl(uaUrl,"United",desc);
    }
}
function getUSCabin(cabin){
  // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
  switch(cabin) {
      case 2:
          cabin="B";
          break;
      case 3:
          cabin="F";
          break;
      default:
          cabin="C";
  }
  return cabin;
}
function printUS(){
// Steppo: is class of service implemented correct?
// Steppo: legskipping necessary?
    var usUrl = "https://shopping.usairways.com/Flights/Passenger.aspx?g=goo&c=goog_US_pax";
    usUrl += "&a=" + currentItin["numPax"];
    usUrl += "&s=" + getUSCabin(currentItin["itin"][0]["seg"][0]["cabin"]).toLowerCase();
    for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
         //walks each segment of leg
        var segstr = (i+1).toString()+(j+1).toString();
        usUrl += "&o"+segstr+"=" + currentItin["itin"][i]["seg"][j]["orig"] + "&d"+segstr+"=" + currentItin["itin"][i]["seg"][j]["dest"] + "&f"+segstr+"=" + currentItin["itin"][i]["seg"][j]["fnr"];
        usUrl += "&t"+segstr+"=" + currentItin["itin"][i]["seg"][j]["dep"]["year"] + (currentItin["itin"][i]["seg"][j]["dep"]["month"] < 10 ? "0":"" )+ currentItin["itin"][i]["seg"][j]["dep"]["month"] +(currentItin["itin"][i]["seg"][j]["dep"]["day"] < 10 ? "0":"" ) + currentItin["itin"][i]["seg"][j]["dep"]["day"] + "0000";
        usUrl += "&x"+segstr+"=" + currentItin["itin"][i]["seg"][j]["farebase"];
      }
    }   
    if (mptUsersettings["enableInlinemode"]==1){
      printUrlInline(usUrl,"US Airways","");
    } else {
      printUrl(usUrl,"US Airways","");
    }
}

function printCheapOair(){
  // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
  var cabins = ['Economy', 'PREMIUMECONOMY', 'Business', 'First'];
  var coaUrl = 'http://www.cheapoair.com/default.aspx?tabid=1832&ch=0&sr=0&is=0&il=0&ulang=en';
  coaUrl += '&ad=' + currentItin.numPax;
  var seg = 0;
  var slices = {};
  for (var i=0; i < currentItin.itin.length; i++) {
    slices[i] = '';
    for (var j=0; j < currentItin.itin[i].seg.length; j++) {
      seg++;
      if (slices[i]) slices[i] += ',';
      slices[i] += seg;
      
      coaUrl += '&cbn'        +seg+'='+cabins[currentItin.itin[i].seg[j].cabin];
      coaUrl += '&carr'      +seg+'='+currentItin.itin[i].seg[j].carrier;
      coaUrl += '&dd'+seg+'='+currentItin.itin[i].seg[j].dep.year+('0'+currentItin.itin[i].seg[j].dep.month).slice(-2)+('0'+currentItin.itin[i].seg[j].dep.day).slice(-2);
      coaUrl += '&og'       +seg+'='+currentItin.itin[i].seg[j].orig;
      coaUrl += '&dt'  +seg+'='+currentItin.itin[i].seg[j].dest;
      coaUrl += '&fbc'  +seg+'='+currentItin.itin[i].seg[j].bookingclass;
      coaUrl += '&fnum' +seg+'='+currentItin.itin[i].seg[j].fnr;
    }
    
    coaUrl += '&Slice'+(i+1)+'='+slices[i];
  }
  
  if (currentItin.itin.length == 1) {
    coaUrl += '&tt=OneWay';
  }
  else if (currentItin.itin.length == 2 && currentItin.itin[0].orig == currentItin.itin[1].dest && currentItin.itin[0].dest == currentItin.itin[1].orig) {
    coaUrl += '&tt=RoundTrip';
  }
  else {
    coaUrl += '&tt=MultiCity';
  }
  
  if (mptUsersettings["enableInlinemode"]==1){
    printUrlInline(coaUrl,"CheapOair","");
  } else {
    printUrl(coaUrl,"CheapOair","");
  }
}

function getHipmunkCabin(cabin){
  // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
  switch(cabin) {
      case 2:
          cabin="Business";
          break;
      case 3:
          cabin="First";
          break;
      default:
          cabin="Coach";
  }
  return cabin;
}
function printHipmunk(){
    var url = "https://www.hipmunk.com/search/flights?";
    var mincabin=3;
    //Build multi-city search based on legs
    for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
            url += "&from"+i+"=" + currentItin["itin"][i]["orig"];            
            for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
           //walks each segment of leg
                var k=0;
                // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
                while ((j+k)<currentItin["itin"][i]["seg"].length-1){
                 if (currentItin["itin"][i]["seg"][j+k]["fnr"] != currentItin["itin"][i]["seg"][j+k+1]["fnr"] || 
                     currentItin["itin"][i]["seg"][j+k]["layoverduration"] >= 1440) break;
                 k++;
                }               
                url += ( j>0 ? "%20"+currentItin["itin"][i]["seg"][j]["orig"]+"%20":"%3A%3A")+currentItin["itin"][i]["seg"][j]["carrier"] + currentItin["itin"][i]["seg"][j]["fnr"];
                if (currentItin["itin"][i]["seg"][j]["cabin"]<mincabin){mincabin=currentItin["itin"][i]["seg"][j]["cabin"];};  
                j+=k;
      }
      url += "&date"+i+"="+currentItin["itin"][i]["dep"]["year"]+"-"+( Number(currentItin["itin"][i]["dep"]["month"]) <= 9 ? "0":"") +currentItin["itin"][i]["dep"]["month"].toString()+"-"+ ( Number(currentItin["itin"][i]["dep"]["day"]) <= 9 ? "0":"") +currentItin["itin"][i]["dep"]["day"].toString();  
      url += "&to"+i+"="+currentItin["itin"][i]["dest"];
    }  
    url += "&pax=" + currentItin["numPax"]+"&cabin="+getHipmunkCabin(mincabin)+"&infant_lap=0&infant_seat=0&seniors=0&children=0";    
    if (mptUsersettings["enableInlinemode"]==1){
      printUrlInline(url,"Hipmunk","");
    } else {
      printUrl(url,"Hipmunk","");
    } 
}
function printOrbitz(){
  // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
  var cabins = ['C', 'E', 'B', 'F'];
  
  var ebookerEditions = [{name:"ebookers.de",host:"www.ebookers.de",dateFormat:"dd.MM.yyyy"},{name:"ebookers.at",host:"www.ebookers.at",dateFormat:"dd.MM.yyyy"},{name:"ebookers.fi",host:"www.ebookers.fi",dateFormat:"dd.MM.yyyy"},{name:"ebookers.com",host:"www.ebookers.com",dateFormat:"dd/MM/yyyy"},{name:"ebookers.be",host:"www.ebookers.be",dateFormat:"dd/MM/yyyy"},{name:"ebookers.fr",host:"www.ebookers.fr",dateFormat:"dd/MM/yyyy"},{name:"ebookers.ie",host:"www.ebookers.ie",dateFormat:"dd/MM/yyyy"},{name:"ebookers.ch",host:"www.ebookers.ch",dateFormat:"dd/MM/yyyy"},{name:"ebookers.nl",host:"www.ebookers.nl",dateFormat:"dd-MM-yy"},{name:"ebookers.no",host:"www.ebookers.no",dateFormat:"dd.MM.yyyy"},{name:"mrjet.se",host:"www.mrjet.se",dateFormat:"yyyy-MM-dd"},{name:"mrjet.dk",host:"www.mrjet.dk",dateFormat:"dd-MM-yyyy"}];
  
  var formatDate = function (value, dateFormat) {
    return dateFormat
            .replace('dd', value.day)
            .replace('MM', value.month)
            .replace('yyyy', value.year)
            .replace('yy', value.year%100);
  };
  
  var createUrl = function (host, dateFormat) {
    var selectKey = "";
    var url = "http://" + host + "/shop/home?type=air&source=GOOGLE_META&searchHost=ITA&ar.type=multiCity&strm=true";
    url += "&ar.mc.numAdult=" + currentItin["numPax"];
    url += "&ar.mc.numSenior=0&ar.mc.numChild=0&ar.mc.child[0]=&ar.mc.child[1]=&ar.mc.child[2]=&ar.mc.child[3]=&ar.mc.child[4]=&ar.mc.child[5]=&ar.mc.child[6]=&ar.mc.child[7]=&search=Search Flights&ar.mc.nonStop=true&_ar.mc.nonStop=0";
    
    //Build multi-city search based on legs  
    for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
      url += "&ar.mc.slc["+i+"].orig.key=" + currentItin["itin"][i]["orig"];
      url += "&_ar.mc.slc["+i+"].originRadius=0";
      url += "&ar.mc.slc["+i+"].dest.key=" + currentItin["itin"][i]["dest"];
      url += "&_ar.mc.slc["+i+"].destinationRadius=0";
      url += "&ar.mc.slc["+i+"].date=" + formatDate(currentItin["itin"][i]["dep"], dateFormat);
      url += "&ar.mc.slc["+i+"].time=Anytime";
      
      for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
        //walks each segment of leg
        var k=0;
        // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
        while ((j+k)<currentItin["itin"][i]["seg"].length-1) {
          if (currentItin["itin"][i]["seg"][j+k]["fnr"] != currentItin["itin"][i]["seg"][j+k+1]["fnr"] || 
              currentItin["itin"][i]["seg"][j+k]["layoverduration"] >= 1440) break;
          k++;
        }               
        selectKey += currentItin["itin"][i]["seg"][j]["carrier"] + currentItin["itin"][i]["seg"][j]["fnr"] + currentItin["itin"][i]["seg"][j]["orig"] + currentItin["itin"][i]["seg"][j+k]["dest"] + ( currentItin["itin"][i]["seg"][j]["dep"]["month"] < 10 ? "0":"") + currentItin["itin"][i]["seg"][j]["dep"]["month"] +  ( currentItin["itin"][i]["seg"][j]["dep"]["day"] < 10 ? "0":"") + currentItin["itin"][i]["seg"][j]["dep"]["day"] + cabins[currentItin["itin"][i]["seg"][j]["cabin"]];
        selectKey += "_";                      
        j+=k;
      }
    }
    
    //lets see if we can narrow the carriers  Orbitz supports up to 3
    if (currentItin["carriers"].length <= 3) {
      url += "&_ar.mc.narrowSel=1&ar.mc.narrow=airlines";
      for (var i = 0; i< 3;i++){
          if (i<currentItin["carriers"].length){
          url += "&ar.mc.carriers["+i+"]="+currentItin["carriers"][i];
          } else {
          url += "&ar.mc.carriers["+i+"]=";
          }       
      }
    } else {
      url += "&_ar.mc.narrowSel=0&ar.mc.narrow=airlines&ar.mc.carriers[0]=&ar.mc.carriers[1]=&ar.mc.carriers[2]=";
    }
    
    url += "&ar.mc.cabin=C";
    url += "&selectKey=" + selectKey.substring(0,selectKey.length-1);
      
    return url;
  };
  
  var orbitzUrl = createUrl("www.orbitz.com", "MM/dd/yy");
  var cheapticketsUrl = createUrl("www.cheaptickets.com", "MM/dd/yy");
  var ebookersUrl = createUrl("www.ebookers.com", "dd/MM/yy");
  
  var ebookersExtra = ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  ebookersExtra += ebookerEditions.map(function (obj, i) { return '<a href="' + createUrl(obj.host, obj.dateFormat) + '" target="_blank">' + obj.name +'</a>'; }).join('<br/>');
  ebookersExtra += '</span></span>';
  
  if (mptUsersettings["enableInlinemode"]==1){
    printUrlInline(cheapticketsUrl,"Cheaptickets","");
    printUrlInline(ebookersUrl,"Ebookers","",null,ebookersExtra);
    printUrlInline(orbitzUrl,"Orbitz","");
  } else {
    printUrl(cheapticketsUrl,"Cheaptickets","");
    printUrl(ebookersUrl,"Ebookers","",ebookersExtra);
    printUrl(orbitzUrl,"Orbitz","");
  }
}
function printPriceline(){
    var url = "https://www.priceline.com/airlines/landingServlet?userAction=search";
    var pricelineurl="&TripType=MD&ProductID=1";
    // outer params
    pricelineurl+="&DepCity="+currentItin["itin"][0]["orig"];
    pricelineurl+="&ArrCity="+currentItin["itin"][0]["dest"];
    pricelineurl+="&DepartureDate="+(Number(currentItin["itin"][0]["dep"]["month"]) <= 9 ? "0":"") +currentItin["itin"][0]["dep"]["month"].toString()+"/"+(Number(currentItin["itin"][0]["dep"]["day"]) <= 9 ? "0":"") +currentItin["itin"][0]["dep"]["day"].toString()+"/"+currentItin["itin"][0]["dep"]["year"].toString();
    var legsize=1;
    var segsize=1;
    var searchparam="<externalSearch>";
    for (var i=0;i<currentItin["itin"].length;i++) {
      // walks each leg
      pricelineurl+="&MDCity_"+legsize.toString()+"="+currentItin["itin"][i]["orig"];
      pricelineurl+="&DepDateMD"+legsize.toString()+"="+(Number(currentItin["itin"][i]["dep"]["month"]) <= 9 ? "0":"") +currentItin["itin"][i]["dep"]["month"].toString()+"/"+(Number(currentItin["itin"][i]["dep"]["day"]) <= 9 ? "0":"") +currentItin["itin"][i]["dep"]["day"].toString()+"/"+currentItin["itin"][i]["dep"]["year"].toString();
      legsize++;
      pricelineurl+="&MDCity_"+legsize.toString()+"="+currentItin["itin"][i]["dest"];
      pricelineurl+="&DepDateMD"+legsize.toString()+"="+(Number(currentItin["itin"][i]["arr"]["month"]) <= 9 ? "0":"") +currentItin["itin"][i]["arr"]["month"].toString()+"/"+(Number(currentItin["itin"][i]["arr"]["day"]) <= 9 ? "0":"") +currentItin["itin"][i]["arr"]["day"].toString()+"/"+currentItin["itin"][i]["arr"]["year"].toString();
      legsize++;
      searchparam+="<slice>";    
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
         searchparam+="<segment>";  
                //walks each segment of leg
                var k=0;
                // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
                while ((j+k)<currentItin["itin"][i]["seg"].length-1){
                if (currentItin["itin"][i]["seg"][j+k]["fnr"] != currentItin["itin"][i]["seg"][j+k+1]["fnr"] || 
                         currentItin["itin"][i]["seg"][j+k]["layoverduration"] >= 1440) break;
                       k++;
                }
                searchparam+="<number>"+segsize.toString()+"</number>";
                searchparam+="<departDateTime>"+(Number(currentItin["itin"][i]["seg"][j]["dep"]["month"]) <= 9 ? "0":"") +currentItin["itin"][i]["seg"][j]["dep"]["month"].toString()+"/"+(Number(currentItin["itin"][i]["seg"][j]["dep"]["day"]) <= 9 ? "0":"") +currentItin["itin"][i]["seg"][j]["dep"]["day"].toString()+"/"+currentItin["itin"][i]["seg"][j]["dep"]["year"].toString()+" "+currentItin["itin"][i]["seg"][j]["dep"]["time"]+":00</departDateTime>";
                searchparam+="<arrivalDateTime>"+(Number(currentItin["itin"][i]["seg"][j+k]["arr"]["month"]) <= 9 ? "0":"") +currentItin["itin"][i]["seg"][j+k]["arr"]["month"].toString()+"/"+(Number(currentItin["itin"][i]["seg"][j+k]["arr"]["day"]) <= 9 ? "0":"") +currentItin["itin"][i]["seg"][j+k]["arr"]["day"].toString()+"/"+currentItin["itin"][i]["seg"][j+k]["arr"]["year"].toString()+" "+currentItin["itin"][i]["seg"][j+k]["arr"]["time"]+":00</arrivalDateTime>";
                searchparam+="<origAirportCode>"+currentItin["itin"][i]["seg"][j]["orig"]+"</origAirportCode>";
                searchparam+="<destAirportCode>"+currentItin["itin"][i]["seg"][j+k]["dest"]+"</destAirportCode>";
                searchparam+="<carrierCode>"+currentItin["itin"][i]["seg"][j]["carrier"]+"</carrierCode>";
                searchparam+="<flightNumber>"+currentItin["itin"][i]["seg"][j]["fnr"]+"</flightNumber>";
                searchparam+="<equipmentCode></equipmentCode>";
                searchparam+="<bookingClass>"+currentItin["itin"][i]["seg"][j]["bookingclass"]+"</bookingClass>";         
                segsize++;
                j+=k;
         searchparam+="</segment>";
      }
      searchparam+="</slice>";
    }
   searchparam+="<numberOfTickets>"+currentItin["numPax"]+"</numberOfTickets><cost><totalFare>0.00</totalFare><baseFare>0.00</baseFare><tax>0.00</tax><fee>0.00</fee></cost>";
   searchparam+="</externalSearch>";
   pricelineurl+="&NumTickets="+currentItin["numPax"]+"&AirAffiliateSearch=";
   if (mptUsersettings["enableInlinemode"]==1){
      printUrlInline(url+pricelineurl+encodeURIComponent(searchparam),"Priceline","");
    } else {
      printUrl(url+pricelineurl+encodeURIComponent(searchparam),"Priceline","");
    }
}

function printEtraveli () {
  if (currentItin.itin.length > 2) return; // no multi segments
  if (currentItin.itin.length == 2 && !(currentItin.itin[0].orig == currentItin.itin[1].dest && currentItin.itin[0].dest == currentItin.itin[1].orig)) return; // no open jaws
  
  var editions = [{name:"Seat24.se",host:"www.seat24.se"},{name:"Seat24.de",host:"www.seat24.de"},{name:"Seat24.dk",host:"www.seat24.dk"},{name:"Seat24.fi",host:"www.seat24.fi"},{name:"Seat24.no",host:"www.seat24.no"},{name:"Flygvaruhuset.se",host:"www.flygvaruhuset.se"},{name:"Travelpartner.se",host:"www.travelpartner.se"},{name:"Travelpartner.fi",host:"www.travelpartner.fi"},{name:"Travelpartner.no",host:"www.travelpartner.no"},{name:"Budjet.se",host:"www.budjet.se"},{name:"Budjet.fi",host:"www.budjet.fi"},{name:"Budjet.no",host:"www.budjet.no"},{name:"Budjet.dk",host:"www.budjet.dk"},{name:"Goleif.dk",host:"www.goleif.dk"},{name:"Travelfinder.se",host:"www.travelfinder.se"},{name:"Gotogate.no",host:"www.gotogate.no"},{name:"Gotogate.at",host:"www.gotogate.at"},{name:"Gotogate.be",host:"be.gotogate.com"},{name:"Gotogate.bg",host:"bg.gotogate.com"},{name:"Gotogate.ch",host:"www.gotogate.ch"},{name:"Gotogate.cz",host:"cz.gotogate.com"},{name:"Gotogate.es",host:"www.gotogate.es"},{name:"Gotogate.fr",host:"www.gotogate.fr"},{name:"Gotogate.gr",host:"www.gotogate.gr"},{name:"Gotogate.hu",host:"hu.gotogate.com"},{name:"Gotogate.ie",host:"ie.gotogate.com"},{name:"Gotogate.it",host:"www.gotogate.it"},{name:"Gotogate.pl",host:"www.gotogate.pl"},{name:"Gotogate.pt",host:"www.gotogate.pt"},{name:"Gotogate.ro",host:"ro.gotogate.com"},{name:"Gotogate.sk",host:"www.gotogate.sk"},{name:"Gotogate.tr",host:"tr.gotogate.com"},{name:"Gotogate.com.ua",host:"www.gotogate.com.ua"},{name:"Gotogate.co.uk",host:"www.gotogate.co.uk"},{name:"Flybillet.dk",host:"www.flybillet.dk"},{name:"Travelstart.se",host:"www.travelstart.se"},{name:"Travelstart.de",host:"www.travelstart.de"},{name:"Travelstart.dk",host:"www.travelstart.dk"},{name:"Travelstart.fi",host:"www.travelstart.fi"},{name:"Travelstart.no",host:"www.travelstart.no"},{name:"Supersaver.se",host:"www.supersavertravel.se"},{name:"Supersaver.dk",host:"www.supersaver.dk"},{name:"Supersaver.fi",host:"www.supersaver.fi"},{name:"Supersaver.nl",host:"www.supersaver.nl"},{name:"Supersaver.no",host:"www.supersaver.no"},{name:"Supersaver.ru",host:"www.supersaver.ru"}];
  
  var convertDate = function (date, withYear) {
    return ('0'+date.day).slice(-2) + monthnumberToName(date.month) + (withYear ? date.year.toString().slice(-2) : '');
  };
  
  var createUrl = function (host) {
    var ggUrl = 'http://' + host + '/air/';
    
    ggUrl += currentItin.itin[0].orig + currentItin.itin[0].dest + convertDate(currentItin.itin[0].dep, false);
    
    if (currentItin.itin.length > 1) ggUrl += convertDate(currentItin.itin[1].dep, false);
    
    ggUrl += '/' + currentItin.numPax;
    ggUrl += '?selectionKey=' + currentItin.itin.map(function (itin) { 
      return itin.seg.map(function (seg) { return seg.carrier + seg.fnr + '-' + convertDate(seg.dep, true) + '-' + seg.bookingclass; }).join('_');
    }).join('_');
    
    return ggUrl;
  };
  
  // picked seat24 as main one, but could be any of them
  var ggUrl = createUrl('www.seat24.de');
  
  var extra = ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += editions.map(function (obj, i) { return '<a href="' + createUrl(obj.host) + '" target="_blank">' + obj.name +'</a>'; }).join('<br/>');
  extra += '</span></span>';
  
  if (mptUsersettings["enableInlinemode"]==1){
    printUrlInline(ggUrl,'Seat24.de',"",null,extra);
  } else {
    printUrl(ggUrl,'Seat24.de',"",extra);
  }
}

function printFarefreaks (method){
// Should be fine
// method: 0 = based on leg; 1 = based on segment
    var carrieruarray = new Array();
    var mincabin=3;
    var segsize=0;  
    var farefreaksurl = "https://www.farefreaks.com/landing/landing.php?";
    if (mptSettings["itaLanguage"]=="de"||mptUsersettings["language"]=="de"){
    farefreaksurl +="lang=de";
    } else {
    farefreaksurl +="lang=en";
    }
    farefreaksurl += "&target=flightsearch&referrer=matrix";
    for (var i=0;i<currentItin["itin"].length;i++) {
        if (method!=1){
          farefreaksurl += "&orig["+segsize+"]=" + currentItin["itin"][i]["orig"];
          farefreaksurl += "&dest["+segsize+"]=" + currentItin["itin"][i]["dest"];
          farefreaksurl += "&date["+segsize+"]="+currentItin["itin"][i]["dep"]["year"].toString() + "-" + currentItin["itin"][i]["dep"]["month"] + "-" + currentItin["itin"][i]["dep"]["day"] + "_"+currentItin["itin"][i]["dep"]["time"]+":00";
          farefreaksurl += "&validtime["+segsize+"]=1";
          segsize++; 
        } 
       for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
        if (method==1){
          var k=0;
          // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
          while ((j+k)<currentItin["itin"][i]["seg"].length-1){
          if (currentItin["itin"][i]["seg"][j+k]["fnr"] != currentItin["itin"][i]["seg"][j+k+1]["fnr"] || 
                   currentItin["itin"][i]["seg"][j+k]["layoverduration"] >= 1440) break;
                 k++;
          }
          farefreaksurl += "&orig["+segsize+"]=" + currentItin["itin"][i]["seg"][j]["orig"];
          farefreaksurl += "&dest["+segsize+"]=" + currentItin["itin"][i]["seg"][j+k]["dest"];
          farefreaksurl += "&date["+segsize+"]="+currentItin["itin"][i]["seg"][j]["dep"]["year"].toString() + "-" + currentItin["itin"][i]["seg"][j]["dep"]["month"] + "-" + currentItin["itin"][i]["seg"][j]["dep"]["day"] + "_"+currentItin["itin"][i]["seg"][j]["dep"]["time"]+":00";
          farefreaksurl += "&validtime["+segsize+"]=1";
          segsize++;
          j+=k;  
        }         
        if (currentItin["itin"][i]["seg"][j]["cabin"]<mincabin){mincabin=currentItin["itin"][i]["seg"][j]["cabin"];};  
        if (!inArray(currentItin["itin"][i]["seg"][j]["carrier"],carrieruarray)){carrieruarray.push(currentItin["itin"][i]["seg"][j]["carrier"]);};  
      }
    }
    farefreaksurl += "&adult="+currentItin["numPax"];  
    farefreaksurl += "&cabin="+mincabin;  
    farefreaksurl += "&child=0&childage[]=&flexible=0";
    if (method==1){  
      farefreaksurl += "&nonstop=1";
      if (mptUsersettings["language"]=="de"){
        desc="Benutze "+segsize+" Segment(e)";
      } else {
        desc="Based on "+segsize+" segment(s)";
      }
      
    } else {
      if (segsize==1) {
        return false;
      }
      farefreaksurl += "&nonstop=0";  
      if (mptUsersettings["language"]=="de"){
        desc="Benutze "+segsize+" Abschnitt(e)";
      } else {
        desc="Based on "+segsize+" segment(s)";
      }
    }
    if (carrieruarray.length <= 3) {farefreaksurl += "&carrier="+ carrieruarray.toString();}
    
    if (mptUsersettings["enableInlinemode"]==1 && segsize<=6){
      printUrlInline(farefreaksurl,"Farefreaks",desc);
    } else if (segsize<=6) {
      printUrl(farefreaksurl,"Farefreaks",desc);
    }    
}

function printGCM (){
    var url = '';
    // Build multi-city search based on segments
    // Keeping continous path as long as possible 
    for (var i=0;i<currentItin["itin"].length;i++) {
      for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
        url+=currentItin["itin"][i]["seg"][j]["orig"]+"-";
        if (j+1<currentItin["itin"][i]["seg"].length){
          if (currentItin["itin"][i]["seg"][j]["dest"] != currentItin["itin"][i]["seg"][(j+1)]["orig"]){url+=currentItin["itin"][i]["seg"][j]["dest"]+";";};
        } else {
         url+=currentItin["itin"][i]["seg"][j]["dest"]+";";
        }    
      }
    }
  if (mptUsersettings["enableInlinemode"]==1){
      printImageInline('http://www.gcmap.com/map?MR=900&MX=182x182&PM=*&P='+url, 'http://www.gcmap.com/mapui?P='+url);
  } else {
      printUrl("http://www.gcmap.com/mapui?P="+url,"GCM","");
  }
}
function bindSeatguru(){
  for (var i=0;i<currentItin["itin"].length;i++) {
  // walks each leg      
    for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
       //walks each segment of leg
             var k=0;
             // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
             while ((j+k)<currentItin["itin"][i]["seg"].length-1){
                 if (currentItin["itin"][i]["seg"][j+k]["fnr"] != currentItin["itin"][i]["seg"][j+k+1]["fnr"] || 
                     currentItin["itin"][i]["seg"][j+k]["layoverduration"] >= 1440) break;
                 k++;
                }  
         // build the search to identify flight:
          var target = findItinTarget((i+1),(j+1),"plane");
          if (target===false) {
            printNotification("Error: Could not find target in bindSeatguru");
            return false;
          } else {
            var url='http://www.seatguru.com/findseatmap/findseatmap.php?carrier='+currentItin['itin'][i]['seg'][j]['carrier']+'&flightno='+currentItin['itin'][i]['seg'][j]['fnr']+'&date='+('0'+currentItin['itin'][i]['seg'][j]['dep']['month']).slice(-2)+'%2F'+('0'+currentItin['itin'][i]['seg'][j]['dep']['day']).slice(-2)+'%2F'+currentItin['itin'][i]['seg'][j]['dep']['year']+'&from_loc='+currentItin['itin'][i]['seg'][j]['orig'];
            target.children[0].innerHTML='<a href="'+url+'" target="_blank" style="text-decoration:none;color:black">'+target.children[0].innerHTML+"</a>";
          }
        j+=k;
      }
   }  
}
function bindPlanefinder(){
  for (var i=0;i<currentItin["itin"].length;i++) {
  // walks each leg      
    for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
       //walks each segment of leg
             var k=0;
             // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
             while ((j+k)<currentItin["itin"][i]["seg"].length-1){
                 if (currentItin["itin"][i]["seg"][j+k]["fnr"] != currentItin["itin"][i]["seg"][j+k+1]["fnr"] || 
                     currentItin["itin"][i]["seg"][j+k]["layoverduration"] >= 1440) break;
                 k++;
                }  
         // build the search to identify flight:
          var target = findItinTarget((i+1),(j+1),"flight");
          if (target===false) {
            printNotification("Error: Could not find target in bindPlanefinder");
            return false;
          } else {
            var url='http://www.planefinder.net/data/flight/'+currentItin['itin'][i]['seg'][j]['carrier']+currentItin['itin'][i]['seg'][j]['fnr'];
            target.children[0].innerHTML='<a href="'+url+'" target="_blank" style="text-decoration:none;color:black">'+target.children[0].innerHTML+"</a>";
          }
        j+=k;
      }
   }  
}

function openWheretocredit(link) {
  var container = document.getElementById('wheretocredit-container');
  container.style.display = 'inline';
  
  var segments = [];
  for (var i = 0; i < currentItin.itin.length; i++) {
    for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
      segments.push({
        origin: currentItin.itin[i].seg[j].orig,
        destination: currentItin.itin[i].seg[j].dest,
        departure: new Date(currentItin.itin[i].seg[j].dep.year, currentItin.itin[i].seg[j].dep.month, currentItin.itin[i].seg[j].dep.day),
        carrier: currentItin.itin[i].seg[j].carrier,
        bookingClass: currentItin.itin[i].seg[j].bookingclass,
        codeshare: currentItin.itin[i].seg[j].codeshare,
        flightNumber: currentItin.itin[i].seg[j].fnr,
      });
    }
  }
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '//www.wheretocredit.com/api/beta/calculator');
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      link.href = '//www.wheretocredit.com';
      link.innerHTML = 'Results provided by wheretocredit.com';
      
      var data, result;
      try {
        data = JSON.parse(xhr.responseText);
      } catch (e) {
        data = xhr.responseText;
      }
      
      if (xhr.status === 200 && data && data.success) {
          data.value.totals.sort(function (a, b) {
            if (a.value === b.value) {
              return +(a.name > b.name) || +(a.name === b.name) - 1;
            }
            return b.value - a.value; // desc
          });
          result = data.value.totals.map(function (seg, i) { return seg.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ' + seg.name + ' miles'; }).join('<br/>');
      }
      else {
        result = data.errorMessage || data || 'API quota exceeded &#x2639;';
      }
      
      container.style.display = 'block';
      container.innerHTML = result;
    }
  };
  xhr.send(JSON.stringify({
    segments: segments
  }));
}

function printWheretocredit() {
  var extra = '<span id="wheretocredit-container" style="display: none;">&nbsp;<img src="data:image/gif;base64,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" style="width: 1em; height: 1em;"></span>';
  
  var container;
  if (mptUsersettings["enableInlinemode"]==1){
      printUrlInline('javascript: void(0);', 'wheretocredit.com', '', 1, extra);
      container = getSidebarContainer(1);
  } else {
      printUrl('javascript: void(0);', 'wheretocredit.com', '', extra);
      container = document.getElementById('powertoolslinkcontainer');
  }
  
  var links = container.getElementsByTagName('a');
  var link = links[links.length - 1];
  link.innerHTML = 'Calculate miles with wheretocredit.com';
  link.onclick = function () {
    link.onclick = null;
    openWheretocredit(link);
  };
}

function bindWheretocredit(){
  for (var i=0;i<currentItin["itin"].length;i++) {
  // walks each leg      
    for (var j=0;j<currentItin["itin"][i]["seg"].length;j++) {
       //walks each segment of leg
          var target = findItinTarget((i+1),(j+1),"cabin");
          if (target===false) {
            printNotification("Error: Could not find target in bindWheretocredit");
            return false;
          } else {
            var url='http://www.wheretocredit.com/'+currentItin['itin'][i]['seg'][j]['carrier'].toLowerCase()+'/'+currentItin['itin'][i]['seg'][j]['bookingclass'].toLowerCase();
            target.children[0].innerHTML= target.children[0].innerHTML.replace(/<a.*?\/a>/,'('+currentItin['itin'][i]['seg'][j]['bookingclass']+')').replace('('+currentItin['itin'][i]['seg'][j]['bookingclass']+')','<a href="'+url+'" target="_blank" style="text-decoration:none;color:black">('+currentItin['itin'][i]['seg'][j]['bookingclass']+")</a>");        
          }
      }
   }  
}

// Inline Stuff
function printUrlInline(url,text,desc,nth,extra){
  var otext = '<a href="'+url+ '" target="_blank">';
  var valid=false;
  if (translations[mptUsersettings["language"]] !== undefined) {
    if (translations[mptUsersettings["language"]]["openwith"] !== undefined) {
      otext += translations[mptUsersettings["language"]]["openwith"];
      valid=true;
    }
  }
  otext+=(valid===false ? "Open with":"");
  otext+=' '+text+'</a>' + (extra||''); 
  printItemInline(otext,desc,nth);
}
function printItemInline(text,desc,nth){
  div = getSidebarContainer(nth);
  div.innerHTML = div.innerHTML + '<li class="powertoolsitem">'+text+(desc ? '<br/><small>('+desc+')</small>' : '')+'</li>';
}
function printImageInline(src,url,nth){
  div = getSidebarContainer(nth).parentNode;
  if (mptUsersettings["enableIMGautoload"] == 1) {
    div.innerHTML = div.innerHTML + (url?'<a href="'+url+ '" target="_blank" class="powertoolsitem">':'')+'<img src="'+src+'" style="margin-top:10px;"'+(!url?' class="powertoolsitem"':'')+'/>'+(url?'</a>':'');      
   } else {
     var id=Math.random();
     div.innerHTML = div.innerHTML + '<div id="'+id+'" class="powertoolsitem" style="width:184px;height:100px;background-color:white;cursor:pointer;text-align:center;margin-top:10px;padding-top:84px;"><span>Click</span></div>';
     document.getElementById(id).onclick=function(){
       var newdiv = document.createElement('div');
       newdiv.setAttribute('class','powertoolsitem');
       newdiv.innerHTML =(url?'<a href="'+url+ '" target="_blank">':'')+'<img src="'+src+'" style="margin-top:10px;"'+(!url?' class="powertoolsitem"':'')+'/>'+(url?'</a>':'');
       document.getElementById(id).parentNode.replaceChild(newdiv,document.getElementById(id));
      };   
   } 
}
function getSidebarContainer(nth){
  var div = !nth || nth >= 4 ? document.getElementById('powertoolslinkinlinecontainer') : findtarget(classSettings["resultpage"]["mcHeader"], nth).nextElementSibling;
  return div ||createUrlContainerInline();
}
function createUrlContainerInline(){
  var newdiv = document.createElement('div');
  newdiv.setAttribute('class',classSettings["resultpage"]["mcDiv"]);
  newdiv.innerHTML = '<div class="'+classSettings["resultpage"]["mcHeader"]+'">Powertools</div><ul id="powertoolslinkinlinecontainer" class="'+classSettings["resultpage"]["mcLinkList"]+'"></ul>';
  findtarget(classSettings["resultpage"]["mcDiv"],1).parentNode.appendChild(newdiv);
  return document.getElementById('powertoolslinkinlinecontainer');
}
// Printing Stuff
function printUrl(url,name,desc,extra) {
    if (document.getElementById('powertoolslinkcontainer')==undefined){
    createUrlContainer();
    }
  var text = "<br><font size=3><bold><a href=\""+url+ "\" target=_blank>";
  var valid=false;
  if (translations[mptUsersettings["language"]] !== undefined) {
    if (translations[mptUsersettings["language"]]["openwith"] !== undefined) {
      text += translations[mptUsersettings["language"]]["openwith"];
      valid=true;
    }
  }
  text+=(valid===false ? "Open with":"");
  text+=" "+name+"</a></font></bold>"+(extra||'')+(desc ? "<br>("+desc+")<br>" : "<br>");  
  var target = document.getElementById('powertoolslinkcontainer');
  target.innerHTML = target.innerHTML + text;
}
function createUrlContainer(){
  var newdiv = document.createElement('div');
  newdiv.setAttribute('id','powertoolslinkcontainer');
  newdiv.setAttribute('style','margin-left:10px;');
  findtarget(classSettings["resultpage"]["htbContainer"],1).parentNode.parentNode.parentNode.appendChild(newdiv);
}
function printSeperator() {
  var container = document.getElementById('powertoolslinkcontainer') || getSidebarContainer();
  if (container) {
    container.innerHTML = container.innerHTML + (mptUsersettings["enableInlinemode"] ? '<hr class="powertoolsitem"/>' : '<br/><hr/>');
  }
}
function injectCss() {
  var css = '',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
  style.type = 'text/css';

  css += '.pt-hover-menu { position:absolute; padding: 8px; background-color: #FFF; border: 1px solid #808080; display:none; }';
  css += '.pt-hover-container:hover .pt-hover-menu { display:inline; }';
    
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}
