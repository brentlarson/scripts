// ==UserScript==
// @name         reddit fixer
// @namespace    bjgood
// @version      0.2
// @description  minor changes to reddit pages
// @author       You
// @include      https://www.reddit.com/*
// @exclude      https://www.reddit.com/chat/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //add here to limit a page to 25 entries
    var limit_25 = [
        "https://www.reddit.com/r/videos/",
        "https://www.reddit.com/r/hearthstone/",
    ];

    var limit_12 = [
        "https://www.reddit.com/r/4chan/",
    ];

    var limit = 0;

    //check which page we are on to know what the script should do
    //console.log("page url=" + document.location.href);
    if (limit_25.indexOf(document.location.href) >= 0) {
        limit = 25;
    } else if (limit_12.indexOf(document.location.href) >= 0) {
        limit = 12;
    }
    //console.log("my limit = " + limit);

    if (limit > 0) {
        //get all posts
        var divs = document.querySelectorAll("[id^='thing_']");
        //var count = 0;
        //console.log("before start of loop");

        //loop through each post
        for (var i=0; i<divs.length; i++){
            //console.log("start of loop index=" + i);

            //get each posts rank
            var rankspan = divs[i].querySelector("span[class^='rank']");
            if (rankspan != null) {
                var rank = rankspan.innerHTML;
                //console.log("rank=" + rank);

                //remove posts past rank 25
                if (rank > limit) {
                    divs[i].style.display = 'none';
                }
                //console.log("after checking for match");
            }
        }
    } else if (/https:\/\/www.reddit.com\/r\/[a-zA-Z0-9]+\/comments\/.*/.test(document.location.href)) {
        //console.log("reddit post found");
        var sitetable = document.querySelector("div[id='siteTable']");
        var postdivs = sitetable.querySelector("[id^='thing_']");
        //for (var j=0; j<postdivs.length; j++){
            //console.log("postdivs[" +j+ "].id=" + postdivs[j].id);
            //console.log("postdivs.id=" + postdivs.id);
            var title_a = postdivs.querySelector("a[class^='title ']");
            if (title_a != null) {
                var newLink = document.createElement('a');
                newLink.href = title_a.href;
                newLink.appendChild(document.createTextNode("Make purple"/*title_a.innerHTML*/));
                title_a.parentNode.insertBefore(newLink, title_a);
            }
        //}
    }
    //console.log("done with loop count=" + count);
    //alert("founds posts=" + count);
})();
