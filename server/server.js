var Representation = require('./representation');
var Results = require('./results');
var DomainCrawler = require('./domain_crawler').DomainCrawler;
var Http = require('http');
var Url = require('url');

var crawl_interval = 24 * 60 * 60 * 1000; // in millis

var crawlers = new Array();
crawlers.push(new DomainCrawler('http://www.tamu.edu'));

function requestHandler(request, response) {
    var url = Url.parse(request.url, true);
    var resource = url.pathname;
    var page_url = url.query["page_url"];
    
    if (request.method == "GET" && resource == "/links") {
        log("Processing request for " + request.method + " " + resource);
        
        if (page_url) {
            log("Retrieving link results for " + page_url);
            var result = getPageResult(page_url);
        
            response.statusCode = 200;
            response.end(JSON.stringify(result, null, 4));
        }
        else {
            log("Bad query parameters received for " + request.method + " " + resource);
            response.statusCode = 400;
            response.end();
        }
        
    }
    else {
        log("Invalid request received for " + request.method + " " + resource);
        response.statusCode = 501;
        response.end();
    }
}

function getPageResult(url) {
    var result = new Results.PageResult(url);
    
    for (var i = 0; i < crawlers.length; i++) {
        var crawler = crawlers[i];
        
        if (crawler.isSameDomain(url)) {
            result = new Results.PageResult(url, crawler.representation);
        }
    }
    
    return result;
}

function finishedCrawling(crawler) {
    // Start the crawler again in a day
    setTimeout(function() {
        crawler.start(function() {
            finishedCrawling(crawler);
        });
    }, crawl_interval);
}

function log(message) {
    console.log("Server | " + message);
}

Http.createServer(requestHandler).listen(8080);

// Crawl each domain once per day
for (var i = 0; i < crawlers.length; i++) {
    var crawler = crawlers[i];

    var elapsed = crawler.timeSinceLastCrawl();
    if (elapsed >= crawl_interval) {
        crawler.start(function() {
            finishedCrawling(crawler);
        });
    }
    else {
        setTimeout(finishedCrawling, crawl_interval - elapsed, crawler);
    }
}