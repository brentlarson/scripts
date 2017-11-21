// ==UserScript==
// @name         LL tweet embed
// @namespace    bjgood
// @version      0.1
// @description  embed tweets on ETI
// @author       bjgood
// @include      *boards.endoftheinter.net/showmessages.php*
// @require      https://platform.twitter.com/widgets.js
// @grant        none
// ==/UserScript==

(function() {

    //regex to match tweet url
    var tweetpattern = "twitter.com/[a-zA-Z0-9]+/status/([0-9]+)";

    //get all links in posts
    var links = document.querySelectorAll("[class='l']");

    //console.log("links.length=" + links.length);
    for (var i=0; i<links.length; i++){
        //console.log("loop count="+ i + " href=" + links[i].href);
        //check if each link is a tweet
        var matches =  links[i].href.match(tweetpattern);
        if (matches != null) {

            //create new div for the embedded tweet
            var tweetDiv = document.createElement('div');

            twttr.widgets.createTweet(
                matches[1],
                tweetDiv,
                {
                    theme: 'light'
                }
            )/*.then( function( el ) {
                console.log('Tweet added.');
                TODO: remove 10 pixel top/bottom margins (is there an argument I can pass to do this automatically?)
            })*/;

            //add the new tweet and remove the link
            links[i].parentNode.insertBefore(tweetDiv, links[i].nextSibling);
            links[i].parentNode.removeChild(links[i]);

        }
    }
})();
