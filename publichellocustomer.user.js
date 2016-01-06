// ==UserScript==
// @name           Public Hello Customer
// @namespace      http://pointlessconjecture.com/rackscripts/
// @description    Automatically inserts "Hello <Customer Name>," into public comments.
// @include        https://core.rackspace.com/py/ticket/popupAddComment.pt?ref_no=*&public=1
// @include        https://core.rackspace.com/py/ticket/popupAddComment.pt?public=1&ref_no=*
// ==/UserScript==

var signature = "\n\nRegards,\nJordan Callicoat\nOpenstack Engineer\nThe Rackspace Cloud";

var commentFields = document.getElementById('comment_content').getElementsByClassName('comment_field1');
var commentArea   = document.getElementsByName('comment')[0];
var requesterList;


// Find the collection of "Requested By:" user <A> links.
for(var i=0; i<commentFields.length; i++) {
    if(commentFields[i].innerHTML == "<b>Requested By:</b>") {
        requesterList = commentFields[i].parentNode.getElementsByTagName('td')[0].getElementsByTagName('a');
    }
}

// Create a form in case there's more than one possibility.
var newForm   = document.createElement('form');
var selectBox = document.createElement('select');
var chooseNameOption = document.createElement('option');

function recipientSelect_onClick(event) {
    if(this.options[this.selectedIndex].value != "") {
        var commentLength = commentArea.value.length;
        commentArea.value = commentArea.value.replace(/^Hello.*,\n/,"Hello " + this.options[this.selectedIndex].value + ",\n");
        commentArea.parentNode.removeChild(newForm);
        moveCursor(commentArea, 8 + (commentArea.value.length - commentLength));
    }
}

function moveCursor(input, position) {
    if(input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(position, position);
    }
    else if (input.createTextRange) {
        var textRange = input.createTextRange();
        textRange.collapse(true);
        textRange.moveEnd('character', position);
        textRange.moveStart('character', position);
        textRange.select();
    }
}

chooseNameOption.value = "";
chooseNameOption.text  = "- Choose Name -";
chooseNameOption.defaultSelected = true;
selectBox.appendChild(chooseNameOption);
selectBox.addEventListener("change", recipientSelect_onClick, false);

// This should never be undefined, but just in case...
if(requesterList) {
//     var custList = "";
    var custName = "";
    for(var i=0; i<requesterList.length; i++) {
        // Ignore Rackers
        if(requesterList[i].href.indexOf("employee") < 0) {
            custName = requesterList[i].innerHTML;
            // Strip off Last Name
            custName = custName.substr(0,custName.indexOf(" "));

            // Some people aren't the brightest when it comes to capitalization.  Standardize first char caps.
            custName = custName.substr(0,1).toUpperCase() + custName.substring(1,custName.length).toLowerCase();

            var newOption = document.createElement('option');
            newOption.value = custName;
            newOption.text  = custName;
            selectBox.appendChild(newOption);
        }
    }

    // If there's only one person, just insert that name.
    if(selectBox.length == 2) {
        commentArea.value = "Hi " + custName + ",\n\n";
    } else {
        // Either there's no recipients or we're putting in a select box.  In either case, insert something
        // generic so it doesn't look stupid if the user never picks somebody.  This will be search/replaced
        // later if they're using the dropdown.
        commentArea.value = "Hello,\n\n";
    }

    // If there's more than one valid choice, show the dropdown box we've been adding these choices to.
    if(selectBox.length > 2) {
        newForm.appendChild(selectBox);
        commentArea.parentNode.insertBefore(newForm,commentArea);
    }

} else {
    // For some reason, the script can't find the "Requested By" list, or there's no recipients.  Insert generic greeting.
    commentArea.value = "Hello,\n\n";
}

var commentLength = commentArea.value.length;

// Add signature
commentArea.value += signature;

// Move the cursor where it should be.
moveCursor(commentArea, commentLength);

