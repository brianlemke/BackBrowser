exports.DomainCrawler = DomainCrawler;

var Crawler = require('crawler').Crawler;
var Url = require('url');
var Robots = require('robots');
var Representation = require('./representation');
var Ranker = require('./page_ranker');

function DomainCrawler(domain_url) {
    this.domain = domain_url;
    this.representation = new Representation.Domain(domain_url);
    
    var self = this;
    
    this.user_agent = "BackBrowserBot";
    
    this.crawler = new Crawler({
        "maxConnections" : 10,
        "headers" : { "User-Agent" : this.user_agent },
        "callback" : function(error, result, $) {
            self.processPage(error, result, $);
        },
        "onDrain" : function() {
            self.finishCallback();
        }
    });
}

DomainCrawler.prototype.user_agent = "";
DomainCrawler.prototype.domain = "";
DomainCrawler.prototype.num_queued = 0;
DomainCrawler.prototype.encountered = new Array();
DomainCrawler.prototype.representation = null;
DomainCrawler.prototype.robot_checker = null;

DomainCrawler.prototype.processPage = function(error, result, $) {
    this.num_queued--;
    
    if (error) {
        this.log(error);
    }
    else {
        this.log("Crawled page: " + result.uri + " (" + this.num_queued + ")");
        
        var page = new Representation.Page(result.uri);
        
        if ($) {
            var self = this;
            $("a").each(function (index, link) {
                var linked_url = self.normalizeUrl(link.href);
                
                if (self.isSameDomain(linked_url)) {
                    // Make sure the site's robots.txt allows us to crawl this
                    if (!self.isEncountered(linked_url)) {
                        self.encountered.push(linked_url);
                        
                        if (self.isAllowedPage(linked_url)) {
                            page.addOutLink(linked_url);
                            self.log("    Crawling link: " + linked_url);
                            self.crawlPage(linked_url);
                        }
                        else {
                            self.log("    Denied crawl: " + linked_url);
                        }
                    }
                }
            });
        }
        
        this.representation.addPage(page);
    }
};

DomainCrawler.prototype.start = function(finish_callback) {
    this.encountered = new Array();
    
    this.log("============================================================");
    this.log("Starting to crawl domain " + this.domain);
    this.log("============================================================");
    
    var self = this;
    
    // Set the callback that will be invoked when the domain is fully crawled
    this.finishCallback = function() {
        self.log("============================================================");
        self.log("Finished crawling domain " + self.domain);
        self.log("============================================================");
        
        self.representation.populateBackLinks();
        Ranker.rankPages(self.representation);
        self.representation.last_crawled = new Date();
        
        self.representation.dump(function() {
            if (finish_callback) {
                finish_callback();
            }
        });
    };
    
    // Attempt to fetch and parse the site's robots.txt file
    var robots_file = this.domain + '/robots.txt';
    var robot_parser = new Robots.RobotsParser(robots_file,
        self.user_agent, function (parser, success) {
        if (success) {
            self.log("Successfully parsed robots.txt for " + self.domain);
            self.robot_checker = parser;
        }
        else {
            self.log("Failed to parse robots.txt for " + self.domain);
            self.robot_checker = null;
        }
        
        // Regardless of whether we got the robots.txt, start the crawl
        self.crawlPage(self.domain);
    });
};

DomainCrawler.prototype.crawlPage = function(url_string) {
    this.num_queued++;
    this.crawler.queue(url_string);
};

DomainCrawler.prototype.normalizeUrl = function(url_string) {
    var url = Url.parse(url_string);
    var normalized = url.protocol + "//" + url.host + url.pathname;
    return normalized;
};

DomainCrawler.prototype.isSameDomain = function(url_string) {
    var url = Url.parse(url_string);
    var url_domain = url.protocol + "//" + url.hostname;
    
    return url_domain == this.domain;
};

DomainCrawler.prototype.isEncountered = function(url_string) {
    if (this.encountered.indexOf(url_string) == -1) {
        return false;
    }
    else {
        return true;
    }
};

DomainCrawler.prototype.isAllowedPage = function(url_string) {
   if (this.robot_checker) {
       return this.robot_checker.canFetchSync(this.user_agent, url_string);
   }
   else {
       // Always allow the page if we don't have a robots.txt parser
       return true;
   }
};

DomainCrawler.prototype.timeSinceLastCrawl = function() {
    return (new Date() - this.representation.last_crawled);
};

DomainCrawler.prototype.hasBeenCrawled = function() {
    return this.representation.last_crawled > 0;
};

DomainCrawler.prototype.log = function(message) {
    console.log("DomainCrawler | " + message);
};