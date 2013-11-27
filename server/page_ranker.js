exports.rankPages = rankPages;

var teleport = 0.10;
var iterations = 100;

function rankPages(domain) {
    log("Starting PageRank for domain " + domain.url);
    assignInitialRanks(domain);
    
    for (var i = 0; i < iterations; i++) {
        updateRank(domain);
    }
    
    sortPageLinks(domain);
    
    log("PageRank finished for domain " + domain.url);
}

function assignInitialRanks(domain) {
    for (var i = 0; i < domain.pages.length; i++) {
        domain.pages[i].page_rank = 1.0;
    }
}

function updateRank(domain) {
    var new_scores = [];
    
    for (var i = 0; i < domain.pages.length; i++) {
        var page = domain.pages[i];
        var new_rank = teleport / domain.pages.length;
        for (var j = 0; j < page.in_links.length; j++) {
            var in_page = getPage(domain, page.in_links[j]);
            new_rank += (1.0 - teleport) * in_page.page_rank / in_page.out_links.length;
        }
        new_scores.push(new_rank);
    }
    
    for (var i = 0; i < new_scores.length; i++) {
        domain.pages[i].page_rank = new_scores[i];
    }
}

function getPage(domain, url) {
    for (var i = 0; i < domain.pages.length; i++) {
        if (domain.pages[i].url == url) {
            return domain.pages[i];
        }
    }
    
    return null;
}

function sortPageLinks(domain) {
    function predicate(a, b) {
        var pageA = domain.getPage(a);
        var pageB = domain.getPage(b);
        if (pageA.page_rank < pageB.page_rank) {
            return -1;
        }
        else if (pageA.page_rank > pageB.page_rank) {
            return 1;
        }
        else {
            return 0;
        }
    }
    
    for (var i = 0; i < domain.pages.length; i++) {
        var page = domain.pages[i];
        page.in_links.sort(predicate);
        page.out_links.sort(predicate);
    }
}

function log(message) {
    console.log("PageRanker | " + message);
}