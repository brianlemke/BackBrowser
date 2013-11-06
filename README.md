BackBrowser
===========

Overview
--------

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