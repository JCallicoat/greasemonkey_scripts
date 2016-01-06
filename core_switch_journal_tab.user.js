// ==UserScript==
// @id             core_switch_journal_tab
// @name           Switch tab to journal in CORE
// @version        1.0
// @namespace      jcallicoat
// @author         Jordan Callicoat
// @description    Switch tab to journal in CORE
// @include        https://core.rackspace.com/ticket/*
// @include        https://core.rackspace.com/py/ticket/view.pt*
// @grant          GM_get
// @grant          GM_set
// @run-at         document-end
// ==/UserScript==

unsafeWindow.settab('journal');
