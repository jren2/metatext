/*global chrome*/

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Get context',
    contexts: ['selection'],
    id: 'getContext',
  });
});