/* Developer Note:
 * These farefreaks functions have been removed from the main
 * ita-matrix-powertools.user.js script due to the farefreaks
 * site being down for an extended period of time, with no
 * plan for its return. These will remain for reference, should
 * we determine a replacement in the future, or farefreaks return.
 */

 function printFarefreaks (method){
 // Should be fine
 // method: 0 = based on leg; 1 = based on segment
     var carrieruarray = new Array();
     var mincabin=3;
     var segsize=0;
     var farefreaksurl = "https://www.farefreaks.com/landing/landing.php?";
     if (mptSettings["itaLanguage"]=="de"||mptUserSettings.language=="de"){
     farefreaksurl +="lang=de";
     } else {
     farefreaksurl +="lang=en";
     }
     farefreaksurl += "&target=flightsearch&referrer=matrix";
     for (var i=0;i<currentItin.itin.length;i++) {
         if (method!=1){
           farefreaksurl += "&orig["+segsize+"]=" + currentItin.itin[i].orig;
           farefreaksurl += "&dest["+segsize+"]=" + currentItin.itin[i].dest;
           farefreaksurl += "&date["+segsize+"]="+currentItin.itin[i]["dep"]["year"].toString() + "-" + currentItin.itin[i]["dep"]["month"] + "-" + currentItin.itin[i]["dep"]["day"] + "_"+currentItin.itin[i]["dep"]["time"]+":00";
           farefreaksurl += "&validtime["+segsize+"]=1";
           segsize++;
         }
        for (var j=0;j<currentItin.itin[i].seg.length;j++) {
         if (method==1){
           var k=0;
           // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
           while ((j+k)<currentItin.itin[i].seg.length-1){
           if (currentItin.itin[i].seg[j+k].fnr != currentItin.itin[i].seg[j+k+1].fnr ||
                    currentItin.itin[i].seg[j+k].layoverduration >= 1440) break;
                  k++;
           }
           farefreaksurl += "&orig["+segsize+"]=" + currentItin.itin[i].seg[j].orig;
           farefreaksurl += "&dest["+segsize+"]=" + currentItin.itin[i].seg[j+k].dest;
           farefreaksurl += "&date["+segsize+"]="+currentItin.itin[i].seg[j]["dep"]["year"].toString() + "-" + currentItin.itin[i].seg[j]["dep"]["month"] + "-" + currentItin.itin[i].seg[j]["dep"]["day"] + "_"+currentItin.itin[i].seg[j]["dep"]["time"]+":00";
           farefreaksurl += "&validtime["+segsize+"]=1";
           segsize++;
           j+=k;
         }
         if (currentItin.itin[i].seg[j].cabin<mincabin){mincabin=currentItin.itin[i].seg[j].cabin;};
         if (!inArray(currentItin.itin[i].seg[j].carrier,carrieruarray)){carrieruarray.push(currentItin.itin[i].seg[j].carrier);};
       }
     }
     var pax=validatePaxcount({maxPaxcount:9, countInf:true, childAsAdult:18, sepInfSeat:true, childMinAge:2});
     if (pax===false){
       printNotification("Error: Failed to validate Passengers in printFareFreaks");
       return false;
     }
     farefreaksurl += "&adult="+pax.adults;
     farefreaksurl += "&cabin="+(mptSettings.cabin==="Auto" ? mincabin:getForcedCabin());
     farefreaksurl += "&flexible=0";
     farefreaksurl += "&child="+(pax.infLap+pax.infSeat+pax.children.length);
     for (i=0;i<pax.infLap;i++){
        farefreaksurl += "&childage[]=0";
     }
     for (i=0;i<pax.infSeat;i++){
        farefreaksurl += "&childage[]=1";
     }
     for (i=0;i<pax.children.length;i++){
        farefreaksurl += "&childage[]="+pax.children[i];
     }
     if (method==1){
       farefreaksurl += "&nonstop=1";
       if (mptUserSettings.language=="de"){
         desc="Benutze "+segsize+" Segment(e)";
       } else {
         desc="Based on "+segsize+" segment(s)";
       }

     } else {
       if (segsize==1) {
         return false;
       }
       farefreaksurl += "&nonstop=0";
       if (mptUserSettings.language=="de"){
         desc="Benutze "+segsize+" Abschnitt(e)";
       } else {
         desc="Based on "+segsize+" segment(s)";
       }
     }
     if (carrieruarray.length <= 3) {farefreaksurl += "&carrier="+ carrieruarray.toString();}

     if (mptUserSettings.enableInlineMode==1 && segsize<=6){
       printUrlInline(farefreaksurl,"Farefreaks",desc);
     } else if (segsize<=6) {
       printUrl(farefreaksurl,"Farefreaks",desc);
     }
 }

 function createFareFreaksContainer(){
   // create links & container
   var printtarget= findtarget(classSettings["resultpage"]["itin"],1);
   var content = '<div>Itinerary';
   content += '<div style="display:inline-block;margin-left:20px;color: #000;font-size: smaller;" class="ff-links">';
     content += '<div style="display:inline-block;"><label id="ff-createroutingcodes" style="cursor:pointer;">Routing Codes</label></div>';
     content += '<div style="display:inline-block;margin-left:20px"><label id="ff-createflightplan" style="cursor:pointer;">Flight Manager</label></div>';
   content += '</div>';
   content += '<div style="color: #000;font-size: smaller;" class="ff-plancontainer">';
     content += '<div id="ff-flightplanoutput" class="invis" style="display: none;margin-top:2px"><input id="ff-flightplanlinkinput" type="text" style="width:600px"> <a id="ff-flightplanlinklink" href="" target="_blank" style="margin-left:20px">Open</a> <label id="ff-closeflightplancontainer" style="cursor:pointer;margin-left:15px">Close</label></div></td>';
   content += '</div>';
   printtarget.innerHTML=content;
   // build routing codes container
   var div = document.createElement('div');
   div.setAttribute('id', 'ff-routingcodescontainer');
   div.setAttribute('class', 'invis');
   div.setAttribute('style', 'display: none;border-bottom: 1px dashed grey;');
   content = '<div style="display:inline-block; width:85%" id="ff-routingcodesoutput"></div>';
   content += '<div style="display:inline-block; width:14%;text-align:center;"><label id="ff-closeroutingcodescontainer" style="cursor:pointer">Close</label></div>';
   div.innerHTML=content;
   document.getElementById("contentwrapper").parentNode.insertBefore(div, document.getElementById("contentwrapper"));
   // bind
   document.getElementById('ff-createflightplan').onclick=function(){
      if (document.getElementById('ff-flightplanlinkinput').value==""){
        document.getElementById('ff-flightplanlinkinput').value="Loading... Please wait..";
        createFareFreaksPlanlink();
      }
      toggleVis(document.getElementById("ff-flightplanoutput"));
    };
   document.getElementById('ff-closeflightplancontainer').onclick=function(){ toggleVis(document.getElementById("ff-flightplanoutput"));};
   document.getElementById('ff-createroutingcodes').onclick=function(){
      if (document.getElementById('ff-routingcodesoutput').innerHTML==""){
        document.getElementById('ff-routingcodesoutput').innerHTML="Loading... Please wait..";
        getFareFreaksRoutingcodes();
      }
      toggleVis(document.getElementById("ff-routingcodescontainer"));
    };
   document.getElementById('ff-closeroutingcodescontainer').onclick=function(){ toggleVis(document.getElementById("ff-routingcodescontainer"));};
 }

 function getFareFreaksPlan(){
    function formatDuration(dur){
      var hours   = Math.floor(dur / 60);
      var minutes = Math.floor(dur - (hours * 60));
      return hours+'h '+minutes+'m';
   }
   var plan=new Array();
   var cabins = ['Economy', 'Premium Economy', 'Business', 'First'];
   for (var i=0;i<currentItin.itin.length;i++) {
   // walks each leg
   var leg = new Array();
     for (var j=0;j<currentItin.itin[i].seg.length;j++) {
        //walks each segment of leg
          var temp= new Object();
          var k=0;
          // lets have a look if we need to skip segments - Flightnumber has to be the same and it must be just a layover
          while ((j+k)<currentItin.itin[i].seg.length-1){
             if (currentItin.itin[i].seg[j+k].fnr != currentItin.itin[i].seg[j+k+1].fnr ||
                 currentItin.itin[i].seg[j+k].layoverduration >= 1440) break;
              k++;
          }
          temp.aircraft = currentItin.itin[i].seg[j]["aircraft"].replace(/\s*\(.*?\)s*/g, "");
          temp.airline = currentItin.itin[i].seg[j].carrier;
          temp.arrdate = currentItin.itin[i].seg[j+k]["arr"]["year"]+"-"+("0"+currentItin.itin[i].seg[j+k]["arr"]["month"]).slice(-2)+"-"+("0"+currentItin.itin[i].seg[j+k]["arr"]["day"]).slice(-2);
          temp.arrtime = ("00"+currentItin.itin[i].seg[j+k]["arr"]["time"]).slice(-5);
          temp.bc = currentItin.itin[i].seg[j].bookingclass;
          temp.cabinReal = cabins[currentItin.itin[i].seg[j].cabin];
          temp.cabin = currentItin.itin[i].seg[j].cabin;
          temp.codeshare = currentItin.itin[i].seg[j]["codeshare"];
          temp.depdate = currentItin.itin[i].seg[j]["dep"]["year"]+"-"+("0"+currentItin.itin[i].seg[j]["dep"]["month"]).slice(-2)+"-"+("0"+currentItin.itin[i].seg[j]["dep"]["day"]).slice(-2);
          temp.deptime = ("00"+currentItin.itin[i].seg[j]["dep"]["time"]).slice(-5);
          temp.dest = currentItin.itin[i].seg[j+k].dest;
          temp.orig = currentItin.itin[i].seg[j].orig;
          temp.duration = formatDuration(currentItin.itin[i].seg[j]["duration"]);
          temp.farebase = currentItin.itin[i].seg[j].farebase;
          temp.farecarrier = currentItin.itin[i].seg[j]["farecarrier"];
          temp.fnr = currentItin.itin[i].seg[j].fnr;
          // attach stops
          if (k>0) {
            temp.stops=new Array();
            var combinedduration = currentItin.itin[i].seg[j]["duration"];
          }
          for (var l=0;l<k;l++) {
            var tmpstop=new Object();
            tmpstop.apt =currentItin.itin[i].seg[j+l].dest;
            tmpstop.arrdate = currentItin.itin[i].seg[j+l]["arr"]["year"]+"-"+("0"+currentItin.itin[i].seg[j+l]["arr"]["month"]).slice(-2)+"-"+("0"+currentItin.itin[i].seg[j+l]["arr"]["day"]).slice(-2);
            tmpstop.arrtime = ("00"+currentItin.itin[i].seg[j+l]["arr"]["time"]).slice(-5);
            tmpstop.depdate = currentItin.itin[i].seg[(j+l+1)]["dep"]["year"]+"-"+("0"+currentItin.itin[i].seg[(j+l+1)]["dep"]["month"]).slice(-2)+"-"+("0"+currentItin.itin[i].seg[(j+l+1)]["dep"]["day"]).slice(-2);
            tmpstop.deptime = ("00"+currentItin.itin[i].seg[(j+l+1)]["dep"]["time"]).slice(-5);
            tmpstop.duration = formatDuration(currentItin.itin[i].seg[j+l].layoverduration);
            combinedduration+=currentItin.itin[i].seg[j+l].layoverduration;
            combinedduration+=currentItin.itin[i].seg[j+l+1]["duration"];
            temp.stops.push(tmpstop);
          }
          if (k>0) {temp.duration = formatDuration(combinedduration);}
          j+=k;
          leg.push(temp);
       }
    plan.push({segs:leg});
    }
   return plan;
 }

 function getFareFreaksRoutingcodes(){
   var options = {};
   options.mode="post";
   options.headers=[{name:'Accept', val:'application/json;charset=UTF-8'}, {name:'Content-Type', val:'application/x-www-form-urlencoded'}];
   options.data="data="+JSON.stringify({action:"creatematrix",plan:getFareFreaksPlan(),type:"matrix",mci_autofocus:1,mci_bcfromfare:1,mci_carriersleg:1,mci_carriersseg:1,mci_fnr:1,mci_inclbc:1,mci_inclcontime:1,mci_inclfare:1});
   doHttpRequest("https://www.farefreaks.com/flightmanager/ajax/planhandler.php",options,function(xmlHttpObject) {
      var response=false;
      if (typeof(JSON) !== "undefined"){
        try {
           response = JSON.parse(xmlHttpObject.responseText);
         } catch (e){
           response=false;
         }
      } else {
        // do not(!) use eval here :-/
        printNotification("Error: Failed saving plan - Browser not supporting JSON");
        return false;
      }
      if (typeof(response) !== "object"){
       printNotification("Error: Failed getting routing codes");
       return false;
      }
      if (response["success"]===undefined || response["type"]===undefined || response["data"]===undefined ){
       printNotification("Error: routing codes data format");
       return false;
      }
      if (response["success"]!=="1"){
       printNotification("Error: "+response["error"]+" while retrieving routing codes");
       return false;
      } else {
        var div = document.createElement('div');
        for (var i = 0; i < response["data"].length; i++){
          var input = document.createElement('input');
          input.setAttribute('type','text');
          input.setAttribute('style','width:100%;margin: 2px');
          input.setAttribute('value',response["data"][i]);
          div.appendChild(input);
        }
        document.getElementById('ff-routingcodesoutput').innerHTML="";
        document.getElementById('ff-routingcodesoutput').appendChild(div);
      }
     });
 }

 function createFareFreaksPlanlink(){
   var options = {};
   options.mode="post";
   options.headers=[{name:'Accept', val:'application/json;charset=UTF-8'}, {name:'Content-Type', val:'application/x-www-form-urlencoded'}];
   options.data="data="+JSON.stringify({action:"createplan",plan:getFareFreaksPlan(),type:"matrix"});
   doHttpRequest("https://www.farefreaks.com/flightmanager/ajax/planhandler.php",options,function(xmlHttpObject) {
      var response=false;
      if (typeof(JSON) !== "undefined"){
        try {
           response = JSON.parse(xmlHttpObject.responseText);
         } catch (e){
           response=false;
         }
      } else {
        // do not(!) use eval here :-/
        printNotification("Error: Failed saving plan - Browser not supporting JSON");
        return false;
      }
      if (typeof(response) !== "object"){
       printNotification("Error: Failed saving plan");
       return false;
      }
      if (response["success"]===undefined || response["id"]===undefined || response["url"]===undefined ){
       printNotification("Error: wrong plan data format");
       return false;
      }
      if (response["success"]!=="1"){
       printNotification("Error: "+response["error"]+" while retrieving flight plan");
       return false;
      } else {
        document.getElementById('ff-flightplanlinkinput').value = response["url"];
        document.getElementById('ff-flightplanlinklink').href = response["url"];
      }
     });
 }

 function resolveTimezones(){
   var options = {};
   document.getElementById('timezone-container').style.display = 'inline';
   options.mode="post";
   options.headers=[{name:'Accept', val:'application/json;charset=UTF-8'}, {name:'Content-Type', val:'application/x-www-form-urlencoded'}];
   options.data="data="+JSON.stringify({action:"resolvetimezones",plan:getTimezoneData("small"),type:"matrix"});
   doHttpRequest("https://www.farefreaks.com/ajax/timezone.php",options,function(xmlHttpObject) {
      var response=false;
      document.getElementById('timezone-container').style.display = 'none';
      if (typeof(JSON) !== "undefined"){
        try {
           response = JSON.parse(xmlHttpObject.responseText);
         } catch (e){
           response=false;
         }
      } else {
        // do not(!) use eval here :-/
        printNotification("Error: Failed retrieving timezones - Browser not supporting JSON");
        return false;
      }
      if (typeof(response) !== "object"){
       printNotification("Error: Failed retrieving timezones");
       return false;
      }
      if (response["success"]===undefined || response["data"]===undefined){
       printNotification("Error: Failed retrieving timezones - wrong plan data format");
       return false;
      }
      if (response["success"]!=="1"){
       printNotification("Error: "+response["error"]+" while retrieving timezone data");
       return false;
      } else {
        for (var i=0;i<currentItin.itin.length;i++) {
         // walks each leg
           currentItin.itin[i]["dep"]["offset"]=response["data"][i][0]["depoffset"];
           for (var j=0;j<currentItin.itin[i].seg.length;j++) {
             // walks each segment of leg
             // validate
             var temp = response["data"][i][j]["depoffset"].match(/^([\+\-]{1}[0-9]{2}:[0-9]{2})$/);
             if(temp===null){
                   printNotification("Error: Failed retrieving timezones - invalid response");
                   return false;
             }
             currentItin.itin[i].seg[j]["dep"]["offset"]=response["data"][i][j]["depoffset"];
             if (typeof(response["data"][i][j]["arroffset"])!=="undefined"){
               // validate
               var temp = response["data"][i][j]["arroffset"].match(/^([\+\-]{1}[0-9]{2}:[0-9]{2})$/);
               if(temp===null){
                     printNotification("Error: Failed retrieving timezones - invalid response");
                     return false;
               }
               currentItin.itin[i].seg[j]["arr"]["offset"]=response["data"][i][j]["arroffset"];
             }
           }
           if (typeof(response["data"][i][j-1]["arroffset"])!=="undefined"){
             currentItin.itin[i]["arr"]["offset"]=response["data"][i][j-1]["arroffset"];
           }
        }
      }
      printLinksContainer();
     });
 }

 function printTimezones(){
   var container;
   var extra = '<span id="timezone-container" style="display: none;">&nbsp;<img src="data:image/gif;base64,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" style="width: 1em; height: 1em;"></span>';
   if (mptUserSettings.enableInlineMode==1){
       printUrlInline('javascript: void(0);', 'Resolve Timezones', '', 1, extra);
       container = getSidebarContainer(1);
   } else {
       printUrl('javascript: void(0);', 'Resolve Timezones', '', extra);
       container = document.getElementById('powertoolslinkcontainer');
   }
   var links = container.getElementsByTagName('a');
   var link = links[0];
   link.innerHTML = 'Resolve Timezones';
   link.target = '_self';
   link.style='color:black';
 }
