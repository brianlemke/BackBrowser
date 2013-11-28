#BackBrowser

##Overview

BackBrowser is an intra-domain bidirectional browser system, which allows users
of an indexed web domain to browse both forwards and backwards over the graph
structure of the site.

The basic idea is that the server crawls and indexes all the pages within a
limited set of domains. The server maintains a database of all intra-domain
links on the web site, and accepts HTTP requests for sites that link to a given
page and sites that are linked to by the given page.

The server provides JSON objects over HTTP, in response to requests from the
client. The client is implemented as a Chrome browser extension, which activates
for sites that are indexed by our server. When on an indexed site, clicking on
the extension icon will send a request to the server, and a window will pop up
displaying a ranked list of sites adjacent to the current site on the bidirectional
domain graph.

###Data Collection

The server dynamically crawls, indexes, and ranks arbitrary domains. It starts
with a seed URL of each domain (typically the index at the root of the domain),
and crawls all pages that are reachable via intra-domain HTML links. Upon
downloading every HTML page, the server parses all links on the page and adds
any unknown intra-domain links to the crawler queue. Any non-HTML pages are
added to the index, but no additional data is extracted.

Once the crawler queue is exhausted (indicating that there are no reachable
pages that we have not crawled) the server propagates all links backward
throughout the graph. That is, for every page that has an out-link to another
page, the algorithm adds an in-link to the target page pointing back to the
linking page. The end result is a graph where each node knows all of the nodes
adjacent to it via either in or out links.

###Core Algorithm

The data collection and indexing really makes up the bulk of our project. However,
we do perform an inverse PageRank to order the links results that are returned by
the server and displayed by the user. Essentially, the server runs a standard
PageRank algorithm over the link graph of the domain, and then orders the lists
of in and out links for each page based on the ascending PageRank -- that is, the
pages with the smallest PageRank appear first in the list.

The server performs this step after completing the crawl and populating the link
graph. The PageRank is the final step before the server takes the index live and
begins responding to queries with link results. The Chrome extension simply
displays the links in the order that the server sends them -- the algorithm is
implemented entirely in the server.

##Heroku Deployment

The server has already been deployed to the Heroku platform. It is availabled at

    http://backbrowser.herokuapp.com:80

The server on Heroku currently indexes www.tamu.edu and www.clearbrookband.org
(note that the www part is very important -- the server considers www.tamu.edu
as a different domain than tamu.edu).

Note that the server is a JSON API, not a web server. It is designed to be used
in the background by the Chrome extension, not directly by a user. The Chrome
extension is currently hardcoded to connect to the Heroku deployment (although
this can be easily changed by modifying one of the source files -- see below).

##Server Install

The server is a node.js application that handles all data collection, indexing,
and ranking. Our core algorithm is implemented in this module. All server code
is contained in the server/ folder in the root of this repository.

The server requires npm and node.js to be installed (recent versions of each,
preferably). All library dependencies may be installed by typing

    npm install

in the server folder (this will install dependencies, primarily node-crawler,
in the node_modules folder). Once dependencies are installed, start the server
by typing

    node app.js

in the same directory as the app.js file. Alternatively, if you have foreman
installed, type <code>foreman start</code>.

When the server starts up, it will crawl, index and rank the domains listed
in the <code>initial_domains</code> array in app.js. By default, these two
domains are <code>www.tamu.edu</code> and <code>www.clearbrookband.org</code>.
At any point, including during crawl, the server will accept HTTP queries of the
form

    GET http://[host]:[port]/links?page_url=[full_page_url]

and return a JSON object with any results, including a field that says whether
the site has been indexed or not. This query will return no results while a site
is being indexed, but will start returning in and out links for indexed sites
as soon as the server logs indicate that indexing is finished. Note that the server
logs what port it is listening on (usually 8080, but it may be different if using
foreman or a hosting service like Heroku) immediately upon starting up.

The server will cache crawl results to file once it is finished, and periodically
re-crawl based on elapsed time since the last crawl. If the server quits and is
restarted, it will attempt to load domains from the cache instead of re-crawling
them.

##Client Install

The client is implemented as a Chrome extension. In order to install the extension
in the Chrome browser, go to the Extensions preference screen and select 'Developer
mode'. Then, click 'Load unpacked extension...' and select the chromeextension/
folder. Once installed, the Chrome extension will automatically send queries to the
server whenever the current page changes, and will activate by showing a blue arrow
in the Omnibox whenever the server reply indicates that the current page is indexed.

Note that the extension is currently hardcoded to connect to our Heroku deployment
of the server. This can be changed by changing the URL in <code>checkForValidUrl</code>
in background.js (for instance, to <code>http://localhost:8080</code>).