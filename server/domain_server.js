exports.DomainServer = DomainServer

var Representation = require('./representation');
var Results = require('./results');
var DomainCrawler = require('./domain_crawler').DomainCrawler;
var Http = require('http');
var Url = require('url');

function DomainServer() {
    this.domains = new Array();
    var self = this;
    this.http_server = new Http.createServer(function(request, response) {
        self.requestHandler(request, response);
    });
}

DomainServer.prototype.domains = null;
DomainServer.prototype.http_server = null;

DomainServer.prototype.addOrUpdateDomain = function(domain) {
    // Update the domain if it already exists
    for (var i = 0; i < this.domains.length; i++) {
        if (this.domains[i].url == domain.url) {
            this.domains[i] = domain;
            return;
        }
    }
    
    // The domain does not already exist, so add it
    this.domains.push(domain);
};

DomainServer.prototype.startServer = function(port) {
    this.log("Starting server on port " + port);
    this.http_server.listen(port);
};

DomainServer.prototype.requestHandler = function(request, response) {
    var url = Url.parse(request.url, true);
    var method = request.method;
    var resource = url.pathname;
    
    // Check if this is a request we recognize
    if (method == "GET" && resource == "/links") {
        this.log("Processing request for " + method + " " + resource);

        var page_url = url.query["page_url"];
        if (page_url) {
            var result = this.getPageResult(page_url);
            
            response.statusCode = 200;
            response.end(JSON.stringify(result, null, 4));
        }
        else {
            this.log("Bad query parameters received for " + method + " " + resource);
            response.statusCode = 400;
            response.end();
        }
    }
    else {
        this.log("Unknown request received for " + method + " " + resource);
        response.statusCode = 501;
        response.end();
    }
};

DomainServer.prototype.getPageResult = function(url) {
    var result = new Results.PageResult(url);
    
    for (var i = 0; i < this.domains.length; i++) {
        var domain = this.domains[i];
        
        var page = domain.getPage(url);
        if (page) {
            result = new Results.PageResult(url, domain);
            break;
        }
    }
    
    return result;
};

DomainServer.prototype.log = function(message) {
    console.log("Server | " + message);
};