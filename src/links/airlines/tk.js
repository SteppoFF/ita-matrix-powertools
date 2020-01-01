import mptUserSettings from "../../settings/userSettings";
import { printNotification, inArray } from "../../utils";
import { validatePaxcount, registerLink } from "../../print/links";
import { currentItin } from "../../parse/itin";
import {
  getAmadeusUrl,
  getAmadeusTriptype,
  getAmadeusPax
} from "../../print/amadeus";

function printTK() {
  if (
    !mptUserSettings.showAllAirlines &&
    !inArray("TK", currentItin.carriers)
  ) {
    return;
  }

  var url =
    "https://book.eu2.amadeus.com/plnext/turkishairlines/Override.action?";
  var paxConfig = { allowinf: 1, youthage: 0 };
  var pax = validatePaxcount({
    maxPaxcount: 9,
    countInf: false,
    childAsAdult: 12,
    sepInfSeat: false,
    childMinAge: 2
  });
  if (!pax) {
    printNotification("Error: Failed to validate Passengers in printTK");
    return;
  }
  var amadeusConfig = {
    sepcabin: 0,
    detailed: 0,
    allowpremium: 1,
    inctimes: 1
  };
  var tmpPax = getAmadeusPax(pax, paxConfig);
  url += "TRIP_TYPE=" + getAmadeusTriptype();
  url += tmpPax.url;
  url += getAmadeusUrl(amadeusConfig);
  url +=
    "&PORT_TSC=FALSE&SO_SITE_ALLOW_SERVICE_FEE=0&SO_SITE_SERVICE_FEE_MODE=AIR&SITE=BBAHBBAH";
  url +=
    "&LANGUAGE=" +
    (mptUserSettings.language == "tk" || mptUserSettings.language == "de"
      ? mptUserSettings.language.toUpperCase()
      : "GB");
  url += "&EMBEDDED_TRANSACTION=AirComplexAvailability&TRIPFLOW=YES";
  url +=
    "SO_LANG_TRIPFLOW_ENTRY_ADDRE=online.turkishairlines.com%2Finternet-booking%2Famadeus.tk&ARRANGE_BY=N&DIRECT_NON_STOP=false&REFRESH=0&SO_SITE_TAX_BREAKDOWN_DISP=TRUE&SO_LANG_DISABLE_X_XSS_PROTEC=TRUE&SO_SITE_REDIRECT_MODE=AUTOMATIC&SO_LANG_URL_AIR_NFS_SRCH=http%3A%2F%2Fonline.turkishairlines.com%2Finternet-booking%2Fstart.tk";

  return {
    url,
    title: "Turkish"
  };
}

registerLink("airlines", printTK);
