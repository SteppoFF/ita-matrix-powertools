# ita-matrix-powertools
Script for greasemonkey + ITA Matrix

[Main discussion thread at FlyerTalk Forums](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-userscript.html)

## Notice ##

```diff
- Double check your chosen flights before purchasing
- Some providers have limited support
- Current translations for the powertools interface: English, Deutsch
```

### Posts you should read ###

1. [General statement regarding this script](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-united-userscript-4.html#post24394534)
2. [How to fix class names yourself](http://www.flyertalk.com/forum/24807572-post119.html)
3. [Problems and limitations regarding pricing itineraries](http://www.flyertalk.com/forum/travel-tools/1623427-ita-purchase-fares-orbitz-delta-united-userscript-9.html#post24906119)

## Usage ##

Either add the script into your preferred userscript manager or copy the the RAW-Text into your debug console.
Using debug console, you may use the shortened minified version.
(Note: there is no need to re-execute the script on pagechange unless you reloaded the page)

### Tips ###
- Installing via a userscript manager simplifies saving your settings between sessions
- You can also create a [Bookmarklet](https://support.mozilla.org/en-US/kb/bookmarklets-perform-common-web-page-tasks) by creating a Bookmark or Favorite in your browser with the following code as the URL:

```javascript:var scr=document.createElement('script');scr.src='https://rawgit.com/SteppoFF/ita-matrix-powertools/master/script_minified.js';document.body.appendChild(scr);```

![ITA Buy Bookmarklet example GIF](http://i.imgur.com/q5ttPrY.gif)

### Files ###

`ita-matrix-powertools.user.js` -- Main userscript, install using a browser userscript manager (such as Greasemonkey or Tampermonkey) or utilize directly in your browser's debug console.

`script_minified.txt` --  Compact, paste-able version of the script for pasting in the debug console.

### Latest major changes ###

[Refer to the Changelog](./changelog.md)
