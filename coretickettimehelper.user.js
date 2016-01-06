// ==UserScript==
// @name CORE Ticket Time Helper
// @author David Wittman (david.wittman@rackspace.com)
// @namespace rackspace.com
// @version 0.1
// @include https://core.rackspace.com/py/ticket/popupAddComment.pt*
// ==/UserScript==

var defaultOptionText = "Free Troubleshooting",
    i = 0,
    billableWorkDropdown = document.getElementById('FORMABLE::log_wizard_form::type_free'),
    logWorkTab = document.getElementById('log_work_tab');

var workTabObserver = new MutationObserver(function(mutations) {
    for (i = 0; i < billableWorkDropdown.children.length; i++) {
        if (billableWorkDropdown.children[i].innerHTML === defaultOptionText) {
            billableWorkDropdown.children[i].selected = true;
            break;
        }
    }
    document.getElementById('FORMABLE::log_wizard_form::minutes').value = 10;
    document.getElementById('FORMABLE::log_wizard_form::units').value = 1;
    workTabObserver.disconnect();
});

workTabObserver.observe(logWorkTab, {attributes: true});