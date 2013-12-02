var DomainCrawler = require('./domain_crawler').DomainCrawler;
var DomainServer = require('./domain_server').DomainServer;
var Representation = require('./representation');

var crawl_interval = 24 * 60 * 60 * 1000; // in millis
var initial_domains = ['http://www.tamu.edu',
                       'http://www.clearbrookband.org',
                       'http://www.cse.tamu.edu'
                      ];
var domains_to_crawl = [];

var crawling = false;

var server = new DomainServer();
var port = process.env.PORT || 8080;
server.startServer(port);

for (var i = 0; i < initial_domains.length; i++) {
    domains_to_crawl.push(initial_domains[i]);
}

startNextCrawl();

function startNextCrawl() {
    if (domains_to_crawl.length > 0) {
        var url = domains_to_crawl.shift();
        var crawler = new DomainCrawler(url);
        var elapsed = crawler.timeSinceLastCrawl();

        if (elapsed >= crawl_interval) {
            crawling = true;
            crawler.start(function() {
                crawling = false;
                recordDomain(crawler.representation);
                stageNextCrawl(crawler);
            });
        }
        else {
            recordDomain(crawler.representation);
            stageNextCrawl(crawler);
        }
    }
}

function recordDomain(domain) {
    var domain_copy = new Representation.Domain();
    domain_copy.fromJSON(domain.toJSON());
    
    server.addOrUpdateDomain(domain_copy);
}

function stageNextCrawl(crawler) {
    var elapsed = crawler.timeSinceLastCrawl();
    setTimeout(function() {
        domains_to_crawl.push(crawler.domain);
        if (!crawling) {
            startNextCrawl();
        }
    }, crawl_interval - elapsed);
    
    startNextCrawl();
}