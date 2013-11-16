// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
    // If the URL contains wikia, will change later when server returns JSON indicating whether it should be displayed or not...
     if (tab.url.indexOf("wikia")!==-1) {
        // ... show the page action (icon).
        chrome.pageAction.show(tabId);

    }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);
// Listen for any changes to the URL of any tab.



var Backbrowser = {
    /** stores the json */
        linkjson:'',
    /**
     * Requests the JSON data from the server
     */
        requestLinks: function() {

            /** linkjson= getdatafromserver() */

            this.showLinks();

        },
    /**
     * Displays the data in html
     */
        showLinks: function () {

            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
                var currentURL = "http://"+(tabs[0].url); /** gets the current URL the user is on */

                var e = document.createElement('p');      /**creates paragraph in html, will display the in links*/
                var etext=document.createTextNode("In Links");
                e.appendChild(etext);
                document.body.appendChild(e);


            for ( var i =0; i<2;i++){                    /**will iterate through the JSONs to display the links*/
                var a = document.createElement('a');     /* anchor tag, creates the various links to be displayed */
                var linkText = document.createTextNode(currentURL);
                a.appendChild(linkText);
                a.title = currentURL;
                a.href = currentURL
                document.body.appendChild(a);
                var c = document.createElement('br');
                document.body.appendChild(c);
            }
                var details=document.createElement('details');          /**in progress, currently trying to get a expand/collapse */
                var summary=document.createElement('summary');
                var p=document.createElement('p');




                var k = document.createElement('a');
                var linkText4 = document.createTextNode(currentURL);
                k.appendChild(linkText4);
                k.title = currentURL;
                k.href = currentURL;
                summary.appendChild(k);

                var collink=document.createElement('a');
                var linkText5 = document.createTextNode(currentURL);
                collink.appendChild(linkText5);
                collink.title = currentURL;
                collink.href = currentURL;
                p.appendChild(collink);


                details.appendChild(summary);
                details.appendChild(p);

                document.body.appendChild(details);                     /* end of tree structure testing */


                var s = document.createElement('br');                   /*displays the out links, will also iterate through JSON */
                document.body.appendChild(s);

                var out = document.createElement('p');                  /**creates paragraph in html, will display the in links*/
                var outtext=document.createTextNode("Out Links");
                out.appendChild(outtext);
                document.body.appendChild(out);

                var f = document.createElement('a');                    /* anchor tag, creates the various links to be displayed */
                var linkText3 = document.createTextNode(currentURL);
                f.appendChild(linkText3);
                f.title = currentURL;
                f.href = currentURL;
                document.body.appendChild(f);




            });

        }
        };





document.addEventListener('DOMContentLoaded', function () {
    Backbrowser.requestLinks();
});


