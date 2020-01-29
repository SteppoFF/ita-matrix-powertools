# ita-matrix-powertools

[![Build Status](https://travis-ci.com/adamhwang/ita-matrix-powertools.svg?branch=master)](https://travis-ci.com/adamhwang/ita-matrix-powertools)
[![Dependencies Status](https://david-dm.org/adamhwang/ita-matrix-powertools/status.svg)](https://david-dm.org/adamhwang/ita-matrix-powertools)

Script for greasemonkey + ITA Matrix

[Main discussion thread at FlyerTalk Forums](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-userscript.html)

## Notice

```diff
- Double check your chosen flights before purchasing
- Some providers have limited support
- Current translations for the powertools interface: English, Deutsch
```

### Posts you should read

1. [General statement regarding this script](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-united-userscript-4.html#post24394534)
2. [How to fix class names yourself](http://www.flyertalk.com/forum/24807572-post119.html): class names should now be updated in [itaSettings.js](./src/itaSettings.js)
3. [Problems and limitations regarding pricing itineraries](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-united-userscript-9.html#post24906119)

## Installation

**Method 1: Browser Extension**

- Chrome: [Chrome Web Store](https://chrome.google.com/webstore/detail/ita-matrix-powertools/menecfddnlmanmpadcalononkolnplpp)
- Firefox (and Firefox for Android): [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/ita-matrix-powertools/)

**Method 2: As a UserScript**

_Step 1: Install a script manager_

- Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Violentmonkey](https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag)
- Firefox: [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/), [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/), or [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)
- Safari: [Tampermonkey](https://tampermonkey.net/?browser=safari)
- Microsoft Edge: [Tampermonkey](https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s)

_Step 2: Install the script_

See the FAQ of your script manager how to install the script.

- Through [GreasyFork](https://greasyfork.org/en/scripts/395661-ita-matrix-powertools)
- Through [OpenUserJS](https://openuserjs.org/scripts/adamhwang/ITA_Matrix_Powertools)
- Through [GitHub](https://github.com/adamhwang/ita-matrix-powertools/raw/master/ita-matrix-powertools.user.js): you should be asked whether you want to install it - make sure your script manager is running.

**Method 3: Console/Debug mode**

You need to access the command line of your browser to execute the script. You can use either the regular version or the minified version. Just copy and paste the entire text.

### Tips

- Using debug console, you may use the shortened minified version. (Note: there is no need to re-execute the script on pagechange unless you reloaded the page)
- Installing via a userscript manager simplifies saving your settings between sessions
- You can also create a [Bookmarklet](https://support.mozilla.org/en-US/kb/bookmarklets-perform-common-web-page-tasks) by creating a Bookmark or Favorite in your browser with the following code as the URL:

`javascript:var scr=document.createElement('script');scr.src='https://rawgit.com/adamhwang/ita-matrix-powertools/master/script_minified.js';document.body.appendChild(scr);`

![ITA Buy Bookmarklet example GIF](http://i.imgur.com/q5ttPrY.gif)

### Files

- `ita-matrix-powertools.user.js` -- Main userscript, install using a browser userscript manager (such as Greasemonkey or Tampermonkey) or utilize directly in your browser's debug console.
- `script_minified.js` -- Compact, paste-able version of the script for pasting in the debug console.

### Contribution Guide

1. Fork it!
1. Run `npm install` to install dependencies
1. Update javascript files `./src` _(the main userscript is now auto-generated)_
1. Bump version number in `package.json`
1. Add change log
1. Build the userscript with `npm run build`
1. Commit and create PR

Thanks to all that have [contributed](./AUTHORS) so far!

### Latest major changes

[Refer to the Changelog](./changelog.md)
