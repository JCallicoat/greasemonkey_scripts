// ==UserScript==
// @name          Ticket popup killer
// @namespace     http://jkoelker.emp.rackspace.com
// @description   Let you change ticket attributes without a popup
// @include       https://core.rackspace.com/ticket/*
// @include       https://core.rackspace.com/py/ticket/view.pt*
// ==/UserScript==

var debug_me = true;

// Expose our external object
unsafeWindow.gm_ticket_popup_killer = new Object();

// Expose our keybindings and the function they call
unsafeWindow.gm_ticket_popup_killer.keybindings = new Array();

unsafeWindow.gm_ticket_popup_killer.keybindings["q"] = function(){
    queue_list();
};
unsafeWindow.gm_ticket_popup_killer.keybindings["s"] = function(){
    subject_field();
};
unsafeWindow.gm_ticket_popup_killer.keybindings["v"] = function(){
    servers_form();
};
unsafeWindow.gm_ticket_popup_killer.keybindings["t"] = function(){
    status_form();
};
unsafeWindow.gm_ticket_popup_killer.keybindings["i"] = function(){
    priority_form();
};
unsafeWindow.gm_ticket_popup_killer.keybindings["a"] = function(){
    transfer_form();
};
unsafeWindow.gm_ticket_popup_killer.keybindings["e"] = function(){
    recipients_form();
};
unsafeWindow.gm_ticket_popup_killer.keybindings["y"] = function(){
    category_form();
};

// Expose our API for others ;) Share the love!
unsafeWindow.gm_ticket_popup_killer.queue = function(){
    queue_list();
};
unsafeWindow.gm_ticket_popup_killer.subject = function(){
    subject_field();
};
unsafeWindow.gm_ticket_popup_killer.servers = function(){
    servers_form();
};
unsafeWindow.gm_ticket_popup_killer.stat = function(){
    status_form();
};
unsafeWindow.gm_ticket_popup_killer.priority = function(){
    priority_form();
};
unsafeWindow.gm_ticket_popup_killer.assigned = function(){
    transfer_form();
};
unsafeWindow.gm_ticket_popup_killer.recipients = function(){
    recipients_form();
};
unsafeWindow.gm_ticket_popup_killer.category = function(){
    category_form();
};

// Let the VI keybinding extension know about us
if (!unsafeWindow.vi_keys)
    unsafeWindow.vi_keys = new Array();
unsafeWindow.vi_keys.push(unsafeWindow.gm_ticket_popup_killer);

var ref_no = unsafeWindow.Ticket.number;

var queues = new Array();
var queue_link, queue_td, queue_iframe, queue_alert_div = null;
var current_queue, queue_dc_alert_div = null;
var queue_form_name = "__Test_CORE_compliant_name_queue_form";
var queue_iframe_name = "__Test_CORE_compliant_name_queue_iframe";
var queue_select_name = "__Test_CORE_compliant_name_queue_select";
var queue_alert_div_name = "__Test_CORE_compliant_name_queue_alert_div";
var queue_dc_alert_div_name = "__Test_CORE_compliant_name_queue_dc_alert_div";
var queue_alert_text = "You don't have access to this queue.";
var queue_dc_alert_text = "Server(s) not in this DC.";

var queue_iframe_id = queue_iframe_name;
var queue_form_id = queue_form_name;
var queue_select_id = queue_select_name;
var queue_alert_div_id = queue_alert_div_name;
var queue_dc_alert_div_id = queue_dc_alert_div_name;

var subject_link, subject_td, current_subject, subject_iframe = null;
var subject = null;
var subject_iframe_name = "__Test_CORE_compliant_name_subject_iframe";
var subject_form_name = "__Test_CORE_compliant_name_subject_form";
var subject_input_name = "__Test_CORE_compliant_name_subject_input";

var subject_iframe_id = subject_iframe_name;
var subject_form_id = subject_form_name;
var subject_input_id = subject_input_name;

var servers_link, servers_td, current_servers, servers_iframe = null;
var servers = null;
var servers_iframe_name = "__Test_CORE_compliant_name_servers_iframe";
var servers_form_name = "__Test_CORE_compliant_name_servers_form";
var servers_stat_div_name_prefix = "__Test_CORE_compliant_name_servers_div_";
var servers_stat_odiv_name_prefix = "__Test_CORE_compliant_name_odiv_";
var servers_stat_idiv_name_prefix = "__Test_CORE_compliant_name_idiv_";

var servers_iframe_id = servers_iframe_name;
var servers_form_id = servers_form_name;
var servers_stat_div_id_prefix = servers_stat_div_name_prefix;
var servers_stat_odiv_id_prefix = servers_stat_odiv_name_prefix;
var servers_stat_idiv_id_prefix = servers_stat_idiv_name_prefix;

var servers_green_statuses = ["Online/Complete"];
var servers_blue_statuses = ["Order Submitted", "Received Contract"]
var servers_orange_statuses = ["Final Configuration / QC"]
var servers_grey_statuses = ["Computer No Longer Active"]
var servers_red_statuses = ["Under Repair", "Migration Server",
                            "Wait Suspension - Billing",
                            "Wait Suspension - Project", "Reactivation",
                            "Compromised: System/Root Level",
                            "Compromised: Application/User Level"]

var status_link, status_td, current_status, status_iframe = null;
var status_iframe_name = "__Test_CORE_compliant_name_status_iframe";
var status_form_name = "__Test_CORE_compliant_name_status_form";
var status_input_name = "__Test_CORE_compliant_name_status_input";
var status_select_name = "__Test_CORE_compliant_name_status_select";

var status_iframe_id = status_iframe_name;
var status_form_id = status_form_name;
var status_input_id = status_input_name;
var status_select_id = status_select_name;

var priority_link, priority_td, current_priority, priority_iframe = null;
var priority_iframe_name = "__Test_CORE_compliant_name_priority_iframe";
var priority_form_name = "__Test_CORE_compliant_name_priority_form";
var priority_input_name = "__Test_CORE_compliant_name_priority_input";
var priority_select_name = "__Test_CORE_compliant_name_priority_select";

var priority_iframe_id = priority_iframe_name;
var priority_form_id = priority_form_name;
var priority_input_id = priority_input_name;
var priority_select_id = priority_select_name;

var transfer_link, transfer_td, current_transfer, transfer_iframe = null;
var transfer_iframe_name = "__Test_CORE_compliant_name_transfer_iframe";
var transfer_form_name = "__Test_CORE_compliant_name_transfer_form";
var transfer_input_name = "__Test_CORE_compliant_name_transfer_input";
var transfer_select_name = "__Test_CORE_compliant_name_transfer_select";

var transfer_iframe_id = transfer_iframe_name;
var transfer_form_id = transfer_form_name;
var transfer_input_id = transfer_input_name;
var transfer_select_id = transfer_select_name;

var recipients_link, recipients_td, current_recipients = null;
var recipients_iframe = null;
var recipients_iframe_name = "__Test_CORE_compliant_name_recipients_iframe";
var recipients_form_name = "__Test_CORE_compliant_name_recipients_form";
var recipients_input_name = "__Test_CORE_compliant_name_recipients_input";
var recipients_cust_div_name = "__Test_CORE_compliant_name_recipients_cust_div";
var recipients_empl_div_name = "__Test_CORE_compliant_name_recipients_empl_div";

var recipients_iframe_id = recipients_iframe_name;
var recipients_form_id = recipients_form_name;
var recipients_input_id = recipients_input_name;
var recipients_cust_div_id = recipients_cust_div_name;
var recipients_empl_div_id = recipients_empl_div_name;

var category_link, category_td, old_category = null;
var category_iframe = null;
var category_iframe_name = "__Test_CORE_compliant_name_category_iframe";
var category_form_name = "__Test_CORE_compliant_name_category_form";
var category_input_name = "__Test_CORE_compliant_name_category_input";
var category_select_name = "__Test_CORE_compliant_name_category_select";

var category_iframe_id = category_iframe_name;
var category_form_id = category_form_name;
var category_input_id = category_input_name;
var category_select_id = category_select_name;


var links = document.getElementsByTagName("a");

for (a in links)
{ 
    if (!links[a])
       continue;
       
    if (links[a].className != "action")
       continue;
    
    if (links[a].href.indexOf("popupChangeQueue.pt") != -1)
        queue_link = links[a];
        
    else if (links[a].href.indexOf("popupChangeSubject.pt") != -1)
        subject_link = links[a];
        
    else if (links[a].href.indexOf("changeServer.esp") != -1)
        servers_link = links[a];
        
    else if (links[a].href.indexOf("popupChangeStatus.pt") != -1)
        status_link = links[a];
        
    else if (links[a].href.indexOf("popupChangePriority.pt") != -1)
        priority_link = links[a];
       
    else if (links[a].href.indexOf("popupChangeAssignee.pt") != -1)
        transfer_link = links[a];
        
    else if (links[a].href.indexOf("popupChangeContacts.pt") != -1)
        recipients_link = links[a];
    
    else if (links[a].href.indexOf("popupChangeCategory.pt") != -1)
        category_link = links[a];
} 

if (queue_link && subject_link && servers_link && status_link
    && priority_link && transfer_link && recipients_link && category_link)
{
	do_queue_link();
    do_subject_link();
    do_servers_link();
    do_status_link();
    do_priority_link();
    do_transfer_link();
    do_recipients_link();
    do_category_link();
}

function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
    o[a[i]]='';
  return o;
}

function strip(str)
{ 
    return str.replace(/^\s+|\s+$/g,"");
}

function do_category_link()
{
    var category_text = category_link.firstChild.nodeValue;
    var categor_text = category_text.split('y')[0];
    var underline_span = document.createElement("span");
    
    underline_span.style.textDecoration = "underline";
    underline_span.appendChild(document.createTextNode('y'));
    
    category_link.href = "javascript:void(0);";
    category_link.removeAttribute("onclick");
    category_link.removeAttribute("target");
    category_link.setAttribute("title", ":y to toggle change.");
    category_link.id = category_text;
    category_link.addEventListener("click", category_form, true);
    
    category_link.replaceChild(document.createTextNode(categor_text),
                               category_link.firstChild);
    category_link.appendChild(underline_span);
}

function category_form()
{
	var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/popupChangeCategory.pt" +
              "?ref_no=" + ref_no;
    category_td = category_link.parentNode.parentNode.childNodes[2];
    category_iframe = document.createElement("iframe");
    
    category_td.innerHTML = '';
    category_td.appendChild(document.createTextNode("Please Wait..."));
    
    category_iframe.style.display = "none";
    category_iframe.setAttribute("id", category_iframe_id);
    category_iframe.setAttribute("name", category_iframe_name);
    
    category_link.parentNode.appendChild(category_iframe);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            category_make_form(xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null); 
}

function category_make_form(category_html)
{
	var category_form, category_select, category_button, iframe_categories;
    var category_iframe = document.getElementById(category_iframe_id);
    var doc = category_iframe.contentWindow.document;
    doc.body.innerHTML = category_html;
    var iframe_category_select = doc.getElementsByName("__Test_category_value")[0];
    old_category = doc.getElementsByName("__Test_category_old_value")[0].value;
    
    category_form = document.createElement("form");
    category_form.setAttribute("name", category_form_name);
    category_form.setAttribute("id", category_form_id);
    
    category_select = document.createElement("select");
    category_select.setAttribute("name", category_select_name);
    category_select.setAttribute("id", category_select_id);
    category_select.addEventListener("keypress", category_select_keypress, true);
    
    category_button = document.createElement("input");
    category_button.setAttribute("class", "form_button");
    category_button.setAttribute("type", "button");
    category_button.setAttribute("name", "Change");
    category_button.setAttribute("value", "Change");
    category_button.addEventListener("click", category_post_form, true);
    
    iframe_categories = iframe_category_select.childNodes;
    
    for (var sup_cat in iframe_categories)
    {
        if (iframe_categories[sup_cat].nodeType != 1)
           continue;
        
        var super_category = document.createElement("optgroup");
        super_category.setAttribute("label", iframe_categories[sup_cat].label);
        
        for (var sub_cat in iframe_categories[sup_cat].childNodes)
        {
        	children = iframe_categories[sup_cat].childNodes;
        	
        	if (children[sub_cat].nodeType != 1)
        	   continue;
        	   
        	var sub_category = document.createElement("option");
        	var category_text = strip(children[sub_cat].firstChild.nodeValue);

        	if (children[sub_cat].value == old_category)
        		sub_category.selected = true;
        		
            sub_category.setAttribute("value", children[sub_cat].value);
            sub_category.appendChild(document.createTextNode(category_text));
            super_category.appendChild(sub_category);
        }
        
        category_select.appendChild(super_category);
    }
    
    
    category_form.appendChild(category_select);
    category_form.appendChild(category_button);
    
    category_td.innerHTML = '';
    category_td.appendChild(category_form);
    
    category_select.focus();
}

function category_select_keypress(event)
{
    if (event.keyCode == 13)
        category_post_form();
}

function category_post_form()
{
    // Yea I know what your thinking. "Why do we need all of this dupe stuff?"
    // No idea, but core thows a 500 if its not there.
    var category_iframe = document.getElementById(category_iframe_id);
    var doc = category_iframe.contentWindow.document;
    var category_iframe_body =  doc.getElementsByTagName("body")[0];
    var category_select = document.getElementById(category_select_id);
    var category_iframe_form = doc.createElement("form");
    var category_iframe_input_category = doc.createElement("input");
    var category_iframe_input_test_ok = doc.createElement("input");
    var category_iframe_input_refno = doc.createElement("input");
    var category_iframe_input_category_old = doc.createElement("input");
    var category_iframe_input_category_readonly = doc.createElement("input");
    var category_iframe_input_refno_value = doc.createElement("input");
    var category_iframe_input_refno_old_value = doc.createElement("input");
    var category_iframe_input_test_ok_old = doc.createElement("input");
    var category_iframe_input_test_cancel_old = doc.createElement("input");
    var selected_index = category_select.selectedIndex;
    var category_selected = category_select.options[selected_index].value;
    var url = "https://core.rackspace.com/py/ticket/popupChangeCategory.pt";
    
    category_iframe.addEventListener("load", category_iframe_posted, false);
    
    category_iframe_input_category.setAttribute("name", "__Test_category_value");
    category_iframe_input_category.setAttribute("value", category_selected);
    
    category_iframe_input_test_ok.setAttribute("name", "__Test_ok_value");
    category_iframe_input_test_ok.setAttribute("value", "OK");

    category_iframe_input_refno.setAttribute("name", "ref_no");
    category_iframe_input_refno.setAttribute("value", ref_no);

    category_iframe_input_category_old.setAttribute("name",
                                                    "__Test_category_old_value");
    category_iframe_input_category_old.setAttribute("value", old_category);
    
    category_iframe_input_category_readonly.setAttribute("name",
                                                     "__Test_category_readonly");
    category_iframe_input_category_readonly.setAttribute("value", "0");    
    
    category_iframe_input_refno_value.setAttribute("name",
                                                       "__Test_ref_no_value");
    category_iframe_input_refno_value.setAttribute("value", ref_no);
    
    category_iframe_input_refno_old_value.setAttribute("name",
                                                   "__Test_ref_no_old_value");
    category_iframe_input_refno_old_value.setAttribute("value", ref_no);
    
    category_iframe_input_test_ok_old.setAttribute("name",
                                                        "__Test_ok_old_value");
    category_iframe_input_test_ok_old.setAttribute("value", "");
    
    category_iframe_input_test_cancel_old.setAttribute("name",
                                                    "__Test_cancel_old_value");
    category_iframe_input_test_cancel_old.setAttribute("value", "");                                            
    
    category_iframe_form.setAttribute("name", "Test");
    category_iframe_form.setAttribute("method", "post");
    category_iframe_form.setAttribute("action", url);

    category_iframe_form.appendChild(category_iframe_input_category);
    category_iframe_form.appendChild(category_iframe_input_test_ok);
    category_iframe_form.appendChild(category_iframe_input_refno);
    category_iframe_form.appendChild(category_iframe_input_category_old);
    category_iframe_form.appendChild(category_iframe_input_category_readonly);
    category_iframe_form.appendChild(category_iframe_input_refno_value);
    category_iframe_form.appendChild(category_iframe_input_refno_old_value);
    category_iframe_form.appendChild(category_iframe_input_test_ok_old);
    category_iframe_form.appendChild(category_iframe_input_test_cancel_old);
    
    category_iframe_body.appendChild(category_iframe_form);
    
    category_td.innerHTML = '';
    category_td.appendChild(document.createTextNode("Please Wait... "));
    
    category_iframe_form.submit();
}

function category_iframe_posted()
{
	var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/view.pt?ref_no=" + ref_no;
    
    xmlhttp.onreadystatechange = function()
    {
        if (!(xmlhttp.readyState == 4 && xmlhttp.status == 200))
            return false;
            
        var i_category_link, iframe_category_td = null;
        var category_iframe = document.getElementById(category_iframe_id);
        var doc = category_iframe.contentWindow.document;
        
        doc.body.innerHTML = xmlhttp.responseText;
        
        var links = doc.getElementsByTagName("a");

        for (a in links)
        { 
            if (!links[a])
                continue;
            
            if (links[a].className != "action")
            continue;
        
             if (links[a].href.indexOf("popupChangeCategory.pt") != -1)
                i_category_link = links[a]
        }
        
        
        iframe_category_td = i_category_link.parentNode.parentNode.childNodes[2];
        
        category_td.parentNode.replaceChild(iframe_category_td, category_td);
        doc.body.innerHTML = '';
    }
        
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function do_recipients_link()
{
    var recipients_text = recipients_link.firstChild.nodeValue;
    var r_text = recipients_text.split('e')[0];
    var cipients_text = recipients_text.split('e')[1] + 'e' +
                        recipients_text.split('e')[2];
    var underline_span = document.createElement("span");
    
    underline_span.style.textDecoration = "underline";
    underline_span.appendChild(document.createTextNode('e'));
    
    recipients_link.href = "javascript:void(0);";
    recipients_link.removeAttribute("onclick");
    recipients_link.removeAttribute("target");
    recipients_link.setAttribute("title", ":e to toggle change.");
    recipients_link.id = recipients_text;
    recipients_link.addEventListener("click", recipients_form, true);
    
    recipients_link.replaceChild(document.createTextNode(r_text),
                               recipients_link.firstChild);
    recipients_link.appendChild(underline_span);
    recipients_link.appendChild(document.createTextNode(cipients_text))
}

function recipients_form()
{
	var xmlhttp = get_xmlhttp();
	var url = "https://core.rackspace.com/py/ticket/popupChangeContacts.pt" +
			  "?ref_no=" + ref_no;
    recipients_td = recipients_link.parentNode.parentNode.childNodes[2];
    recipients_iframe = document.createElement("iframe");
    
    recipients_td.innerHTML = '';
    recipients_td.appendChild(document.createTextNode("Please Wait..."));
	
	recipients_iframe.style.display = "none";
    recipients_iframe.setAttribute("id", recipients_iframe_id);
    recipients_iframe.setAttribute("name", recipients_iframe_name);
    
    recipients_link.parentNode.appendChild(recipients_iframe);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            recipients_make_form(xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null); 
}

function recipients_make_form(recipients_html)
{
	var recipients_form, recipients_button;    
    var contacts = new Array();
    var recipeints_iframe = document.getElementById(recipients_iframe_id);
    var doc = recipients_iframe.contentWindow.document;
    doc.body.innerHTML = recipients_html;
    var form = doc.getElementsByTagName("form")[0];
    var recipients_button = document.createElement("input")
    var cust_odiv = document.createElement("div");
    var cust_idiv = document.createElement("div");
    var cust_div = document.createElement("div");
    var cust_link = document.createElement("a");
    var empl_odiv = document.createElement("div");
    var empl_idiv = document.createElement("div");
    var empl_div = document.createElement("div");
    var empl_link = document.createElement("a");

    cust_link.href = "javascript:void(0);"; 
    empl_link.href = "javascript:void(0);";
    
    cust_idiv.setAttribute("title", "Click to expand.");
    empl_idiv.setAttribute("title", "Click to expand.");
    
    cust_link.appendChild(document.createTextNode("Customers"));
    empl_link.appendChild(document.createTextNode("Employees"));
    
    cust_idiv.appendChild(cust_link);
    empl_idiv.appendChild(empl_link);
    
    cust_idiv.addEventListener("click", server_show_div, false);
    empl_idiv.addEventListener("click", server_show_div, false);
    
    cust_div.setAttribute("name", recipients_cust_div_name);
    empl_div.setAttribute("name", recipients_empl_div_name);
    
    cust_div.setAttribute("id", recipients_cust_div_id);
    empl_div.setAttribute("id", recipients_empl_div_id);
    
    cust_div.style.visibility = "visible";
    empl_div.style.visibility = "hidden";
    
    cust_div.style.display = "block";
    empl_div.style.display = "none";
    
    cust_odiv.appendChild(cust_idiv);
    empl_odiv.appendChild(empl_idiv);
    
    cust_odiv.appendChild(cust_div);
    empl_odiv.appendChild(empl_div);
    
    contacts["empl"] = new Array();
    contacts["cust"] = new Array();
    
    recipients_form = document.createElement("form");
    recipients_form.setAttribute("name", recipients_form_name);
    recipients_form.setAttribute("id", recipients_form_id);
    recipients_form.appendChild(cust_odiv);
    recipients_form.appendChild(empl_odiv);
    
    recipients_button.setAttribute("class", "form_button");
    recipients_button.setAttribute("type", "button");
    recipients_button.setAttribute("name", "Change");
    recipients_button.setAttribute("value", "Change");
    recipients_button.addEventListener("click", recipients_post_form, true);
    
    for (var node in form.childNodes)
    {
    	if (!form.childNodes[node] || form.childNodes[node].nodeType != 1
            || form.childNodes[node].nodeName != "INPUT")
    	   continue;

    	var input = form.childNodes[node];
    	var cname = input.nextSibling.nextSibling.firstChild.nodeValue;

    	// Is this an customer??   
    	if (input.nextSibling.nextSibling.href.indexOf("employee") == -1)
        {
        	var roles = input.nextSibling.nextSibling.nextSibling.nodeValue
            roles = roles.replace('(', '').replace(')', '');
            
            contacts["cust"][input.name] = new Array();
            contacts["cust"][input.name]["name"] = strip(cname);
            contacts["cust"][input.name]["roles"] = strip(roles);
            	
        	if (input.checked)
        	   contacts["cust"][input.name]["checked"] = true;
        	else
        	   contacts["cust"][input.name]["checked"] = false;
        }
        else
        {
        	contacts["empl"][input.name] = new Array();
        	contacts["empl"][input.name]["name"] = strip(cname);
        	
        	
        	if (input.checked)
        	   contacts["empl"][input.name]["checked"] = true;
        	else
        	   contacts["empl"][input.name]["checked"] = false;
        }
    }

    for (var cust in contacts["cust"])
    {
        var cust_check_div = document.createElement("div");
        var cust_check = document.createElement("input");
        var cust_label = document.createElement("label");
        var cust_label_span = document.createElement("span");
        
        cust_check.setAttribute("type", "checkbox");
        cust_check.setAttribute("name", cust);
        cust_check.setAttribute("value", "1");
        
        if (contacts["cust"][cust]["checked"])
            cust_check.setAttribute("checked", "");
        
        cust_label.setAttribute("for", cust);
        
        cust_label_span.style.padding = "0.3em";
        cust_label_span.setAttribute("title", contacts["cust"][cust]["roles"]);
        cust_label_span.appendChild(document.createTextNode(
                                              contacts["cust"][cust]["name"]));
        
        cust_label.appendChild(cust_label_span);
        
        cust_check_div.appendChild(cust_check);
        cust_check_div.appendChild(cust_label);
        
        cust_div.appendChild(cust_check_div);
    }
    
    for (var empl in contacts["empl"])
    {
        var empl_check_div = document.createElement("div");
        var empl_check = document.createElement("input");
        var empl_label = document.createElement("label");
        var empl_label_span = document.createElement("span");
        
        empl_check.setAttribute("type", "checkbox");
        empl_check.setAttribute("name", empl);
        empl_check.setAttribute("value", "1");
        
        if (contacts["empl"][empl]["checked"])
            empl_check.setAttribute("checked", "");
        
        empl_label.setAttribute("for", empl);
        
        empl_label_span.style.padding = "0.3em";
        empl_label_span.appendChild(document.createTextNode(
                                              contacts["empl"][empl]["name"]));
        
        empl_label.appendChild(empl_label_span);
        
        empl_check_div.appendChild(empl_check);
        empl_check_div.appendChild(empl_label);
        
        empl_div.appendChild(empl_check_div);
    }
    
    recipients_form.appendChild(recipients_button);
    
    recipients_td.innerHTML = '';
    recipients_td.appendChild(recipients_form);
}

function recipients_post_form()
{
	var recipients_iframe = document.getElementById(recipients_iframe_id);
    var doc = recipients_iframe.contentWindow.document;
    var recipients_iframe_body =  doc.getElementsByTagName("body")[0];
    var recipients_iframe_form = doc.createElement("form");
    var recipients_iframe_input_refno = doc.createElement("input");
    var recipients_iframe_input_submit = doc.createElement("input");
    var recipients_form = document.getElementById(recipients_form_id);
    var recipients_chks =  recipients_form.getElementsByTagName("input");
    var url = "https://core.rackspace.com/py/ticket/popupChangeContacts.pt";
              
    recipients_iframe.addEventListener("load", recipients_iframe_posted, false);
    
    recipients_iframe_form.setAttribute("method", "get");
    recipients_iframe_form.setAttribute("action", url);
    
    for (input in recipients_chks)
    {
        if (recipients_chks[input].type != "checkbox")
            continue;
        
        if (!recipients_chks[input].checked)
            continue;

        var recipient_input = doc.createElement("input");
        
        recipient_input.setAttribute("type", "checkbox");
        recipient_input.setAttribute("name", recipients_chks[input].name);
        recipient_input.setAttribute("value", "1");
        recipient_input.setAttribute("checked", "");
        
        recipients_iframe_form.appendChild(recipient_input);
    }
    
    recipients_iframe_input_refno.setAttribute("name", "ref_no");
    recipients_iframe_input_refno.setAttribute("value", ref_no);
    
    recipients_iframe_input_submit.setAttribute("name","submitted");
    recipients_iframe_input_submit.setAttribute("value", " Change ");
    
    recipients_iframe_form.appendChild(recipients_iframe_input_refno);
    recipients_iframe_form.appendChild(recipients_iframe_input_submit);
    
    recipients_iframe_body.appendChild(recipients_iframe_form);
    
    recipients_td.innerHTML = '';
    recipients_td.appendChild(document.createTextNode("Please Wait... "));
    
    recipients_iframe_form.submit();
	
}

function recipients_iframe_posted()
{
	var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/view.pt?ref_no=" + ref_no;
    
    xmlhttp.onreadystatechange = function()
    {
        if (!(xmlhttp.readyState == 4 && xmlhttp.status == 200))
            return false;
            
        var i_recipients_link, i_recipients_td = null;
        var recipients_iframe = document.getElementById(recipients_iframe_id);
        var doc = recipients_iframe.contentWindow.document;
        
        doc.body.innerHTML = xmlhttp.responseText;
        
        var links = doc.getElementsByTagName("a");

        for (a in links)
        { 
            if (!links[a])
                continue;
            
            if (links[a].className != "action")
            continue;
        
             if (links[a].href.indexOf("popupChangeContacts.pt") != -1)
                i_recipients_link = links[a]
        }
        
        
        i_recipients_td = i_recipients_link.parentNode.parentNode.childNodes[2];
        
        recipients_td.innerHTML = i_recipients_td.innerHTML;
        doc.body.innerHTML = '';
    }
        
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function do_transfer_link()
{
    var transfer_text = transfer_link.firstChild.nodeValue;
    var ssigned_text = transfer_text.split('A')[1];
    var underline_span = document.createElement("span");
    
    underline_span.style.textDecoration = "underline";
    underline_span.appendChild(document.createTextNode('A'));
    
    transfer_link.href = "javascript:void(0);";
    transfer_link.removeAttribute("onclick");
    transfer_link.removeAttribute("target");
    transfer_link.setAttribute("title", ":a to toggle change.");
    transfer_link.id = transfer_text;
    transfer_link.addEventListener("click", transfer_form, true);
    
    transfer_link.replaceChild(underline_span, transfer_link.firstChild);
    transfer_link.appendChild(document.createTextNode(ssigned_text))
}

function transfer_form()
{
    var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/popupChangeAssignee.pt" +
              "?ref_no=" + ref_no;

    transfer_td = transfer_link.parentNode.parentNode.childNodes[2];
    transfer_iframe = document.createElement("iframe");
       
    transfer_td.innerHTML = '';
    transfer_td.style.background = '';
    transfer_td.appendChild(document.createTextNode("Please Wait..."));
    
    transfer_iframe.style.display = "none";
    transfer_iframe.setAttribute("id", transfer_iframe_id);
    transfer_iframe.setAttribute("name", transfer_iframe_name);
    
    transfer_link.parentNode.appendChild(transfer_iframe);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            transfer_make_list(xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null); 
}

function transfer_make_list(transfer_html)
{
    var transfer_form, transfer_select, transfer_button, iframe_transferes;
    var transfer_iframe = document.getElementById(transfer_iframe_id);
    var doc = transfer_iframe.contentWindow.document;
    doc.body.innerHTML = transfer_html;
    var iframe_transfer_select = doc.getElementsByName("__Test_transfer_value")[0];
    
    transfer_form = document.createElement("form");
    transfer_form.setAttribute("name", transfer_form_name);
    transfer_form.setAttribute("id", transfer_form_id);
    
    transfer_select = document.createElement("select");
    transfer_select.setAttribute("name", transfer_select_name);
    transfer_select.setAttribute("id", transfer_select_id);
    transfer_select.addEventListener("keypress", transfer_select_keypress, true);
    
    transfer_button = document.createElement("input");
    transfer_button.setAttribute("class", "form_button");
    transfer_button.setAttribute("type", "button");
    transfer_button.setAttribute("name", "Change");
    transfer_button.setAttribute("value", "Change");
    transfer_button.addEventListener("click", transfer_post_form, true);
    
    iframe_transferes = iframe_transfer_select.childNodes;
    
    for (var stat in iframe_transferes)
    {
        if (iframe_transferes[stat].nodeType != 1)
           continue;

        var transfer_option = document.createElement("option");
        var transfer_text = strip(iframe_transferes[stat].firstChild.nodeValue);
        
        if (iframe_transferes[stat].selected)
        {
            current_transfer = iframe_transferes[stat].value;
            transfer_option.selected = true;
        }
        
        transfer_option.setAttribute("value", iframe_transferes[stat].value);
        transfer_option.appendChild(document.createTextNode(transfer_text));
        transfer_select.appendChild(transfer_option);
    }
    
    
    transfer_form.appendChild(transfer_select);
    transfer_form.appendChild(transfer_button);
    
    transfer_td.innerHTML = '';
    transfer_td.appendChild(transfer_form);
    
    transfer_select.focus();
}

function transfer_select_keypress(event)
{
    if (event.keyCode == 13)
        transfer_post_form();
}

function transfer_post_form()
{
    // Yea I know what your thinking. "Why do we need all of this dupe stuff?"
    // No idea, but core thows a 500 if its not there.
    var transfer_iframe = document.getElementById(transfer_iframe_id);
    var doc = transfer_iframe.contentWindow.document;
    var transfer_iframe_body =  doc.getElementsByTagName("body")[0];
    var transfer_select = document.getElementById(transfer_select_id);
    var transfer_iframe_form = doc.createElement("form");
    var transfer_iframe_input_transfer = doc.createElement("input");
    var transfer_iframe_input_test_ok = doc.createElement("input");
    var transfer_iframe_input_refno = doc.createElement("input");
    var transfer_iframe_input_transfer_old = doc.createElement("input");
    var transfer_iframe_input_transfer_readonly = doc.createElement("input");
    var transfer_iframe_input_refno_value = doc.createElement("input");
    var transfer_iframe_input_refno_old_value = doc.createElement("input");
    var transfer_iframe_input_test_ok_old = doc.createElement("input");
    var transfer_iframe_input_test_cancel = doc.createElement("input");
    var transfer_iframe_input_test_cancel_old = doc.createElement("input");
    var selected_index = transfer_select.selectedIndex;
    var transfer_selected = transfer_select.options[selected_index].value;
    var url = "https://core.rackspace.com/py/ticket/popupChangeAssignee.pt";
    
    transfer_iframe.addEventListener("load", transfer_iframe_posted, false);
    
    transfer_iframe_input_transfer.setAttribute("name", "__Test_transfer_value");
    transfer_iframe_input_transfer.setAttribute("value", transfer_selected);
    
    transfer_iframe_input_test_ok.setAttribute("name", "__Test_ok");
    transfer_iframe_input_test_ok.setAttribute("value", "1");

    transfer_iframe_input_refno.setAttribute("name", "ref_no");
    transfer_iframe_input_refno.setAttribute("value", ref_no);
    
    transfer_iframe_input_transfer_old.setAttribute("name",
                                                    "__Test_transfer_old_value");
    transfer_iframe_input_transfer_old.setAttribute("value", current_transfer);
    
    transfer_iframe_input_transfer_readonly.setAttribute("name",
                                                     "__Test_transfer_readonly");
    transfer_iframe_input_transfer_readonly.setAttribute("value", "0");    
    
    transfer_iframe_input_refno_value.setAttribute("name",
                                                       " __Test_ref_no_value");
    transfer_iframe_input_refno_value.setAttribute("value", ref_no);
    
    transfer_iframe_input_refno_old_value.setAttribute("name",
                                                   " __Test_ref_no_old_value");
    transfer_iframe_input_refno_old_value.setAttribute("value", ref_no);
    
    transfer_iframe_input_test_ok_old.setAttribute("name",
                                                        "__Test_ok_old_value");
    transfer_iframe_input_test_ok_old.setAttribute("value", "");
    
    transfer_iframe_input_test_cancel.setAttribute("name", "__Test_cancel");
    transfer_iframe_input_test_cancel.setAttribute("value", "0");
    
    transfer_iframe_input_test_cancel_old.setAttribute("name",
                                                    "__Test_cancel_old_value");
    transfer_iframe_input_test_cancel_old.setAttribute("value", "");                                            
    
    transfer_iframe_form.setAttribute("method", "post");
    transfer_iframe_form.setAttribute("action", url);
    
    transfer_iframe_form.appendChild(transfer_iframe_input_transfer);
    transfer_iframe_form.appendChild(transfer_iframe_input_test_ok);
    transfer_iframe_form.appendChild(transfer_iframe_input_refno);
    transfer_iframe_form.appendChild(transfer_iframe_input_transfer_old);
    transfer_iframe_form.appendChild(transfer_iframe_input_transfer_readonly);
    transfer_iframe_form.appendChild(transfer_iframe_input_refno_value);
    transfer_iframe_form.appendChild(transfer_iframe_input_refno_old_value);
    transfer_iframe_form.appendChild(transfer_iframe_input_test_ok_old);
    transfer_iframe_form.appendChild(transfer_iframe_input_test_cancel);
    transfer_iframe_form.appendChild(transfer_iframe_input_test_cancel_old);
    
    transfer_iframe_body.appendChild(transfer_iframe_form);
    
    transfer_td.innerHTML = '';
    transfer_td.appendChild(document.createTextNode("Please Wait... "));
    
    transfer_iframe_form.submit();
}

function transfer_iframe_posted()
{
    var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/view.pt?ref_no=" + ref_no;
    
    xmlhttp.onreadystatechange = function()
    {
        if (!(xmlhttp.readyState == 4 && xmlhttp.status == 200))
            return false;
            
        var i_transfer_link, iframe_transfer_td = null;
        var servers_iframe = document.getElementById(transfer_iframe_id);
        var doc = servers_iframe.contentWindow.document;
        
        doc.body.innerHTML = xmlhttp.responseText;
        
        var links = doc.getElementsByTagName("a");
        
        for (a in links)
        { 
            if (!links[a])
                continue;
            
            if (links[a].className != "action")
            continue;
        
             if (links[a].href.indexOf("popupChangeAssignee.pt") != -1)
                i_transfer_link = links[a]
        }
        
        
        iframe_transfer_td = i_transfer_link.parentNode.parentNode.childNodes[2];
        
        transfer_td.parentNode.replaceChild(iframe_transfer_td, transfer_td);
        doc.body.innerHTML = '';
    }
        
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function do_priority_link()
{
    var priority_text = priority_link.firstChild.nodeValue;
    var pr_text = priority_text.split('i')[0];
    var ority_text = priority_text.split('i')[1] + 'i' +
                     priority_text.split('i')[2];
    var underline_span = document.createElement("span");
    
    underline_span.style.textDecoration = "underline";
    underline_span.appendChild(document.createTextNode('i'));
    
    priority_link.href = "javascript:void(0);";
    priority_link.removeAttribute("onclick");
    priority_link.removeAttribute("target");
    priority_link.setAttribute("title", ":i to toggle change.");
    priority_link.id = priority_text;
    priority_link.addEventListener("click", priority_form, true);
    
    priority_link.replaceChild(document.createTextNode(pr_text),
                             priority_link.firstChild);
    priority_link.appendChild(underline_span);
    priority_link.appendChild(document.createTextNode(ority_text));
}

function priority_form()
{
    var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/popupChangePriority.pt" +
              "?ref_no=" + ref_no;

    priority_td = priority_link.parentNode.parentNode.childNodes[2];
    priority_iframe = document.createElement("iframe");
       
    priority_td.innerHTML = '';
    priority_td.style.background = '';
    priority_td.appendChild(document.createTextNode("Please Wait..."));
    
    priority_iframe.style.display = "none";
    priority_iframe.setAttribute("id", priority_iframe_id);
    priority_iframe.setAttribute("name", priority_iframe_name);
    
    priority_link.parentNode.appendChild(priority_iframe);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            priority_make_list(xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null); 
}

function priority_make_list(priority_html)
{
    var priority_form, priority_select, priority_button, iframe_priorityes;
    var priority_iframe = document.getElementById(priority_iframe_id);
    var doc = priority_iframe.contentWindow.document;
    doc.body.innerHTML = priority_html;
    var iframe_priority_select = doc.getElementsByName("__Test_priority_value")[0];
    
    priority_form = document.createElement("form");
    priority_form.setAttribute("name", priority_form_name);
    priority_form.setAttribute("id", priority_form_id);
    
    priority_select = document.createElement("select");
    priority_select.setAttribute("name", priority_select_name);
    priority_select.setAttribute("id", priority_select_id);
    priority_select.addEventListener("keypress", priority_select_keypress, true);
    
    priority_button = document.createElement("input");
    priority_button.setAttribute("class", "form_button");
    priority_button.setAttribute("type", "button");
    priority_button.setAttribute("name", "Change");
    priority_button.setAttribute("value", "Change");
    priority_button.addEventListener("click", priority_post_form, true);
    
    iframe_priorityes = iframe_priority_select.childNodes;
    
    for (var stat in iframe_priorityes)
    {
        if (iframe_priorityes[stat].nodeType != 1)
           continue;

        var priority_option = document.createElement("option");
        var priority_text = strip(iframe_priorityes[stat].firstChild.nodeValue);
        
        if (iframe_priorityes[stat].selected)
        {
            current_priority = iframe_priorityes[stat].value;
            priority_option.selected = true;
        }
        
        priority_option.setAttribute("value", iframe_priorityes[stat].value);
        priority_option.appendChild(document.createTextNode(priority_text));
        priority_select.appendChild(priority_option);
    }
    
    
    priority_form.appendChild(priority_select);
    priority_form.appendChild(priority_button);
    
    priority_td.innerHTML = '';
    priority_td.appendChild(priority_form);
    
    priority_select.focus();
}

function priority_select_keypress(event)
{
    if (event.keyCode == 13)
        priority_post_form();
}

function priority_post_form()
{
    // Yea I know what your thinking. "Why do we need all of this dupe stuff?"
    // No idea, but core thows a 500 if its not there.
    var priority_iframe = document.getElementById(priority_iframe_id);
    var doc = priority_iframe.contentWindow.document;
    var priority_iframe_body =  doc.getElementsByTagName("body")[0];
    var priority_select = document.getElementById(priority_select_id);
    var priority_iframe_form = doc.createElement("form");
    var priority_iframe_input_priority = doc.createElement("input");
    var priority_iframe_input_test_ok = doc.createElement("input");
    var priority_iframe_input_refno = doc.createElement("input");
    var priority_iframe_input_priority_old = doc.createElement("input");
    var priority_iframe_input_priority_readonly = doc.createElement("input");
    var priority_iframe_input_refno_value = doc.createElement("input");
    var priority_iframe_input_refno_old_value = doc.createElement("input");
    var priority_iframe_input_test_ok_old = doc.createElement("input");
    var priority_iframe_input_test_cancel = doc.createElement("input");
    var priority_iframe_input_test_cancel_old = doc.createElement("input");
    var selected_index = priority_select.selectedIndex;
    var priority_selected = priority_select.options[selected_index].value;
    var url = "https://core.rackspace.com/py/ticket/popupChangePriority.pt";
    
    priority_iframe.addEventListener("load", priority_iframe_posted, false);
    
    priority_iframe_input_priority.setAttribute("name", "__Test_priority_value");
    priority_iframe_input_priority.setAttribute("value", priority_selected);
    
    priority_iframe_input_test_ok.setAttribute("name", "__Test_ok");
    priority_iframe_input_test_ok.setAttribute("value", "1");

    priority_iframe_input_refno.setAttribute("name", "ref_no");
    priority_iframe_input_refno.setAttribute("value", ref_no);
    
    priority_iframe_input_priority_old.setAttribute("name",
                                                    "__Test_priority_old_value");
    priority_iframe_input_priority_old.setAttribute("value", current_priority);
    
    priority_iframe_input_priority_readonly.setAttribute("name",
                                                     "__Test_priority_readonly");
    priority_iframe_input_priority_readonly.setAttribute("value", "0");    
    
    priority_iframe_input_refno_value.setAttribute("name",
                                                       " __Test_ref_no_value");
    priority_iframe_input_refno_value.setAttribute("value", ref_no);
    
    priority_iframe_input_refno_old_value.setAttribute("name",
                                                   " __Test_ref_no_old_value");
    priority_iframe_input_refno_old_value.setAttribute("value", ref_no);
    
    priority_iframe_input_test_ok_old.setAttribute("name",
                                                        "__Test_ok_old_value");
    priority_iframe_input_test_ok_old.setAttribute("value", "");
    
    priority_iframe_input_test_cancel.setAttribute("name", "__Test_cancel");
    priority_iframe_input_test_cancel.setAttribute("value", "0");
    
    priority_iframe_input_test_cancel_old.setAttribute("name",
                                                    "__Test_cancel_old_value");
    priority_iframe_input_test_cancel_old.setAttribute("value", "");                                            
    
    priority_iframe_form.setAttribute("method", "post");
    priority_iframe_form.setAttribute("action", url);
    
    priority_iframe_form.appendChild(priority_iframe_input_priority);
    priority_iframe_form.appendChild(priority_iframe_input_test_ok);
    priority_iframe_form.appendChild(priority_iframe_input_refno);
    priority_iframe_form.appendChild(priority_iframe_input_priority_old);
    priority_iframe_form.appendChild(priority_iframe_input_priority_readonly);
    priority_iframe_form.appendChild(priority_iframe_input_refno_value);
    priority_iframe_form.appendChild(priority_iframe_input_refno_old_value);
    priority_iframe_form.appendChild(priority_iframe_input_test_ok_old);
    priority_iframe_form.appendChild(priority_iframe_input_test_cancel);
    priority_iframe_form.appendChild(priority_iframe_input_test_cancel_old);
    
    priority_iframe_body.appendChild(priority_iframe_form);
    
    priority_td.innerHTML = '';
    priority_td.appendChild(document.createTextNode("Please Wait... "));
    
    priority_iframe_form.submit();
}

function priority_iframe_posted()
{
    var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/view.pt?ref_no=" + ref_no;
    
    xmlhttp.onreadystatechange = function()
    {
        if (!(xmlhttp.readyState == 4 && xmlhttp.status == 200))
            return false;
            
        var i_priority_link, iframe_priority_td = null;
        var servers_iframe = document.getElementById(priority_iframe_id);
        var doc = servers_iframe.contentWindow.document;
        
        doc.body.innerHTML = xmlhttp.responseText;
        
        var links = doc.getElementsByTagName("a");
        
        for (a in links)
        { 
            if (!links[a])
                continue;
            
            if (links[a].className != "action")
            continue;
        
             if (links[a].href.indexOf("popupChangePriority.pt") != -1)
                i_priority_link = links[a]
        }
        
        
        iframe_priority_td = i_priority_link.parentNode.parentNode.childNodes[2];
        
        priority_td.parentNode.replaceChild(iframe_priority_td, priority_td);
        doc.body.innerHTML = '';
    }
        
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function do_status_link()
{
	var status_text = status_link.firstChild.nodeValue;
    var s_text = status_text.split('t')[0];
    var atus_text = status_text.split('t')[1] + 't' + 
                    status_text.split('t')[2];
    var underline_span = document.createElement("span");
    
    underline_span.style.textDecoration = "underline";
    underline_span.appendChild(document.createTextNode('t'));
    
    status_link.href = "javascript:void(0);";
    status_link.removeAttribute("onclick");
    status_link.removeAttribute("target");
    status_link.setAttribute("title", ":t to toggle change.");
    status_link.id = status_text;
    status_link.addEventListener("click", status_form, true);
    
    status_link.replaceChild(document.createTextNode(s_text),
                             status_link.firstChild);
    status_link.appendChild(underline_span);
    status_link.appendChild(document.createTextNode(atus_text));
}

function status_form()
{
    var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/popupChangeStatus.pt" +
              "?ref_no=" + ref_no;

    status_td = status_link.parentNode.parentNode.childNodes[2];
    status_iframe = document.createElement("iframe");
       
    status_td.innerHTML = '';
    status_td.style.background = '';
    status_td.appendChild(document.createTextNode("Please Wait..."));
    
    status_iframe.style.display = "none";
    status_iframe.setAttribute("id", status_iframe_id);
    status_iframe.setAttribute("name", status_iframe_name);
    
    status_link.parentNode.appendChild(status_iframe);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            status_make_list(xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null); 
}

function status_make_list(status_html)
{
	var status_form, status_select, status_button, iframe_statuses;
    var status_iframe = document.getElementById(status_iframe_id);
    var doc = status_iframe.contentWindow.document;
    doc.body.innerHTML = status_html;
    var iframe_status_select = doc.getElementsByName("__Test_status_value")[0];
    
    status_form = document.createElement("form");
    status_form.setAttribute("name", status_form_name);
    status_form.setAttribute("id", status_form_id);
    
    status_select = document.createElement("select");
    status_select.setAttribute("name", status_select_name);
    status_select.setAttribute("id", status_select_id);
    status_select.addEventListener("keypress", status_select_keypress, true);
    
    status_button = document.createElement("input");
    status_button.setAttribute("class", "form_button");
    status_button.setAttribute("type", "button");
    status_button.setAttribute("name", "Change");
    status_button.setAttribute("value", "Change");
    status_button.addEventListener("click", status_post_form, true);
    
    iframe_statuses = iframe_status_select.childNodes;
    
    for (var stat in iframe_statuses)
    {
    	if (iframe_statuses[stat].nodeType != 1)
    	   continue;

        var status_option = document.createElement("option");
        var status_text = strip(iframe_statuses[stat].firstChild.nodeValue);
        
        if (iframe_statuses[stat].selected)
        {
            current_status = iframe_statuses[stat].value;
            status_option.selected = true;
        }
        
        status_option.setAttribute("value", iframe_statuses[stat].value);
        status_option.appendChild(document.createTextNode(status_text));
        status_select.appendChild(status_option);
    }
    
    
    status_form.appendChild(status_select);
    status_form.appendChild(status_button);
    
    status_td.innerHTML = '';
    status_td.appendChild(status_form);
    
    status_select.focus();
}

function status_select_keypress(event)
{
	if (event.keyCode == 13)
        status_post_form();
}

function status_post_form()
{
	// Yea I know what your thinking. "Why do we need all of this dupe stuff?"
	// No idea, but core thows a 500 if its not there.
	var status_iframe = document.getElementById(status_iframe_id);
    var doc = status_iframe.contentWindow.document;
    var status_iframe_body =  doc.getElementsByTagName("body")[0];
    var status_select = document.getElementById(status_select_id);
    var status_iframe_form = doc.createElement("form");
    var status_iframe_input_status = doc.createElement("input");
    var status_iframe_input_test_ok = doc.createElement("input");
    var status_iframe_input_refno = doc.createElement("input");
    var status_iframe_input_status_old = doc.createElement("input");
    var status_iframe_input_status_readonly = doc.createElement("input");
    var status_iframe_input_refno_value = doc.createElement("input");
    var status_iframe_input_refno_old_value = doc.createElement("input");
    var status_iframe_input_test_ok_old = doc.createElement("input");
    var status_iframe_input_test_cancel = doc.createElement("input");
    var status_iframe_input_test_cancel_old = doc.createElement("input");
    var selected_index = status_select.selectedIndex;
    var status_selected = status_select.options[selected_index].value;
    var url = "https://core.rackspace.com/py/ticket/popupChangeStatus.pt";
    
    status_iframe.addEventListener("load", status_iframe_posted, false);
    
    status_iframe_input_status.setAttribute("name", "__Test_status_value");
    status_iframe_input_status.setAttribute("value", status_selected);
    
    status_iframe_input_test_ok.setAttribute("name", "__Test_ok");
    status_iframe_input_test_ok.setAttribute("value", "1");

    status_iframe_input_refno.setAttribute("name", "ref_no");
    status_iframe_input_refno.setAttribute("value", ref_no);
    
    status_iframe_input_status_old.setAttribute("name",
                                                    "__Test_status_old_value");
    status_iframe_input_status_old.setAttribute("value", current_status);
    
    status_iframe_input_status_readonly.setAttribute("name",
                                                     "__Test_status_readonly");
    status_iframe_input_status_readonly.setAttribute("value", "0");    
    
    status_iframe_input_refno_value.setAttribute("name",
                                                       " __Test_ref_no_value");
    status_iframe_input_refno_value.setAttribute("value", ref_no);
    
    status_iframe_input_refno_old_value.setAttribute("name",
                                                   " __Test_ref_no_old_value");
    status_iframe_input_refno_old_value.setAttribute("value", ref_no);
    
    status_iframe_input_test_ok_old.setAttribute("name",
                                                        "__Test_ok_old_value");
    status_iframe_input_test_ok_old.setAttribute("value", "");
    
    status_iframe_input_test_cancel.setAttribute("name", "__Test_cancel");
    status_iframe_input_test_cancel.setAttribute("value", "0");
    
    status_iframe_input_test_cancel_old.setAttribute("name",
                                                    "__Test_cancel_old_value");
    status_iframe_input_test_cancel_old.setAttribute("value", "");                                            
    
    status_iframe_form.setAttribute("method", "post");
    status_iframe_form.setAttribute("action", url);
    
    status_iframe_form.appendChild(status_iframe_input_status);
    status_iframe_form.appendChild(status_iframe_input_test_ok);
    status_iframe_form.appendChild(status_iframe_input_refno);
    status_iframe_form.appendChild(status_iframe_input_status_old);
    status_iframe_form.appendChild(status_iframe_input_status_readonly);
    status_iframe_form.appendChild(status_iframe_input_refno_value);
    status_iframe_form.appendChild(status_iframe_input_refno_old_value);
    status_iframe_form.appendChild(status_iframe_input_test_ok_old);
    status_iframe_form.appendChild(status_iframe_input_test_cancel);
    status_iframe_form.appendChild(status_iframe_input_test_cancel_old);
    
    status_iframe_body.appendChild(status_iframe_form);
    
    status_td.innerHTML = '';
    status_td.appendChild(document.createTextNode("Please Wait... "));
    
    status_iframe_form.submit();
}

function status_iframe_posted()
{
    var xmlhttp = get_xmlhttp();
    var url = "https://core.rackspace.com/py/ticket/view.pt?ref_no=" + ref_no;
    
    xmlhttp.onreadystatechange = function()
    {
        if (!(xmlhttp.readyState == 4 && xmlhttp.status == 200))
            return false;
            
        var i_status_link, iframe_status_td = null;
        var servers_iframe = document.getElementById(status_iframe_id);
        var doc = servers_iframe.contentWindow.document;
        
        doc.body.innerHTML = xmlhttp.responseText;
        
        var links = doc.getElementsByTagName("a");

        for (a in links)
        { 
            if (!links[a])
                continue;
            
            if (links[a].className != "action")
            continue;
        
             if (links[a].href.indexOf("popupChangeStatus.pt") != -1)
                i_status_link = links[a]
        }
        
        
        iframe_status_td = i_status_link.parentNode.parentNode.childNodes[2];
        
        status_td.parentNode.replaceChild(iframe_status_td, status_td);
        doc.body.innerHTML = '';
    }
        
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function do_servers_link()
{
	var servers_text = servers_link.firstChild.nodeValue;
	var ser_text = servers_text.split('v')[0];
	var er_text = servers_text.split('v')[1];
    var underline_span = document.createElement("span");
	
	underline_span.style.textDecoration = "underline";
	underline_span.appendChild(document.createTextNode('v'));
	
    servers_link.href = "javascript:void(0);";
    servers_link.removeAttribute("onclick");
    servers_link.removeAttribute("target");
    servers_link.setAttribute("title", ":v to toggle change.");
    servers_link.id = servers_text;
    servers_link.addEventListener("click", servers_form, true);
    
    servers_link.replaceChild(document.createTextNode(ser_text),
                             servers_link.firstChild);
    servers_link.appendChild(underline_span);
    servers_link.appendChild(document.createTextNode(er_text));
}

function servers_form()
{
	var xmlhttp = get_xmlhttp();
	var url = "https://core.rackspace.com/py/ticket/changeServer.esp" +
			  "?ref_no=" + ref_no;
    
    current_servers = new Array();
    servers_td = servers_link.parentNode.parentNode.childNodes[2]
    
    for (var span in servers_td.childNodes)
    {
    	if (servers_td.childNodes[span].nodeName != "SPAN")
    	   continue;
    	var a_tag = servers_td.childNodes[span].firstChild.firstChild;
    	if (a_tag.href == undefined)
    	   a_tag = a_tag.nextSibling;
    	server = a_tag.firstChild.nodeValue;
    	current_servers.push(server);
    }
    
    servers_td.innerHTML = '';
    servers_td.appendChild(document.createTextNode("Please Wait... "));
    
    servers_iframe = document.createElement("iframe");
    servers_iframe.style.display = "none";
    servers_iframe.setAttribute("id", servers_iframe_id);
    servers_iframe.setAttribute("name", servers_iframe_name);
    servers_link.parentNode.appendChild(servers_iframe);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            servers_make_form(xmlhttp.responseText);
    }
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function servers_make_form(servers_html)
{
    var servers_form, subject_button;
    var account_servers = new Array();
    var statuses = new Array();
    var servers_iframe = document.getElementById(servers_iframe_id);
    var doc = servers_iframe.contentWindow.document;
    doc.body.innerHTML = servers_html;
    var divs = doc.getElementsByTagName("div");
    var servers_top_button = document.createElement("input")
    var servers_bottom_button = document.createElement("input")
  
    servers_form = document.createElement("form");
    servers_form.setAttribute("name", servers_form_name);
    servers_form.setAttribute("id", servers_form_id);
    
    servers_top_button.setAttribute("class", "form_button");
    servers_top_button.setAttribute("type", "button");
    servers_top_button.setAttribute("name", "Change");
    servers_top_button.setAttribute("value", "Change");
    servers_top_button.addEventListener("click", servers_post_form, true);

    servers_bottom_button.setAttribute("class", "form_button");
    servers_bottom_button.setAttribute("type", "button");
    servers_bottom_button.setAttribute("name", "Change");
    servers_bottom_button.setAttribute("value", "Change");
    servers_bottom_button.addEventListener("click", servers_post_form, true);
    
    servers_form.appendChild(servers_top_button);
            
    for (var span_id in divs[1].childNodes)
    {
     	if (!divs[1].childNodes[span_id])
           continue;       	   
             
       	var dc, server_name, logo, platform, server_status   
       	var span = divs[1].childNodes[span_id];
       	
       	if (!span.firstChild)
       	    continue;
       	else if (span.firstChild.nodeType != 1)
       	   continue;
       	   
       	var server_num = span.firstChild.value;    
       	var data_span = span.childNodes[2].firstChild;
    	
    	if (!server_num)
    	   continue;
    	
    	account_servers[server_num] = new Array();
    	
    	dc = data_span.childNodes[0].title.split(':')[0];
    	
    	server_name = data_span.childNodes[0].title.split(':')[1]
    	server_name = strip(server_name.split('(')[0]); 
        
        logo = data_span.childNodes[2].src;
        
        platform = data_span.childNodes[3].nodeValue;
        platform = strip(platform.substring(0, platform.length - 1));
        
        // Ok so lets remove the crap from the platform
        if (platform.indexOf("PowerEdge") != -1)
        {
        	var plat_array = platform.split(' ');
        	platform = plat_array.slice(3).join(' ');
        }
        else if (platform.indexOf("HP") != -1)
        {
        	var plat_array = platform.split(' ');
        	platform = plat_array.slice(2).join(' ');
        }
        
        var ent = platform.indexOf("Enterprise")
        if (ent != -1)
	        platform = strip(platform.substring(0, ent -1));
	        
	    var std = platform.indexOf("Standard");
	    if (std != -1)
	        platform = strip(platform.substring(0, std -1));
	        
	    var x64 = platform.indexOf("(x64)")
	    if (x64 != -1)
            platform = strip(platform.substring(0, x64 -1));
    	
    	server_status = data_span.childNodes[4].firstChild.nodeValue;
    	
    	account_servers[server_num]["dc"] = dc;
    	account_servers[server_num]["name"] = server_name;
    	account_servers[server_num]["logo"] = logo;
    	account_servers[server_num]["platform"] = platform;
    	account_servers[server_num]["status"] = server_status;
    	
    	if (!(server_status in oc(statuses)))
    	   statuses.push(server_status);
    }
    
    statuses.sort();
    
    for (var stat_num in statuses)
    {
    	var stat_odiv = document.createElement("div");
    	var stat_idiv = document.createElement("div");
    	var stat_div = document.createElement("div");
    	var stat_link = document.createElement("a");
    	var stat = statuses[stat_num];
    	
    	stat_link.href = "javascript:void(0);"
    	
    	stat_odiv.setAttribute("name", servers_stat_odiv_name_prefix + stat);
    	stat_odiv.setAttribute("id", servers_stat_odiv_id_prefix + stat);
    	
    	stat_idiv.setAttribute("name", servers_stat_idiv_name_prefix + stat);
    	stat_idiv.setAttribute("id", servers_stat_idiv_id_prefix + stat);
    	stat_idiv.setAttribute("title", "Click to expand.");
    	
    	if (stat in oc(servers_green_statuses))
    	   stat_link.style.color = "green";
    	   
    	else if (stat in oc(servers_blue_statuses))
    	   stat_link.style.color = "blue";
    	   
    	else if (stat in oc(servers_orange_statuses))
    	   stat_link.style.color = "orange";
    	   
    	else if (stat in oc(servers_grey_statuses))
    	   stat_link.style.color = "grey";
    	   
    	else if (stat in oc(servers_red_statuses))
    	   stat_link.style.color = "red";
    	   
    	else	
    	   stat_link.style.color = "black";
    	
    	stat_link.appendChild(document.createTextNode(stat));   
    	stat_idiv.appendChild(stat_link);
    	stat_idiv.addEventListener("click", server_show_div, false);
    	
    	stat_div.setAttribute("name", servers_stat_div_name_prefix + stat);
    	stat_div.setAttribute("id", servers_stat_div_id_prefix + stat);
    	if (stat == "Online/Complete")
    	{
    		stat_div.style.visibility = "visible";
    		stat_div.style.display = "block";
    	}
    	else
    	{
    	    stat_div.style.visibility = "hidden";
            stat_div.style.display = "none";
    	}
        stat_odiv.appendChild(stat_idiv);
        stat_odiv.appendChild(stat_div);
    	servers_form.appendChild(stat_odiv);
    	
    	
    }
    
    servers_td.innerHTML = '';
    servers_td.appendChild(servers_form);
    
    for (var server_num in account_servers)
    {
        var stat = account_servers[server_num]["status"];
        var platform = account_servers[server_num]["platform"];
        var logo = account_servers[server_num]["logo"];
        var dc = '(' + account_servers[server_num]["dc"] + ')';
        var server_name = account_servers[server_num]["name"];
        var stat_div = document.getElementById(servers_stat_div_id_prefix + 
                                               stat);
        var server_check_div = document.createElement("div");
        var server_check = document.createElement("input");
        var server_label = document.createElement("label");
        var server_label_span_num = document.createElement("span");
        var server_link = document.createElement("a");
        var server_label_span_plat = document.createElement("span");
        var server_label_span_dc = document.createElement("span");
        var server_logo = document.createElement("img");
        
        server_check_div.setAttribute("class", "CoreFormableCheckBoxList");
        
        server_check.setAttribute("type", "checkbox");
        server_check.setAttribute("name", server_num);
        server_check.setAttribute("id", server_num);
        
        if (server_num in oc(current_servers))
            server_check.setAttribute("checked", "");
        
        server_label.setAttribute("for", server_num);
        
        server_label_span_num.style.padding = "0.3em";
        server_label_span_plat.style.padding = "0.3em";
        server_label_span_dc.style.padding = "0.3em";
        
        server_label_span_num.setAttribute("title", server_name);
        
        server_logo.setAttribute("src", logo);
        
        server_link.setAttribute("href", "https://core.rackspace.com/server/" +
        		server_num);
        server_link.setAttribute("target", "_new");
        
        server_link.appendChild(document.createTextNode(server_num));
        
        server_label_span_num.appendChild(server_link);
        server_label_span_plat.appendChild(document.createTextNode(platform));
        server_label_span_dc.appendChild(document.createTextNode(dc));
        
        server_label.appendChild(server_label_span_num);
        server_label.appendChild(server_logo);
        server_label.appendChild(server_label_span_plat);
        server_label.appendChild(server_label_span_dc);
        
        server_check_div.appendChild(server_check);
        server_check_div.appendChild(server_label);
                                    
        stat_div.appendChild(server_check_div);
    	
    }
    servers_form.appendChild(servers_bottom_button);
}

function server_show_div()
{
	var idiv = this.parentNode.childNodes[1];
	if (idiv.style.visibility == "hidden")
    {
        idiv.style.visibility = "visible";
        idiv.style.display = "block";
    }
    else
    {
    	idiv.style.visibility = "hidden";
        idiv.style.display = "none";
    }
}

function servers_post_form()
{
	var servers_iframe = document.getElementById(servers_iframe_id);
    var doc = servers_iframe.contentWindow.document;
    var servers_iframe_body =  doc.getElementsByTagName("body")[0];
    var servers_iframe_form = doc.createElement("form");
    var servers_iframe_input_refno = doc.createElement("input");
    var servers_iframe_input_submit = doc.createElement("input");
    var servers_form = document.getElementById(servers_form_id);
    var servers_chks =  servers_form.getElementsByTagName("input");
    var url = "https://core.rackspace.com/py/ticket/changeServer.esp" +
              "?ref_no=" + ref_no;
              
    servers_iframe.addEventListener("load", servers_iframe_posted, false);
    
    servers_iframe_form.setAttribute("method", "post");
    servers_iframe_form.setAttribute("action", url);
    
    for (input in servers_chks)
    {
    	if (servers_chks[input].type != "checkbox")
    	    continue;
    	
    	if (!servers_chks[input].checked)
    	    continue;

    	var server_input = doc.createElement("input");
        var server_num = servers_chks[input].id;
        
    	server_input.setAttribute("type", "checkbox");
    	server_input.setAttribute("name", "FORMABLE::Form1::CheckBoxList1");
    	server_input.setAttribute("value", server_num);
    	server_input.setAttribute("checked", "");
    	
    	servers_iframe_form.appendChild(server_input);
    }
    
    servers_iframe_input_refno.setAttribute("name", "ref_no");
    servers_iframe_input_refno.setAttribute("value", ref_no);
    
    servers_iframe_input_submit.setAttribute("name",
                                             "FORMABLE::Form1::Button1");
    servers_iframe_input_submit.setAttribute("value", "Submit");
    
    servers_iframe_form.appendChild(servers_iframe_input_refno);
    servers_iframe_form.appendChild(servers_iframe_input_submit);
    
    servers_iframe_body.appendChild(servers_iframe_form);
    
    servers_td.innerHTML = '';
    servers_td.appendChild(document.createTextNode("Please Wait... "));
    
    servers_iframe_form.submit();
}

function servers_iframe_posted()
{
	var xmlhttp = get_xmlhttp();
	var url = "https://core.rackspace.com/py/ticket/view.pt?ref_no=" + ref_no;
	
	xmlhttp.onreadystatechange = function()
    {
        if (!(xmlhttp.readyState == 4 && xmlhttp.status == 200))
            return false;
            
        var i_servers_link, iframe_servers_td = null;
        var servers_iframe = document.getElementById(servers_iframe_id);
        var doc = servers_iframe.contentWindow.document;
        
        doc.body.innerHTML = xmlhttp.responseText;
        
        var links = doc.getElementsByTagName("a");

        for (a in links)
		{ 
			if (!links[a])
		        continue;
		    
		    if (links[a].className != "action")
		    continue;
		
		     if (links[a].href.indexOf("changeServer.esp") != -1)
		        i_servers_link = links[a];
		}
		
		
		iframe_servers_td = i_servers_link.parentNode.parentNode.childNodes[2];
		
		servers_td.innerHTML = iframe_servers_td.innerHTML;
		doc.body.innerHTML = '';
    }
        
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
}

function do_subject_link()
{
	var subject_text = subject_link.firstChild.nodeValue;
	var ubject_text = subject_text.split('S')[1];
	var underline_span = document.createElement("span");
	
	underline_span.style.textDecoration = "underline";
    underline_span.appendChild(document.createTextNode('S'));
	
	subject_link.href="javascript:void(0);";
	subject_link.removeAttribute("onclick");
    subject_link.removeAttribute("target");
    subject_link.setAttribute("title", ":s to toggle change.");
    subject_link.id = subject_text;
    subject_link.addEventListener("click", subject_field, true);
    
    subject_link.replaceChild(underline_span, subject_link.firstChild);
    subject_link.appendChild(document.createTextNode(ubject_text));
}

function subject_field()
{
	var xmlhttp = get_xmlhttp();
	var url = "https://core.rackspace.com/py/ticket/popupChangeSubject.pt" +
			  "?ref_no=" + ref_no;
    
    subject_td = subject_link.parentNode.parentNode.childNodes[2];
    current_subject = strip(subject_td.firstChild.nodeValue);
    subject_iframe = document.createElement("iframe");
    
    subject_td.innerHTML = '';
    subject_td.appendChild(document.createTextNode("Please Wait..."));
    
    subject_iframe.style.display = "none";
    subject_iframe.setAttribute("id", subject_iframe_id);
    subject_iframe.setAttribute("name", subject_iframe_name);
    subject_link.parentNode.appendChild(subject_iframe);
    
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            subject_make_field(xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null); 
}

function subject_make_field(subject_html)
{
    var subject_form, subject_field, subject_button;
    var subject_iframe = document.getElementById(subject_iframe_id);
    var doc = subject_iframe.contentWindow.document;
    doc.body.innerHTML = subject_html;
    
    subject_form = document.createElement("form");
    subject_form.setAttribute("name", subject_form_name);
    subject_form.setAttribute("id", subject_form_id);
    subject_form.addEventListener("submit", function(e){
    	e.preventDefault();
    }, true);
    
    subject_input = document.createElement("input");
    subject_input.setAttribute("name", subject_input_name);
    subject_input.setAttribute("id", subject_input_id);
    subject_input.setAttribute("value", current_subject);
    subject_input.addEventListener("keypress", subject_input_keypress, true);
    
    subject_button = document.createElement("input");
    subject_button.setAttribute("class", "form_button");
    subject_button.setAttribute("type", "button");
    subject_button.setAttribute("name", "Change");
    subject_button.setAttribute("value", "Change");
    subject_button.addEventListener("click", subject_post_form, true);
    
    subject_form.appendChild(subject_input);
    subject_form.appendChild(subject_button);
    
    subject_td.innerHTML = '';
    subject_td.appendChild(subject_form);
    
    subject_input.focus();
}

function subject_input_keypress(event)
{
    if (event.keyCode == 13)
        subject_post_form();
}

function subject_post_form()
{
	var subject_iframe = document.getElementById(subject_iframe_id);
    var doc = subject_iframe.contentWindow.document;
    var subject_iframe_body =  doc.getElementsByTagName("body")[0];
    var subject_input = document.getElementById(subject_input_id);
    var subject_iframe_form = doc.createElement("form");
    var subject_iframe_input_subject = doc.createElement("input");
    var subject_iframe_input_refno = doc.createElement("input");
    var subject_iframe_input_ok = doc.createElement("input");
    
    subject = subject_input.value;

    var url = "https://core.rackspace.com/py/ticket/popupChangeSubject.pt" +
              "?ref_no=" + ref_no;
    
    subject_iframe.addEventListener("load", subject_iframe_posted, false);
    
    subject_iframe_input_subject.setAttribute("name",
                                          "FORMABLE::subject_change::subject");
    subject_iframe_input_subject.setAttribute("value", subject);
    
    subject_iframe_input_ok.setAttribute("name",
                                               "FORMABLE::subject_change::ok");
    subject_iframe_input_ok.setAttribute("value", "OK");
    
    subject_iframe_input_refno.setAttribute("name", "ref_no");
    subject_iframe_input_refno.setAttribute("value", ref_no);
    
    subject_iframe_form.setAttribute("method", "post");
    subject_iframe_form.setAttribute("action", url);
    
    subject_iframe_form.appendChild(subject_iframe_input_subject);
    subject_iframe_form.appendChild(subject_iframe_input_ok);
    subject_iframe_form.appendChild(subject_iframe_input_refno);
    subject_iframe_body.appendChild(subject_iframe_form);
    
    subject_iframe_form.submit();
}

function subject_iframe_posted()
{
    subject_td.innerHTML = '';
    subject_td.appendChild(document.createTextNode(subject));
    
    subject_iframe = document.createElement("iframe");
    subject_iframe.style.display = "none";
    subject_iframe.setAttribute("id", subject_iframe_id);
    subject_iframe.setAttribute("name", subject_iframe_name);
    subject_link.parentNode.replaceChild(subject_iframe,
                            document.getElementById(subject_iframe_id));
}

function do_queue_link()
{
	
	var queue_text = queue_link.firstChild.nodeValue;
	var ueue_text = queue_text.split('Q')[1];
	var underline_span = document.createElement("span");
    
    underline_span.style.textDecoration = "underline";
    underline_span.appendChild(document.createTextNode('Q'));
    
	queue_link.href="javascript:void(0);";
	queue_link.removeAttribute("onclick");
	queue_link.removeAttribute("target");
	queue_link.setAttribute("title", ":q to toggle change.");
	queue_link.id = queue_text;
	queue_link.addEventListener("click", queue_list, true);
	
	queue_link.replaceChild(underline_span, queue_link.firstChild);
    queue_link.appendChild(document.createTextNode(ueue_text));
}

function queue_list()
{
	var xmlhttp = get_xmlhttp();
	var url = "https://core.rackspace.com/py/ticket/popupChangeQueue.pt" +
	          "?ref_no=" + ref_no;
	          
	queue_td = queue_link.parentNode.parentNode.childNodes[2];
	current_queue = strip(queue_td.firstChild.nodeValue);
	queue_iframe = document.createElement("iframe");
	
	queue_td.innerHTML = '';
    queue_td.appendChild(document.createTextNode("Please Wait..."));
	
	queue_iframe.style.display = "none";
	queue_iframe.setAttribute("id", queue_iframe_id);
    queue_iframe.setAttribute("name", queue_iframe_name);
	
	queue_link.parentNode.appendChild(queue_iframe);
	
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            queue_make_list(xmlhttp.responseText);
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null); 

}

function queue_iframe_posted()
{
    window.location.href = "https://core.rackspace.com/py/ticket/view.pt" +
            "?ref_no=" + ref_no;
}

function queue_make_list(queue_html)
{
	var queue_form, queue_select, queue_button;
	var queue_iframe = document.getElementById(queue_iframe_id);
    var doc = queue_iframe.contentWindow.document;
    doc.body.innerHTML = queue_html;
    var divs = doc.getElementsByTagName("div");
    
    // Get a list of the queues
    for (var div in divs)
    {
        if (!divs[div])
            continue;
        
        if (divs[div].className == "CoreFormableRadioButtonList")
        {
        	for (span in divs[div].childNodes)
        	{
        		if (divs[div].childNodes[span].nodeType != 1)
        			continue;
        		
        		s = divs[div].childNodes[span];
        		if (s.firstChild == null)
        			continue;
                        			
        		var queue_input = s.childNodes[1];
        		var queue_label = s.childNodes[3];
        		var label_text = '';
        		var string_index = -1;
        		
        		queues[queue_input.id] = new Array();
        		queues[queue_input.id]["id"] =  queue_input.value;
        		if (s.title.indexOf("(No Access)") != -1)
        			queues[queue_input.id]["access"] = false;
        		else
        			queues[queue_input.id]["access"] = true;
        	    
        	    if (queue_label.childNodes.length > 1)
        	    {
        	    	var label_span = queue_label.childNodes[1].firstChild;
        	    	label_text = strip(label_span.nodeValue);
        	    }
        	    else
        	    	label_text = strip(queue_label.firstChild.nodeValue);
        	    
        	    string_index = label_text.indexOf("(Server(s) not in this DC)");
        	    if (string_index != -1)
        	    {
        	    	queues[queue_input.id]["dc"] = false;
        	    	label_text = strip(label_text.substring(0, string_index));
        	    }
        	    else
        	        queues[queue_input.id]["dc"] = true;
        	       
        	    queues[queue_input.id]["label"] = label_text; 		 
        		
         	}
        	
        }
    }
    
    // Create a form for us to use and the hidden warning div
    queue_alert_div = document.createElement("div");
    queue_alert_div.setAttribute("name", queue_alert_div_name);
    queue_alert_div.setAttribute("id", queue_alert_div_id);
    queue_alert_div.style.visibility = "hidden";
    queue_alert_div.style.display = "none";
    queue_alert_div.style.color = "red";
    queue_alert_div.appendChild(document.createTextNode(queue_alert_text));
    
    queue_dc_alert_div = document.createElement("div");
    queue_dc_alert_div.setAttribute("name", queue_dc_alert_div_name);
    queue_dc_alert_div.setAttribute("id", queue_dc_alert_div_id);
    queue_dc_alert_div.style.visibility = "hidden";
    queue_dc_alert_div.style.display = "none";
    queue_dc_alert_div.style.color = "red";
    queue_dc_alert_div.appendChild(
                            document.createTextNode(queue_dc_alert_text)
                            );
    
    queue_form = document.createElement("form");
    queue_form.setAttribute("name", queue_form_name);
    queue_form.setAttribute("id", queue_form_id);
    
    queue_select = document.createElement("select");
    queue_select.setAttribute("name", queue_select_name);
    queue_select.setAttribute("id", queue_select_id);
    queue_select.addEventListener("keypress", queue_select_keypress, true);
    queue_select.addEventListener("change", queue_warn, true);
    
    queue_button = document.createElement("input");
    queue_button.setAttribute("class", "form_button");
    queue_button.setAttribute("type", "button");
    queue_button.setAttribute("name", "Change");
    queue_button.setAttribute("value", "Change");
    queue_button.addEventListener("click", queue_post_form, true);
    
    for (var queue in queues)
    {
    	var queue_option = document.createElement("option");
    	var option_text = queues[queue]["label"];
    	
    	if (strip(option_text) == "(current)")
    	{
    	    option_text = current_queue;
    	    queue_option.defaultSelected = true;
    	}
    	queue_option.setAttribute("value", queues[queue]["id"]);
    	queue_option.appendChild(document.createTextNode(option_text));
    	queue_select.appendChild(queue_option);
    }
    
    
    queue_form.appendChild(queue_select);
    queue_form.appendChild(queue_button);
    
    queue_td.innerHTML = '';
    queue_td.appendChild(queue_alert_div);
    queue_td.appendChild(queue_dc_alert_div);
    queue_td.appendChild(queue_form);
    
    queue_select.focus();
}

function queue_select_keypress(event)
{
    if (event.keyCode == 13)
        queue_post_form();
}

function queue_post_form()
{
	var queue_iframe = document.getElementById(queue_iframe_id);
    var doc = queue_iframe.contentWindow.document;
    var queue_iframe_body =  doc.getElementsByTagName("body")[0];
    var queue_select = document.getElementById(queue_select_id);
    var queue_iframe_form = doc.createElement("form");
    var queue_iframe_input_queue = doc.createElement("input");
    var queue_iframe_input_change = doc.createElement("input");
    var selected_index = queue_select.selectedIndex;
    var queue_selected = queue_select.options[selected_index].value;
    var url = "https://core.rackspace.com/py/ticket/popupChangeQueue.pt" +
              "?ref_no=" + ref_no;
    
    queue_iframe.addEventListener("load", queue_iframe_posted, false);
    
    queue_iframe_input_queue.setAttribute("name", "queue");
    queue_iframe_input_queue.setAttribute("value", queue_selected);
    
    queue_iframe_input_change.setAttribute("name", "Change");
    queue_iframe_input_change.setAttribute("value", "Change");
    
    queue_iframe_form.setAttribute("method", "post");
    queue_iframe_form.setAttribute("action", url);
    
    queue_iframe_form.appendChild(queue_iframe_input_queue);
    queue_iframe_form.appendChild(queue_iframe_input_change);
    queue_iframe_body.appendChild(queue_iframe_form);
    
    queue_iframe_form.submit();
}

function queue_iframe_posted()
{
	window.location.href = "https://core.rackspace.com/py/ticket/view.pt" +
			"?ref_no=" + ref_no;
}
function queue_warn()
{
	var queue_select = document.getElementById(queue_select_id);
	var selected_index = queue_select.selectedIndex;
	var selected_queue = queue_select.options[selected_index].value;
	
	queue_alert_div = document.getElementById(queue_alert_div_id);
	queue_dc_alert_div = document.getElementById(queue_dc_alert_div_id);
	
	for (var queue in queues)
	{
		if (queues[queue]["id"] != selected_queue)
            continue;

        if (queues[queue]["access"])
        {
		    queue_alert_div.style.visibility = "hidden";
		    queue_alert_div.style.display = "none";
        }
		else
		{
		    queue_alert_div.style.visibility = "visible";
		    queue_alert_div.style.display = "block";
		}
		
		if (queues[queue]["dc"])
		{
			queue_dc_alert_div.style.visibility = "hidden";
            queue_dc_alert_div.style.display = "none";
		}
		else
		{
			queue_dc_alert_div.style.visibility = "visible";
            queue_dc_alert_div.style.display = "block";
		}
	}
	
}

function logger(tag, value)
{
    if (debug_me == true)
        unsafeWindow.console.log(tag+": ", value);  
}

function get_xmlhttp()
{
    var xmlhttp=null;
        
    xmlhttp = new XMLHttpRequest();

    if (xmlhttp == null)
        alert("Wiskey Tango Foxtrot!  Your browser doesn't do XMLHTTP!");

    return xmlhttp;
}

function beavis()
{
    alert("beavis");
}
