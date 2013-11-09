var DomainCrawler = require("./domain_crawler").DomainCrawler;

var crawler = new DomainCrawler("http://www.tamu.edu");
crawler.start(function() {
    process.exit(0);
});