/*
// Name   :jQuery Table of Content Treeview for Blogger
// Version	:1.0
// Date		:September, 19, 2011
// Author	:Hendriono
// URL		:modification-blog.blogspot.com
// Email 	:bloggertuneup@gmail.com
// Copyright (c) 2011 Hendriono (http://www.hendriono.web.id/)
// Thanks to Jörn Zaefferer (http://bassistance.de/) for jQuery Treeview Plugin
*/
var postTitle = new Array();
var postUrl = new Array();
var postDate = new Array();
var postLabels = new Array();
var sortBy = "titleasc";
var tocLoaded = false;
var postFilter = '';
var numberfeed = 0;

function jtoctree(json) {
    function getPostData() {
        if ("entry" in json.feed) {
            var numEntries = json.feed.entry.length;
            numberfeed = numEntries;
            ii = 0;
            for (var i = 0; i < numEntries; i++) {
                var entry = json.feed.entry[i];
                var posttitle = entry.title.$t;
                var postdate = entry.published.$t.substring(0, 10);
                var posturl;
                for (var k = 0; k < entry.link.length; k++) {
                    if (entry.link[k].rel == 'alternate') {
                        posturl = entry.link[k].href;
                        break
                    }
                }
                var pll = '';
                if ("category" in entry) {
                    for (var k = 0; k < entry.category.length; k++) {
                        pll = entry.category[k].term;
                        var l = pll.lastIndexOf(';');
                        if (l != -1) {
                            pll = pll.substring(0, l)
                        }
                        postLabels[ii] = pll;
                        postTitle[ii] = posttitle;
                        postDate[ii] = postdate;
                        postUrl[ii] = posturl;
                        ii = ii + 1
                    }
                }
            }
        }
    }
    getPostData();
    sortBy = "titleasc";
    sortPosts(sortBy);
    sortLabels();
    tocLoaded = true;
    displayToc();
}

function filterPosts(filter) {
    scroll(0, 0);
    postFilter = filter;
    displayToc(postFilter)
}

function allPosts() {
    sortLabels();
    postFilter = '';
    displayToc(postFilter)
}

function swapPosts(x, y) {
    var temp = postTitle[x];
    postTitle[x] = postTitle[y];
    postTitle[y] = temp;
    var temp = postDate[x];
    postDate[x] = postDate[y];
    postDate[y] = temp;
    var temp = postUrl[x];
    postUrl[x] = postUrl[y];
    postUrl[y] = temp;
    var temp = postLabels[x];
    postLabels[x] = postLabels[y];
    postLabels[y] = temp;
}

function sortPosts(sortBy) {
    swapPosts();
    for (var i = 0; i < postTitle.length - 1; i++) {
        for (var j = i + 1; j < postTitle.length; j++) {
            if (sortBy == "titleasc") {
                if (postTitle[i] > postTitle[j]) {
                    swapPosts(i, j)
                }
            }
            if (sortBy == "titledesc") {
                if (postTitle[i] < postTitle[j]) {
                    swapPosts(i, j)
                }
            }
            if (sortBy == "dateoldest") {
                if (postDate[i] > postDate[j]) {
                    swapPosts(i, j)
                }
            }
            if (sortBy == "datenewest") {
                if (postDate[i] < postDate[j]) {
                    swapPosts(i, j)
                }
            }
            if (sortBy == "orderlabel") {
                if (postLabels[i] > postLabels[j]) {
                    swapPosts(i, j)
                }
            }
        }
    }
}

function sortPosts2(firstvar, lastvar) {
    swapPosts();
    for (var i = firstvar; i < lastvar - 1; i++) {
        for (var j = i + 1; j < lastvar; j++) {
            if (postTitle[i] > postTitle[j]) {
                swapPosts(i, j)
            }
        }
    }
}

function sortLabels() {
    sortBy = "orderlabel";
    sortPosts(sortBy);
    var j = 0;
    var i = 0;
    while (i < postTitle.length) {
        kategori = postLabels[i];
        firsti = j;
        do {
            j = j + 1
        } while (postLabels[j] == kategori);
        i = j;
        sortPosts2(firsti, j);
        if (i > postTitle.length) break
    }
}

function displayToc() {
    var j = 0;
    var i = 0;
    document.write('<ul id="hitam" class="treeview-black filetree"><li class="branda"><span class="judafis">' + judul + '</span></li>');
    while (i < postTitle.length) {
        kategori = postLabels[i];
        document.write('<li><span class="folder">' + kategori + '</span>');
        document.write('<ul>');
        firsti = j;
        do {
            document.write('<li><span class="file"><a href="' + postUrl[j] + '">' + postTitle[j] + '</a></span>');
            document.write('</li>');
            j = j + 1
        } while (postLabels[j] == kategori);
        i = j;
        document.write('</ul></li>');
        sortPosts(firsti, j);
        if (i > postTitle.length) break
    }
    document.write('<li><span class="file"><a style="text-decoration: none; color:#000;" href="http://modification-blog.blogspot.com/" target="_blank" title="Grab this widget!">jToCTree</a></li>');
    document.write('</ul>')
}