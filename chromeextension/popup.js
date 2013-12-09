/**
 * Created by Jeremy on 11/19/13.
 */
// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.

// Listen for any changes to the URL of any tab.
var count=0;
var in_links=[];
var out_links=[];
var in_links_title=[];
var out_links_title=[];
var result;
var x=0;
var y=0;

var Backbrowser = {


    /**
     * Requests the JSON data from the server
     */
    requestLinks: function() {
        data=chrome.extension.getBackgroundPage().result;
        $.each(data, function( key, val ) {

            if(key=="in_links"&&val!='')
            {
                $.each(val, function( key, val ){
                    $.each(val,function(key,val){
                        if(key=="url"){
                            in_links.push(val);
                        }
                        if(key=="title"){
                            in_links_title.push(val);
                        }
                    });
                });
            }

            if(key=="out_links"&&val!=''){
                $.each(val, function( key, val ){
                    $.each(val,function(key,val){
                        if(key=="url"){
                            out_links.push(val);

                        }
                        if(key=="title"){
                            out_links_title.push(val);
                        }
                    });
                });


            }



        });

        this.showLinks()
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
            a.style.width="790px";
            document.body.appendChild(a);     /**add it to the html */
            //alert(in_links.length.toString());
            for(var i=x;i<Math.min(x+5,in_links.length);i++)   {                /** test read 2 links in */

            var b = document.createElement('h3');  /** add header*/
            var c=  document.createElement('a');    /** create anchor  */
            var curl = document.createTextNode(in_links_title[i]);   /**create the url */
            c.appendChild(curl);
                c.title = in_links[i];                             /**set the title */
                c.href = in_links[i];                              /**set the URL */
                $(c).css("color", "#FFFFFF");
                b.appendChild(c);           /** add anchor to the header */
                a.appendChild(b);           /** add header to the div 'acord' */


                var d =document.createElement('div');  /** create the structure for accordion for the 2nd reading of in links*/
                d.className='acord';
                a.appendChild(d);



            }

            $('<br/>').appendTo(document.body);


            if(((x+5)<in_links.length&&in_links.length>5)){
                //alert(y.toString());
                //alert(x.toString());
                $('<button/>', {
                    text: "next",
                    id: 'in_next',

                    click: function () {  if ((x+5)<in_links.length&&in_links.length>5) x=x+5; document.body.innerHTML='';Backbrowser.showLinks();}
                }).css({'float':'right','background-color':'#0000FF','-moz-border-radius':'28px','-webkit-border-radius':'28px','border-radius':'28px','border':'1px solid #18ab29','display':'inline-block','cursor':'pointer','color':'#ffffff','font-family':'arial','font-size':'17px','padding':'16 px 31 px','text-decoration':'none','text-shadow':'0px 1 px 0 px #2f6627','margin-right':'1cm'}).hover(function(){$(this).css('background-color', '#0066FF');},function(){$(this).css('background-color', '#0000FF');}).appendTo(document.body);
            }
            if(((x-5)>=0&&in_links.length>5)){
                //alert(y.toString());
                //alert(x.toString());
                $('<button/>', {
                    text: "previous",
                    id: 'in_previous',

                    click: function () {  if((x-5)>=0&&in_links.length>5)  x=x-5;  document.body.innerHTML='';Backbrowser.showLinks();}
                }).css({'float':'left','background-color':'#0000FF','-moz-border-radius':'28px','-webkit-border-radius':'28px','border-radius':'28px','border':'1px solid #18ab29','display':'inline-block','cursor':'pointer','color':'#ffffff','font-family':'arial','font-size':'17px','padding':'16 px 31 px','text-decoration':'none','text-shadow':'0px 1 px 0 px #2f6627','margin-left':'.05cm'}).hover(function(){$(this).css('background-color', '#0066FF');},function(){$(this).css('background-color', '#0000FF');}).appendTo(document.body);
            }

            $('<br/>').appendTo(document.body);

            var outlinkheader = document.createElement('h2'); /** create the header for the initial reading in of in links*/
            var outlinkheaderText = document.createTextNode("Out links");//create the definition header text node.
            outlinkheader.appendChild(outlinkheaderText);//stick the text node to the dlHeader.
            document.body.appendChild(outlinkheader);//Add header to html.

            var g = document.createElement('div'); /** create the structure for accordion for the first reading of in links*/
            g.className='acord';
            g.style.width="790px";
            document.body.appendChild(g);     /**add it to the html */
            //alert(out_links.length.toString());
            for(var i=y;i<Math.min(y+5,out_links.length);i++)   {                /** test read 2 links in */

            var e = document.createElement('h3');  /** add header*/
            var f=  document.createElement('a');    /** create anchor  */
            var furl = document.createTextNode(out_links_title[i]);   /**create the url */

            f.appendChild(furl);
                f.title = out_links[i];                             /**set the title */
                f.href = out_links[i];                              /**set the URL */
                $(f).css("color", "#FFFFFF");
                e.appendChild(f);           /** add anchor to the header */
                g.appendChild(e);           /** add header to the div 'acord' */


                var d =document.createElement('div');  /** create the structure for accordion for the 2nd reading of in links*/
                d.className='acord';
                g.appendChild(d);



            }
            $('<br/>').appendTo(document.body);


            if(((y+5)<out_links.length&&out_links.length>5) ){
                //alert(y.toString());
                //alert(x.toString());
                $('<button/>', {
                    text: "next",
                    id: 'out_next',

                    click: function () {  if((y+5)<out_links.length&&out_links.length>5)  y=y+5; document.body.innerHTML='';Backbrowser.showLinks();}
                }).css({'float':'right','background-color':'#0000FF','-moz-border-radius':'28px','-webkit-border-radius':'28px','border-radius':'28px','border':'1px solid #18ab29','display':'inline-block','cursor':'pointer','color':'#ffffff','font-family':'arial','font-size':'17px','padding':'16 px 31 px','text-decoration':'none','text-shadow':'0px 1 px 0 px #2f6627','margin-right':'1cm'}).hover(function(){$(this).css('background-color', '#0066FF');},function(){$(this).css('background-color', '#0000FF');}).appendTo(document.body);
            }
            if(((y-5)>=0&&out_links.length>5)) {
                //alert(y.toString());
                //alert(x.toString());
                $('<button/>', {
                    text: "previous",
                    id: 'out_previous',

                    click: function () {  if((y-5)>=0&&out_links.length>5)  y=y-5;  document.body.innerHTML='';Backbrowser.showLinks();}
                }).css({'float':'left','background-color':'#0000FF','-moz-border-radius':'28px','-webkit-border-radius':'28px','border-radius':'28px','border':'1px solid #18ab29','display':'inline-block','cursor':'pointer','color':'#ffffff','font-family':'arial','font-size':'17px','padding':'16 px 31 px','text-decoration':'none','text-shadow':'0px 1 px 0 px #2f6627','margin-left':'.05cm'}).hover(function(){$(this).css('background-color', '#0066FF');},function(){$(this).css('background-color', '#0000FF');}).appendTo(document.body);
            }

            var js = document.createElement("script");          /**dynamically calls the accordion script*/

            js.type = "text/javascript";
            js.src = "accordion.js";

            document.body.appendChild(js);                      /**adds the call to html*/

            $('.acord h3').bind('click', function (e) {        /**bind clicks to the headers*/
                // bind to the the header / anchor clicks
            e.stopPropagation();

                //var active =$(".acord").accordion("option","active");  /**get the active panel index*/
                //    alert(active);
                //var header;



                // switch(active)                                       /**compare values of index*/
                //{
                //  case false:                                      /**if index is false, then send request to server*/
                // alert("opening");
                //   isthis.showmorelinks(this);
                //  break;
                //default:
                //  var header = $(".acord h3").eq(active);      /**if index is not false, then compare the values of the headers*/
                // if(header[0]!==this){                        /**if header is not equal*/
                //alert("opening");                       /**send request to server*/
                //isthis.showmorelinks(this);
                //}
                //}
            });
            $('.acord h3 a').hover( function(){
                    $(this).css('background-color', '#0066FF');
                },
                function(){
                    $(this).css('background-color', '#0000FF');
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

    window.innerWidth=800;
    window.innerHeight=1000;
    Backbrowser.requestLinks();  /**request the links */
});


