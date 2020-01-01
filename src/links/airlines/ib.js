import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";

export const ibEditions = [
  { value: "es-AO", name: "Angola - Español" },
  { value: "pt-AO", name: "Angola - Português" },
  { value: "es-DZ", name: "Argelia - Español" },
  { value: "fr-DZ", name: "Algérie - Français" },
  { value: "en-AR", name: "Argentina - English" },
  { value: "es-AR", name: "Argentina - Español" },
  { value: "en-BE", name: "Belgium - English" },
  { value: "es-BE", name: "Bélgica - Español" },
  { value: "fr-BE", name: "Belgique - Français" },
  { value: "es-BR", name: "Brasil - Español" },
  { value: "pt-BR", name: "Brasil - Português" },
  { value: "en-CL", name: "Chile - English" },
  { value: "es-CL", name: "Chile - Español" },
  { value: "en-CO", name: "Colombia - English" },
  { value: "es-CO", name: "Colombia - Español" },
  { value: "en-CR", name: "Costa Rica - English" },
  { value: "es-CR", name: "Costa Rica - Español" },
  { value: "en-HR", name: "Croatia - English" },
  { value: "es-HR", name: "Croacia - Español" },
  { value: "it-HR", name: "Croazia - Italiano" },
  { value: "en-CU", name: "Cuba - English" },
  { value: "es-CU", name: "Cuba - Español" },
  { value: "en-CZ", name: "Czech Republic - English" },
  { value: "es-CZ", name: "República Checa - Español" },
  { value: "en-DK", name: "Denmark - English" },
  { value: "es-DK", name: "Dinamarca - Español" },
  { value: "de-DE", name: "Deutschland - Deutsch" },
  { value: "es-DE", name: "Alemania - Español" },
  { value: "en-DO", name: "Dominican Republic - English" },
  { value: "es-DO", name: "República Dominicana - Español" },
  { value: "en-EC", name: "Ecuador - English" },
  { value: "es-EC", name: "Ecuador - Español" },
  { value: "en-SV", name: "El Salvador - English" },
  { value: "es-SV", name: "El Salvador - Español" },
  { value: "en-GQ", name: "Equatorial Guinea - English" },
  { value: "es-GQ", name: "Guinea Ecuatorial - Español" },
  { value: "ca-ES", name: "Espanya - Català" },
  { value: "en-ES", name: "Spain - English" },
  { value: "es-ES", name: "España - Español" },
  { value: "es-FR", name: "Francia - Español" },
  { value: "fr-FR", name: "France - Français" },
  { value: "en-GH", name: "Ghana - English" },
  { value: "es-GH", name: "Ghana - Español" },
  { value: "en-GR", name: "Greece - English" },
  { value: "es-GR", name: "Grecia - Español" },
  { value: "en-GT", name: "Guatemala - English" },
  { value: "es-GT", name: "Guatemala - Español" },
  { value: "en-HN", name: "Honduras - English" },
  { value: "es-HN", name: "Honduras - Español" },
  { value: "en-IE", name: "Ireland - English" },
  { value: "es-IE", name: "Irlanda - Español" },
  { value: "en-IL", name: "Israel - English" },
  { value: "es-IL", name: "Israel - Español" },
  { value: "en-IT", name: "Italy - English" },
  { value: "es-IT", name: "Italia - Español" },
  { value: "it-IT", name: "Italia - Italiano" },
  { value: "en-JP", name: "Japan - English" },
  { value: "es-JP", name: "Japón - Español" },
  { value: "ja-JP", name: "日本 - 日本語" },
  { value: "en-MT", name: "Malta - English" },
  { value: "es-MT", name: "Malta - Español" },
  { value: "it-MT", name: "Malta - Italiano" },
  { value: "es-MA", name: "Marruecos - Español" },
  { value: "fr-MA", name: "Maroc - Français" },
  { value: "es-MR", name: "Mauritania - Español" },
  { value: "fr-MR", name: "Mauritanie - Français" },
  { value: "en-MX", name: "Mexico - English" },
  { value: "es-MX", name: "México - Español" },
  { value: "en-NL", name: "Netherlands - English" },
  { value: "es-NL", name: "Holanda - Español" },
  { value: "nl-NL", name: "Nederland - Nederlands" },
  { value: "en-NI", name: "Nicaragua - English" },
  { value: "es-NI", name: "Nicaragua - Español" },
  { value: "en-NG", name: "Nigeria - English" },
  { value: "es-NG", name: "Nigeria - Español" },
  { value: "en-PA", name: "Panama - English" },
  { value: "es-PA", name: "Panamá - Español" },
  { value: "en-PE", name: "Peru - English" },
  { value: "es-PE", name: "Perú - Español" },
  { value: "es-PT", name: "Portugal - Español" },
  { value: "pt-PT", name: "Portugal - Português" },
  { value: "en-PR", name: "Puerto Rico - English" },
  { value: "es-PR", name: "Puerto Rico - Español" },
  { value: "en-RU", name: "Russian Federation - English" },
  { value: "es-RU", name: "Rusia - Español" },
  { value: "ru-RU", name: "Rossiya - Русский" },
  { value: "de-CH", name: "Schweiz - Deutsch" },
  { value: "es-CH", name: "Suiza - Español" },
  { value: "fr-CH", name: "Suisse - Français" },
  { value: "es-SN", name: "Senegal - Español" },
  { value: "fr-SN", name: "Sénégal - Français" },
  { value: "en-ZA", name: "South Africa - English" },
  { value: "es-ZA", name: "Sudáfrica - Español" },
  { value: "en-SE", name: "Sweden - English" },
  { value: "es-SE", name: "Suecia - Español" },
  { value: "en-TR", name: "Turkey - English" },
  { value: "es-TR", name: "Turquía - Español" },
  { value: "en-US", name: "USA - English" },
  { value: "es-US", name: "USA - Español" },
  { value: "en-GB", name: "United Kingdom - English" },
  { value: "es-GB", name: "Reino Unido - Español" },
  { value: "en-UY", name: "Uruguay - English" },
  { value: "es-UY", name: "Uruguay - Español" },
  { value: "en-VE", name: "Venezuela - English" },
  { value: "es-VE", name: "Venezuela - Español" }
];

function printIB() {
  if (
    !mptUserSettings.showAllAirlines &&
    !(
      inArray("IB", currentItin.carriers) || inArray("BA", currentItin.carriers)
    )
  ) {
    return;
  }

  var createUrl = function(edition, currency) {
    // 0 = Economy; 1=Premium Economy; 2=Business; 3=First
    var cabins = ["Economy", "Economy", "Business", "First"];
    var pax = validatePaxcount({
      maxPaxcount: 9,
      countInf: false,
      childAsAdult: 12,
      sepInfSeat: false,
      childMinAge: 2
    });
    if (!pax) {
      printNotification("Error: Failed to validate Passengers in printIB");
      return;
    }
    var url =
      "http://www.iberia.com/web/partnerLink.do?Adult=" +
      pax.adults +
      "&Child=" +
      pax.children.length +
      "&Infant=0&InfantLap=" +
      pax.infLap +
      "&PointOfSaleCountry=" +
      edition[1] +
      "&UserCurrency=" +
      currency +
      "&UserLanguage=" +
      edition[0] +
      "&TripType=";
    if (currentItin.itin.length == 1) {
      url += "OneWay";
    } else if (
      currentItin.itin.length == 2 &&
      currentItin.itin[0].orig == currentItin.itin[1].dest &&
      currentItin.itin[0].dest == currentItin.itin[1].orig
    ) {
      url += "RoundTrip";
    } else {
      url += "MultiCity";
    }

    var seg = 0;
    var slice = 1;
    var slicestr = "";
    //Build multi-city search based on legs
    for (var i = 0; i < currentItin.itin.length; i++) {
      // walks each leg
      for (var j = 0; j < currentItin.itin[i].seg.length; j++) {
        seg++;
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
        url += "&Origin" + seg + "=" + currentItin.itin[i].seg[j].orig;
        url += "&Destination" + seg + "=" + currentItin.itin[i].seg[j + k].dest;
        url += "&Carrier" + seg + "=" + currentItin.itin[i].seg[j].carrier;
        url +=
          "&DepartureDate" +
          seg +
          "=" +
          currentItin.itin[i].seg[j].dep.year +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.month).slice(-2) +
          "-" +
          ("0" + currentItin.itin[i].seg[j].dep.day).slice(-2);
        url += "&FlightNumber" + seg + "=" + currentItin.itin[i].seg[j].fnr;
        url +=
          "&BookingCode" + seg + "=" + currentItin.itin[i].seg[j].bookingclass;
        url += "&Cabin" + seg + "=" + cabins[currentItin.itin[i].seg[j].cabin];
        slicestr += (slicestr === "" ? "" : "%2C") + seg;
        j += k;
      }
      url += "&Slice" + slice + "=" + slicestr;
      slice++;
      slicestr = "";
    }
    return url;
  };
  // get edition
  var edition = mptUserSettings.ibEdition.split("-");
  var url = createUrl(edition, "USD");
  if (!url) {
    return;
  }
  var extra =
    ' <span class="pt-hover-container">[+]<span class="pt-hover-menu">';
  extra += ibEditions
    .map(function(obj, i) {
      return (
        '<a href="' +
        createUrl(obj.value.split("-"), "USD") +
        '" target="_blank">' +
        obj.name +
        "</a>"
      );
    })
    .join("<br/>");
  extra += "</span></span>";

  return {
    url,
    title: "Iberia",
    extra
  };
}

registerLink("airlines", printIB);
