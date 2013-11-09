exports.crawlDomain = crawlDomain;

var Crawler = require('Crawler').Crawler;
var Url = require('url');

var encountered_pages = new Array();
var domains = new Array();

var test_crawler = new Crawler({
    "maxConnections" : 10,
    "callback" : function(error, result, $) {
        if (error)
        {
            logMessage("Error crawling: " + JSON.stringify(error));
        }
        else
        {
            processPage(result, $);
        }
    },
    "onDrain" : function() {
        logMessage("===============================================");
        logMessage("Finished crawling all domains");
        logMessage("=================================================");
    }
});

function normalizeUrl(url_string)
{
    var url = Url.parse(url_string);
    var normal = url.protocol + "//" + url.host + url.path;
    return normal;
}

function isNewDomainPage(url_string)
{
    var url = Url.parse(url_string);
    var domain_name = url.protocol + "//" + url.hostname;
    
    if (domains.indexOf(domain_name) == -1)
    {
        return false;
    }
    else
    {
        return encountered_pages.indexOf(url_string) == -1;
    }
}

function crawlDomain(url)
{
    domains.push(url);
    crawlPage(url);
}

function crawlPage(url)
{
    encountered_pages.push(url);
    test_crawler.queue(url);
}

function processPage(result, $)
{
    logMessage("Crawled page: " + result.uri)
    
    if ($)
    {
        $("a").each(function (index, link) {
            var linked_url = normalizeUrl(link.href);
            if (isNewDomainPage(linked_url))
            {
                logMessage("   Crawling link: " + linked_url);
                crawlPage(linked_url);
            }
        });
    }
}

function logMessage(message)
{
    console.log("DomainCrawler | " + message);
}