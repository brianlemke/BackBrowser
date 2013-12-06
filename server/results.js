exports.PageResult = PageResult;
exports.LinkResult = LinkResult;

function PageResult(url, domain) {
    this.url = url;
    
    if (domain && domain.getPage(url)) {
        var page = domain.getPage(url);
        
        this.crawled = true;
        this.in_links = new Array();
        this.out_links = new Array();
        
        for (var i = 0; i < page.in_links.length; i++) {
            var in_page = domain.getPage(page.in_links[i]);
            if (in_page) {
                this.in_links.push(new LinkResult(in_page));
            }
        }
        
        for (var i = 0; i < page.out_links.length; i++) {
            var out_page = domain.getPage(page.out_links[i]);
            if (out_page) {
                this.out_links.push(new LinkResult(out_page));
            }
        }
    }
    else {
        this.crawled = false;
        this.in_links = new Array();
        this.out_links = new Array();
    }
}

function LinkResult(page) {
    this.url = page.url;
    this.title = page.title;
}