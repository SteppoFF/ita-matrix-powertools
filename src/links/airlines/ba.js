import mptSettings, { getForcedCabin } from "../../settings/appSettings";
import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

export const baEditions = [
  { value: "AF", name: "Afghanistan" },
  { value: "AL", name: "Albania" },
  { value: "DZ", name: "Algeria" },
  { value: "AS", name: "American Samoa" },
  { value: "AD", name: "Andorra" },
  { value: "AO", name: "Angola" },
  { value: "AI", name: "Anguilla" },
  { value: "AG", name: "Antigua" },
  { value: "AR", name: "Argentina" },
  { value: "AM", name: "Armenia" },
  { value: "AW", name: "Aruba" },
  { value: "AU", name: "Australia" },
  { value: "AT", name: "Austria" },
  { value: "AZ", name: "Azerbaijan" },
  { value: "BS", name: "Bahamas" },
  { value: "BH", name: "Bahrain" },
  { value: "BD", name: "Bangladesh" },
  { value: "BB", name: "Barbados" },
  { value: "BY", name: "Belarus" },
  { value: "BE", name: "Belgium" },
  { value: "BZ", name: "Belize" },
  { value: "BJ", name: "Benin Republic" },
  { value: "BM", name: "Bermuda" },
  { value: "BT", name: "Bhutan" },
  { value: "BO", name: "Bolivia" },
  { value: "BA", name: "Bosnia-Herzegovina" },
  { value: "BW", name: "Botswana" },
  { value: "BR", name: "Brazil" },
  { value: "VG", name: "British Virgin Islands" },
  { value: "BN", name: "Brunei" },
  { value: "BG", name: "Bulgaria" },
  { value: "BF", name: "Burkina Faso" },
  { value: "BI", name: "Burundi" },
  { value: "KH", name: "Cambodia" },
  { value: "CA", name: "Canada" },
  { value: "CV", name: "Cape Verde" },
  { value: "KY", name: "Cayman Islands" },
  { value: "CF", name: "Central African Rep" },
  { value: "TD", name: "Chad" },
  { value: "CL", name: "Chile" },
  { value: "CN", name: "China" },
  { value: "CX", name: "Christmas Island" },
  { value: "CC", name: "Cocos Islands" },
  { value: "CO", name: "Colombia" },
  { value: "CG", name: "Congo" },
  { value: "CK", name: "Cook Islands" },
  { value: "CR", name: "Costa Rica" },
  { value: "HR", name: "Croatia" },
  { value: "CU", name: "Cuba" },
  { value: "CY", name: "Cyprus" },
  { value: "CZ", name: "Czech Republic" },
  { value: "DK", name: "Denmark" },
  { value: "DJ", name: "Djibouti" },
  { value: "DM", name: "Dominica" },
  { value: "DO", name: "Dominican Rep" },
  { value: "EC", name: "Ecuador" },
  { value: "EG", name: "Egypt" },
  { value: "SV", name: "El Salvador" },
  { value: "GQ", name: "Equatorial Guinea" },
  { value: "ER", name: "Eritrea" },
  { value: "EE", name: "Estonia" },
  { value: "ET", name: "Ethiopia" },
  { value: "FO", name: "Faeroe Is" },
  { value: "FK", name: "Falkland Is" },
  { value: "FJ", name: "Fiji" },
  { value: "FI", name: "Finland" },
  { value: "FR", name: "France" },
  { value: "GF", name: "French Guyana" },
  { value: "PF", name: "French Polynesia" },
  { value: "GA", name: "Gabon" },
  { value: "GM", name: "Gambia" },
  { value: "GE", name: "Georgia" },
  { value: "DE", name: "Germany" },
  { value: "GH", name: "Ghana" },
  { value: "GI", name: "Gibraltar (UK)" },
  { value: "GR", name: "Greece" },
  { value: "GL", name: "Greenland" },
  { value: "GD", name: "Grenada" },
  { value: "GP", name: "Guadeloupe" },
  { value: "GU", name: "Guam" },
  { value: "GT", name: "Guatemala" },
  { value: "GN", name: "Guinea" },
  { value: "GW", name: "Guinea Bissau" },
  { value: "GY", name: "Guyana" },
  { value: "HT", name: "Haiti" },
  { value: "HN", name: "Honduras" },
  { value: "HK", name: "Hong Kong" },
  { value: "HU", name: "Hungary" },
  { value: "IS", name: "Iceland" },
  { value: "IN", name: "India" },
  { value: "ID", name: "Indonesia" },
  { value: "IR", name: "Iran" },
  { value: "IQ", name: "Iraq" },
  { value: "IE", name: "Ireland" },
  { value: "IL", name: "Israel" },
  { value: "IT", name: "Italy" },
  { value: "CI", name: "Ivory Coast" },
  { value: "JM", name: "Jamaica" },
  { value: "JP", name: "Japan" },
  { value: "JO", name: "Jordan" },
  { value: "KZ", name: "Kazakhstan" },
  { value: "KE", name: "Kenya" },
  { value: "KI", name: "Kiribati" },
  { value: "XK", name: "Kosovo" },
  { value: "KW", name: "Kuwait" },
  { value: "KG", name: "Kyrgyzstan" },
  { value: "LA", name: "Laos" },
  { value: "LV", name: "Latvia" },
  { value: "LB", name: "Lebanon" },
  { value: "LS", name: "Lesotho" },
  { value: "LR", name: "Liberia" },
  { value: "LY", name: "Libya" },
  { value: "LI", name: "Liechtenstein" },
  { value: "LT", name: "Lithuania" },
  { value: "LU", name: "Luxembourg" },
  { value: "MO", name: "Macau" },
  { value: "MK", name: "Macedonia" },
  { value: "MG", name: "Madagascar" },
  { value: "MW", name: "Malawi" },
  { value: "MY", name: "Malaysia" },
  { value: "MV", name: "Maldives" },
  { value: "ML", name: "Mali" },
  { value: "MT", name: "Malta" },
  { value: "MP", name: "Mariana Islands" },
  { value: "MH", name: "Marshall Islands" },
  { value: "MQ", name: "Martinique" },
  { value: "MR", name: "Mauritania" },
  { value: "MU", name: "Mauritius" },
  { value: "MX", name: "Mexico" },
  { value: "FM", name: "Micronesia" },
  { value: "UM", name: "Minor Island" },
  { value: "MD", name: "Moldova" },
  { value: "MC", name: "Monaco" },
  { value: "ME", name: "Montenegro" },
  { value: "MS", name: "Montserrat" },
  { value: "MA", name: "Morocco" },
  { value: "MZ", name: "Mozambique" },
  { value: "MM", name: "Myanmar" },
  { value: "NA", name: "Namibia" },
  { value: "NR", name: "Nauru" },
  { value: "NP", name: "Nepal" },
  { value: "AN", name: "Netherland Antilles" },
  { value: "NL", name: "Netherlands" },
  { value: "NC", name: "New Caledonia" },
  { value: "NZ", name: "New Zealand" },
  { value: "NI", name: "Nicaragua" },
  { value: "NE", name: "Niger" },
  { value: "NG", name: "Nigeria" },
  { value: "NU", name: "Niue" },
  { value: "NF", name: "Norfolk Island" },
  { value: "NO", name: "Norway" },
  { value: "OM", name: "Oman" },
  { value: "PK", name: "Pakistan" },
  { value: "PA", name: "Panama" },
  { value: "PG", name: "Papua New Guinea" },
  { value: "PY", name: "Paraguay" },
  { value: "KP", name: "Peoples Rep Korea" },
  { value: "PE", name: "Peru" },
  { value: "PH", name: "Philippines" },
  { value: "PL", name: "Poland" },
  { value: "PT", name: "Portugal" },
  { value: "PR", name: "Puerto Rico" },
  { value: "QA", name: "Qatar" },
  { value: "CM", name: "Republic Cameroon" },
  { value: "RE", name: "Reunion" },
  { value: "RO", name: "Romania" },
  { value: "RU", name: "Russia" },
  { value: "RW", name: "Rwanda" },
  { value: "SM", name: "San Marino" },
  { value: "SA", name: "Saudi Arabia" },
  { value: "SN", name: "Senegal" },
  { value: "RS", name: "Serbia" },
  { value: "SC", name: "Seychelles" },
  { value: "SL", name: "Sierra Leone" },
  { value: "SG", name: "Singapore" },
  { value: "SK", name: "Slovakia" },
  { value: "SI", name: "Slovenia" },
  { value: "SB", name: "Solomon Island" },
  { value: "SO", name: "Somalia" },
  { value: "ZA", name: "South Africa" },
  { value: "KR", name: "South Korea" },
  { value: "ES", name: "Spain" },
  { value: "LK", name: "Sri Lanka" },
  { value: "KN", name: "St Kitts and Nevis" },
  { value: "LC", name: "St Lucia" },
  { value: "VC", name: "St Vincent" },
  { value: "SD", name: "Sudan" },
  { value: "SR", name: "Suriname" },
  { value: "SZ", name: "Swaziland" },
  { value: "SE", name: "Sweden" },
  { value: "CH", name: "Switzerland" },
  { value: "SY", name: "Syria" },
  { value: "TW", name: "Taiwan" },
  { value: "TJ", name: "Tajikistan" },
  { value: "TZ", name: "Tanzania" },
  { value: "TH", name: "Thailand" },
  { value: "TL", name: "Timor - Leste" },
  { value: "TG", name: "Togo" },
  { value: "TO", name: "Tonga" },
  { value: "TT", name: "Trinidad and Tobago" },
  { value: "TN", name: "Tunisia" },
  { value: "TR", name: "Turkey" },
  { value: "TM", name: "Turkmenistan" },
  { value: "TC", name: "Turks Caicos" },
  { value: "TV", name: "Tuvalu" },
  { value: "VI", name: "US Virgin Islands" },
  { value: "US", name: "USA" },
  { value: "UG", name: "Uganda" },
  { value: "UA", name: "Ukraine" },
  { value: "AE", name: "United Arab Emirates" },
  { value: "GB", name: "United Kingdom" },
  { value: "UY", name: "Uruguay" },
  { value: "UZ", name: "Uzbekistan" },
  { value: "VU", name: "Vanuatu" },
  { value: "VE", name: "Venezuela" },
  { value: "VN", name: "Vietnam" },
  { value: "WS", name: "Western Samoa" },
  { value: "YE", name: "Yemen Republic" },
  { value: "ZM", name: "Zambia" },
  { value: "ZW", name: "Zimbabwe" }
];

function printBA() {
  if (
    !mptUserSettings.showAllAirlines &&
    !(
      inArray("IB", currentItin.carriers) || inArray("BA", currentItin.carriers)
    )
  ) {
    return;
  }

  var createUrl = function(edition, language) {
    // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
    var cabins = ["M", "W", "C", "F"];
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 16,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printBA");
      return false;
    }
    var tmpPax = { c: 0, y: 0 };
    for (i = 0; i < pax.children.length; i++) {
      if (pax.children[i] > 11) {
        tmpPax.y++;
      } else {
        tmpPax.c++;
      }
    }
    var url =
      "https://www.britishairways.com/travel/fx/public/" +
      language +
      "_" +
      edition +
      "?eId=111054&data=F" +
      pax.adults +
      tmpPax.y +
      tmpPax.c +
      pax.infLap +
      "LF";
    var mincabin = 3;
    //Build multi-city search based on legs
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        //walks each segment of leg
        var k = 0;
        // lets have a look if we need to skip segments - fnr has to be the same and it must be just a layover
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
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2) +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          currentItin.itin[i].seg[j].dep.year +
          ("0" + currentItin.itin[i].seg[j].dep.time.replace(":", "")).slice(
            -4
          );
        url +=
          currentItin.itin[i].seg[j].carrier +
          ("000" + currentItin.itin[i].seg[j].fnr).slice(-4);
        url += cabins[currentItin.itin[i].seg[j].cabin];
        url +=
          currentItin.itin[i].seg[j].orig + currentItin.itin[i].seg[j + k].dest;
        if (currentItin.itin.length == 2 && i == 1) {
          url += "F";
        } else {
          url += "T";
        }
        if (currentItin.itin[i].seg[j].cabin < mincabin) {
          mincabin = currentItin.itin[i].seg[j].cabin;
        }
        j += k;
      }
    }
    url +=
      "&p=EUR6666.66&e=FP&c=" +
      cabins[mptSettings.cabin === "Auto" ? mincabin : getForcedCabin()] +
      "&source=FareQuoteEmail&isEmailHBOFareQuote=false";
    return url;
  };
  // get edition
  var url = createUrl(mptUserSettings.baEdition, mptUserSettings.baLanguage);
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += baEditions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.value, mptUserSettings.baLanguage) +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "British Airways",
    extra
  };
}

registerLink("airlines", printBA);
