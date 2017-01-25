window.Helpers = window.Helpers || {};

window.Helpers.definedMboxes = {};

window.Helpers.onDom = function(callback) { document.addEventListener('DOMContentLoaded', callback) };
window.Helpers.getSica = function () { return window.s || window.s_one; };
window.Helpers.onSica = function (callback) {
    var maxIterations = 50;
    var interval = setInterval(function () {
        if (Helpers.getSica() != undefined) {
            clearInterval(interval);
            callback();
        } else {
            maxIterations--;
            if (maxIterations <= 0) {
                clearInterval(interval);
            }
        }
    }, 100);
};
window.Helpers.onDomAndSica = function (callback) {
    var domReady = false;
    var sicaReady = false;
    var execute = function () {
        if (domReady && sicaReady) {
            callback();
        }
    };
    Helpers.onDom(function () {
        domReady = true;
        execute();
    });
    Helpers.onSica(function () {
        sicaReady = true;
        execute();
    });
};

window.Helpers.mboxTrack = function (name) {
    if (typeof name === "undefined") return;

    if (!Helpers.definedMboxes[name]) {
      Helpers.definedMboxes[name] = true;
      mboxDefine("nada", name);
  }
  mboxUpdate(name);
};
window.Helpers.sicaLinkTrack = function (linkName, eVars) {
    if (typeof linkName === "undefined") return;

    var sica = Helpers.getSica();
    if (typeof eVars !== "undefined") {
        var evars = [];
        for (var eVar in eVars) {
            if (eVars.hasOwnProperty(eVar)) {
                var name = "eVar" + eVar;
                evars.push(name);
                sica[name] = eVars[eVar];
            }
        }
        if (evars.length > 0) sica.linkTrackVars = evars.join(",");
    }
    sica.tl(true, "o", linkName);
};

window.Helpers.executeClickDelayed = function(elements, before, after) {
    if (elements.length > 0) {
        for (var i = 0; i < elements.length; i++) {
            (function () {
                var route = false;
                var element = elements[i];
                element.addEventListener("click", function (e) {
                    if (!route) {
                        e.preventDefault();
                        e.stopPropagation();
                        route = !route;
                        if (typeof before !== "undefined") before();
                        setTimeout(function () { element.click(); }, 500);
                    } else {
                        route = !route;
                        if (typeof after !== "undefined") after();
                    }
                })
            })()
        }
    }
};
window.Helpers.trackClick = function(elements, mboxNames, sicaLinkName, sicaEvars) {
    Helpers.executeClickDelayed(elements, function () {
        mboxNames.forEach(function(mboxName) { Helpers.mboxTrack(mboxName); });
        Helpers.sicaLinkTrack(sicaLinkName, sicaEvars);
    });
};