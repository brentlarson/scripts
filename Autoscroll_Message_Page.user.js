// ==UserScript==
// @name          Autoscroll Message Page
// @namespace     http://diveintogreasemonkey.org/download/
// @description   Automatically scrolls down the page when LiveLinks brings a new post
// @include       http://*.endoftheinter.net/showmessages.php*
// @include       https://*.endoftheinter.net/showmessages.php*
// ==/UserScript==

var scrollSpeed = 10; //How fast the page scrolls. Higher = faster. 10 is default.
var bottomDistance = 200; //The max distance from the bottom of the page for this to scroll. 200 is default.
var autoPage = true; //Set to false if you don't want to change the page automatically.

function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if (node === null)
		node = document;
	if (tag === null)
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (var i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

function gup(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(document.location.href);
  if (results == null) {
    return "";
  } else {
    return results[1];
  }
}

var originalMssgs = getElementsByClass('message-container', document.getElementById('u0_1'), 'div').length;
if (gup('page')) {
	var thisPage = parseInt(gup('page'));
} else {
	var thisPage = 1;
}

function scanForMore() {
	var totalPages = document.getElementById('u0_2').getElementsByTagName('span')[0].innerHTML;
	return totalPages;
}

function scrollPage(newHeight) {
	window.scrollBy(0, scrollSpeed);
	if (newHeight > 10) {
		window.setTimeout(scrollPage(newHeight - 10), 10);
	}
}


function check() {
	var totalMessageTops = getElementsByClass('message-container', document.getElementById('u0_1'), 'div');
	var messageTops = totalMessageTops.length;
	if (messageTops > originalMssgs) {
		var newMssgHeight = 0;
		for (var j = originalMssgs; j <= messageTops; j++) {
			newMssgHeight += totalMessageTops[j-1].clientHeight;
		}
		originalMssgs = messageTops;
		if ((window.pageYOffset + window.innerHeight + bottomDistance + newMssgHeight) >= document.body.clientHeight) {
			scrollPage(newMssgHeight);
		}
	} else {
		var newPages = scanForMore();
		if (newPages > thisPage) {
			window.clearInterval(checkMessages);
			if ((window.pageYOffset + window.innerHeight + bottomDistance) >= document.body.clientHeight && autoPage) {
				if (gup('page')) {
					var newUrl = document.location.href.replace(/page=[0-9]+/gi, 'page=' + (thisPage + 1));
				} else {
					var newUrl = document.location.href + "&page=2";
				}
				document.location = newUrl;
			}
		}
	}
}

if (thisPage == scanForMore()) {
	var checkMessages = window.setInterval(check, 250);
}
