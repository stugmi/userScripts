// ==UserScript==
// @author              Smug
// @name                Twitter HD Videos
// @description         Rewrites the responses from m3u8 playlist to only give the highest quality video
// @version             1.0.0
// @match               https://twitter.com/*
// @grant               unsafeWindow
// ==/UserScript==

(function () {
    // outputs res for every rewrite
    let debug = false;
    // backup of original open function
    let realOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    // hook open()
    unsafeWindow.XMLHttpRequest.prototype.open = function(method, URL) {
        new RegExp(/video.twimg.com(.+).m3u8\?tag=.+/).test(URL) &&
            this.addEventListener('readystatechange', function(event) {
                if (this.readyState === 4) {
                    let original = event.target.responseText.split("\n");
                    // saving the header and last file in the m3u8 playlist which is the highest quality.
                    let head = original.slice(0, 2);
                    let body = original.slice(-3);
                    Object.defineProperty(this, 'response', { value: head.concat(body).join("\n") });
                    Object.defineProperty(this, 'responseText', { value: head.concat(body).join("\n") });
                    if (debug) console.log("%c[Twitter HD debug]", "color: #99ff5e;font-weight: 700;", `forced res ${body[0].split(",")[1].split("=")[1]} on ${URL}`);
                }
            });
        // after rewriting the response text we call the original open()
        return realOpen.apply(this, arguments);
    };
})();
