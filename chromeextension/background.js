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
var count=0;
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
        requestmoreLinks:function(){

            /** linkjson= getdatafromserver() */
            this.showmorelinks();

        },
        showmorelinks: function(header){
            count=count+1;
            var isthis=this;

            for(var i=0;i<2;i++){
            var a = header.nextSibling;
            var b = document.createElement('h3');  /** add header*/
            var c=  document.createElement('a');    /** create anchor  */
            var curl = document.createTextNode('http://www.google2.com');   /**create the url */
            c.appendChild(curl);
            c.title = 'http://www.google.com';                             /**set the title */
            c.href = 'http://www.google.com';                              /**set the URL */
            b.appendChild(c);           /** add anchor to the header */
            a.appendChild(b);           /** add header to the div 'acord' */


            var d =document.createElement('div');  /** create the structure for accordion for the 2nd reading of in links*/
            d.className='acord';
            a.appendChild(d);
            }
            if(count!=2){
            $(".acord").accordion({
                header: ">h3",
                heightStyle: "content",
                active: false,
                collapsible: true



            });
            }



            $('.acord .acord h3').bind('click', function (e) {         /**bind clicks to the headers*/
            // bind to the the header / anchor clicks
            //e.stopPropagation();

            var active =$(".acord").accordion("option","active");  /**get the active panel index*/
            alert(active);
                var header;

                switch(active)                                       /**compare values of index*/
                {
                    case false:                                      /**if index is false, then send request to server*/
                        alert("opening");
                        isthis.showmorelinks(this);
                        break;
                    default:
                        var header = $(".acord h3").eq(active);      /**if index is not false, then compare the values of the headers*/
                        if(header[0]!==this){                        /**if header is not equal*/
                        alert("opening");                       /**send request to server*/
                        isthis.showmorelinks(this);
                        }
                }
            });

            $('.acord .acord h3 a').bind('click', function (e) {           /**bind clicks to the links*/
                // bind to the the header / anchor clicks
            e.stopPropagation();                                /**keep links from propogating and opening*/
            var href = e.currentTarget.href;                    /**get the link*/
            chrome.tabs.getSelected(null,function(tab) {
                chrome.tabs.update(tab.id, {url: href});        /**update the current chrome tab with the new link*/
                window.close();                                 // close the popup
            });

            });





        },
    /**
     * Displays the data in html
     */
        showLinks: function () {

            var isthis=this;

            chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

                /** read in in_links*/

                var inlinkheader = document.createElement('h2'); /** create the header for the initial reading in of in links*/
                var inlinkheaderText = document.createTextNode("In links");//create the definition header text node.
                inlinkheader.appendChild(inlinkheaderText);//stick the text node to the dlHeader.
                document.body.appendChild(inlinkheader);//Add header to html.

                var a = document.createElement('div'); /** create the structure for accordion for the first reading of in links*/
                a.className='acord';
                document.body.appendChild(a);     /**add it to the html */

                for(var i=0;i<2;i++)   {                /** test read 2 links in */

                var b = document.createElement('h3');  /** add header*/
                var c=  document.createElement('a');    /** create anchor  */
                var curl = document.createTextNode('About Robots_'+ i.toString());   /**create the url */
                c.appendChild(curl);
                c.title = 'http://www.google.com';                             /**set the title */
                c.href = 'http://www.google.com';                              /**set the URL */
                  $(c).css("color", "#FFFFFF");
                b.appendChild(c);           /** add anchor to the header */
                a.appendChild(b);           /** add header to the div 'acord' */


                var d =document.createElement('div');  /** create the structure for accordion for the 2nd reading of in links*/
                d.className='acord';
                a.appendChild(d);



                }


                var outlinkheader = document.createElement('h2'); /** create the header for the initial reading in of in links*/
                var outlinkheaderText = document.createTextNode("Out links");//create the definition header text node.
                outlinkheader.appendChild(outlinkheaderText);//stick the text node to the dlHeader.
                document.body.appendChild(outlinkheader);//Add header to html.

                var g = document.createElement('div'); /** create the structure for accordion for the first reading of in links*/
                g.className='acord';
                document.body.appendChild(g);     /**add it to the html */

                for(var i=0;i<10;i++)   {                /** test read 2 links in */

                var e = document.createElement('h3');  /** add header*/
                var f=  document.createElement('a');    /** create anchor  */
                var furl = document.createTextNode('Star trek episode '+ i.toString());   /**create the url */
                $(f).css("color", "#FFFFFF");
                f.appendChild(furl);
                    f.title = 'http://entertainment.wikia.com/wiki/Star_Trek';                             /**set the title */
                    f.href = 'http://entertainment.wikia.com/wiki/Star_Trek';                              /**set the URL */
                    e.appendChild(f);           /** add anchor to the header */
                    g.appendChild(e);           /** add header to the div 'acord' */


                    var d =document.createElement('div');  /** create the structure for accordion for the 2nd reading of in links*/
                    d.className='acord';
                    g.appendChild(d);



                }

                var js = document.createElement("script");          /**dynamically calls the accordion script*/

                js.type = "text/javascript";
                js.src = "accordion.js";

                document.body.appendChild(js);                      /**adds the call to html*/

                $('.acord h3').bind('click', function (e) {        /**bind clicks to the headers*/
                    // bind to the the header / anchor clicks
                //e.stopPropagation();

                var active =$(".acord").accordion("option","active");  /**get the active panel index*/
                    alert(active);
                var header;

                   switch(active)                                       /**compare values of index*/
                   {
                       case false:                                      /**if index is false, then send request to server*/
                           alert("opening");
                           isthis.showmorelinks(this);
                           break;
                       default:
                           var header = $(".acord h3").eq(active);      /**if index is not false, then compare the values of the headers*/
                           if(header[0]!==this){                        /**if header is not equal*/
                                alert("opening");                       /**send request to server*/
                           isthis.showmorelinks(this);
                           }
                           }
                });

                $('.acord h3 a').bind('click', function (e) {           /**bind clicks to the links*/
                    // bind to the the header / anchor clicks
                    e.stopPropagation();                                /**keep links from propogating and opening*/
                    var href = e.currentTarget.href;                    /**get the link*/
                    chrome.tabs.getSelected(null,function(tab) {
                        chrome.tabs.update(tab.id, {url: href});        /**update the current chrome tab with the new link*/
                        window.close();                                 // close the popup
                    });

                });

                /*.getElementsByTagName("A")[0].bind('click',function(e){


                        recall("its still working");
                        window.location = $(this).attr('href');
                        return false;

                });*/
            });

        }
        };





document.addEventListener('DOMContentLoaded', function () {


    Backbrowser.requestLinks();  /**request the links */
});


