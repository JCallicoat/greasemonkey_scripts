// ==UserScript==
// @id             core_alert_statuses
// @name           Alert on CORE ticket statuses
// @version        1.0
// @namespace      jcallicoat
// @author         Jordan Callicoat
// @description    Shows browser alert dialog for tickets matching certain statuses
// @include        https://core.rackspace.com/py/ticket/queueviews/monitor.pt*
// @grant          GM_get
// @grant          GM_set
// @run-at         document-end
// @require        http://code.jquery.com/jquery-1.7.1.min.js
// ==/UserScript==


// add other statuses to this array if you want alerts for them
var _statuses = ["New", "Unsolved", "Feedback Received"];

// array is compiled into a RegExp with alternations between items
var _regexp = new RegExp(_statuses.join("|"), "i");

var _alerts = [];
var _padding = 8;

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

String.prototype.rjust = function(count, pad) {
    if (typeof(pad) == "undefined") { pad = " "; }
    var out = this.trim();
    while (out.length < count) { out += pad; }
    return out;
}

$(".ticket_table_row").each(function() {
    var childs = $(this).children(), link;
    if (_regexp.test(childs[12].title)) {
        // for nucleus compatability
        if (childs[0].childNodes[0].nodeName == "A") {
            link = childs[0].childNodes[0];
        } else {
            link = childs[0].childNodes[1];
        }
        var ticket = link.href.split("/").pop();
        var status = childs[12].title.split(":")[0];
        var replied = childs[4].innerHTML;
        _alerts.push(replied.rjust(_padding) + "#" + ticket + " (" + status + ")");
    }
});

if (_alerts.length > 0) {
    alert("Ticket alert:\n" + _alerts.join("\n"));
}

