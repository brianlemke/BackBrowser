
var result;



function checkForValidUrl(tabId, changeInfo, tab) {
    // If the URL contains wikia, will change later when server returns JSON indicating whether it should be displayed or not...
    //chrome.pageAction.show(tabId);


        $.getJSON("http://backbrowser.herokuapp.com/links?page_url="+tab.url,

            function(data){

                result=data;
                $.each(data, function( key, val ) {
                   // alert("here");
                    if(key=="crawled"&&val==true)
                    {
                        chrome.pageAction.show(tabId);  // ... show the page action (icon).
                    }



                });

            });


}
function checkForValidUrl2(info){

    chrome.tabs.get(info.tabId, function(tab) {


        $.getJSON("http://backbrowser.herokuapp.com/links?page_url="+tab.url,

            function(data){

                result=data;
                $.each(data, function( key, val ) {
                    // alert("here");
                    if(key=="crawled"&&val==true)
                    {
                        chrome.pageAction.show(tabId);  // ... show the page action (icon).
                    }



                });

            });
    });
}
chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.tabs.onActivated.addListener(checkForValidUrl2);