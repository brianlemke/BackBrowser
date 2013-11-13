var DomainCrawler = require("./domain_crawler").DomainCrawler;

var crawler = new DomainCrawler("http://www.tamu.edu");

if (crawler.timeSinceLastCrawl() > 60 * 60 * 1000) {
    crawler.start(function() {
        process.exit(0);
    });
}
else {
    log("Not crawling domain " + crawler.domain + ": last crawl was " + crawler.timeSinceLastCrawl() / 1000 + " seconds ago.");
}

function log(message) {
    console.log("Application | " + message);
};