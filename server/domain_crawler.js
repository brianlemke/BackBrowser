exports.DomainCrawler = DomainCrawler;

var Crawler = require('Crawler').Crawler;
var Url = require('url');

function DomainCrawler(domain_url) {
    this.domain = domain_url;
    this.encountered = new Array();
    
    var self = this;
    
    this.crawler = new Crawler({
        "maxConnections" : 10,
        "headers" : { "User-Agent" : "BackBrowserBot" },
        "callback" : function(error, result, $) {
            self.processPage(error, result, $);
        },
        "onDrain" : function() {
            self.finishCallback();
        }
    });
}

DomainCrawler.prototype.processPage = function(error, result, $) {
    if (error) {
        this.log(JSON.serialize(error));
    }
    else {
        this.log("Crawled page: " + result.uri)
        
        if ($) {
            var self = this;
            $("a").each(function (index, link) {
                var linked_url = self.normalizeUrl(link.href);
                if (self.isSameDomain(linked_url) && !self.isEncountered(linked_url)) {
                    self.log("    Crawling link: " + linked_url);
                    self.crawlPage(linked_url);
                }
            });
        }
    }
};

DomainCrawler.prototype.start = function(finish_callback) {
    this.log("============================================================");
    this.log("Starting to crawl domain " + this.domain);
    this.log("============================================================");
    
    var self = this;
    this.finishCallback = function() {
        self.log("============================================================");
        self.log("Finished crawling domain " + self.domain);
        self.log("============================================================");
        
        if (finish_callback) {
            finish_callback();
        }
    };
    
    this.crawlPage(this.domain);
};

DomainCrawler.prototype.crawlPage = function(url_string) {
    this.encountered.push(url_string);
    this.crawler.queue(url_string);
};

DomainCrawler.prototype.normalizeUrl = function(url_string) {
    var url = Url.parse(url_string);
    var normalized = url.protocol + "//" + url.host + url.path;
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

DomainCrawler.prototype.log = function(message) {
    console.log("DomainCrawler | " + message);
};