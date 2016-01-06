// ==UserScript==
// @name           CORE Ticket View Monospace Fix
// @namespace      http://pointlessconjecture.com/rackscripts/
// @include        https://core.rackspace.com/py/ticket/view.pt*
// @include        https://core.rackspace.com/ticket/*
// ==/UserScript==
// Author: Russell Lambert <russell.lambert@rackspace.com>
//  This script modifies the CSS style for ticket comments so they are monospace and pre-wrap
// so that formatted output displays correctly (as it does for the customer).

var journalTable = document.getElementById('journal_content');
var commentsTable = journalTable.rows[2].getElementsByTagName('table')[0];
var monospaceButton, monospaceButtonBottom, savedCommentsTable;

function monospaceComments() {
    // This code does destructive search/replace.  Save a copy of the old table for the "Unmonospace" function.
    savedCommentsTable = commentsTable.cloneNode(true);

    var commentsRow = commentsTable.rows;
    for(var i=0;i<commentsRow.length;i++) {
        var myTD = commentsRow[i].getElementsByTagName('td');
        // Real comment fields only have 1 <td> (versus Assignment and header rows).
        // Also, don't monospace inner bordered info boxes or green automated comments
        if(myTD.length == 1 && myTD[0].style.border == "" && commentsRow[i].style.backgroundColor != "rgb(238, 255, 238)") {
            //  myRackspace generated comments only use "<br>" tags.  CORE-generated comments use
            // " \n<BR>".  This appears to be the results of a CORE hack where "\n" is replaced
            // with "\n<BR>". Replace "\n<BR>" with "\n" so CORE-generated comments don't look
            // retardedly spaced-out when the monospace fix is applied.
            myTD[0].innerHTML = myTD[0].innerHTML.replace(new RegExp("\\n<br>","g"), "\n");

            // Set the CSS style to something that makes more sense.
            myTD[0].style.whiteSpace = "pre-wrap";
            myTD[0].style.fontFamily = "monospace";
            myTD[0].style.overflowX = "scroll";
            myTD[0].style.overflowY = "scroll";
            myTD[0].style.paddingTop = "1px";
            myTD[0].style.paddingLeft = "1px";
            myTD[0].style.paddingRight = "1px";
            myTD[0].style.paddingBottom = "1px";
            // myTD[0].style.marginRight = "1px";
        }
    }
}

function unMonospaceComments() {
    // Replace the comments table with the saved copy.
    commentsTable.parentNode.replaceChild(savedCommentsTable,commentsTable);
    // Update the commentsTable pointer so re-Monospacing works properly.
    commentsTable = savedCommentsTable;
}

function monospaceButton_onClick(event) {
    if(monospaceButton.innerHTML == "Monospace") {
        monospaceComments();
        monospaceButtonBottom.innerHTML = monospaceButton.innerHTML = "Unmonospace";
    } else {
        unMonospaceComments();
        monospaceButtonBottom.innerHTML = monospaceButton.innerHTML = "Monospace";
    }
}

monospaceButton = document.createElement('a');
monospaceButton.target = '_blank';
monospaceButton.innerHTML = "Monospace";
monospaceButton.style.color="blue";
monospaceButton.className="text_button";

monospaceButtonBottom = monospaceButton.cloneNode(true);

monospaceButton.addEventListener("click", monospaceButton_onClick, false);
monospaceButtonBottom.addEventListener("click", monospaceButton_onClick, false);

// Insert this link before the "Add Private Comment" button on the left side at the top of the page.
var insertSpot = journalTable.rows[2].getElementsByTagName('span')[1];
insertSpot.insertBefore(monospaceButton,insertSpot.firstChild);
// Insert a copy at the same spot at the bottom of the page.
insertSpot = journalTable.rows[2].getElementsByTagName('span')[journalTable.rows[2].getElementsByTagName('span').length-1];
insertSpot.insertBefore(monospaceButtonBottom,insertSpot.firstChild);

// If you want Monospace to be the default behavior and the button to initially read "Unmonospace",
// just uncomment this
// monospaceButton_onClick();

