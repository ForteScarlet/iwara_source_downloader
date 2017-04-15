/*
アイコンがクリックされたときにdown.jsへメッセージを送信する
*/
browser.pageAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {"download": "run"});
});

/*
down.jsから動画情報を受け取ってダウンロードを開始する
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    function onStartedDownload(id) {
      //console.log("Started to download: "+id);
    }

    function onFailed(error) {
      //console.log("Something stinks: "+error);
    }

    var startDownload = browser.downloads.download({
      url : request.source_url,
      filename: request.username + ' - ' + request.title + '.mp4',
      conflictAction : 'uniquify',
      saveAs : true
    });

    startDownload.then(onStartedDownload, onFailed);
});

/*
タブのURLにiwara.tv/videos/があればアイコンを表示
*/
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf("iwara.tv/videos/") > -1) {
    chrome.pageAction.show(tabId);
  }
}

/*
タブの切り替えを捕捉
*/
chrome.tabs.onUpdated.addListener(checkForValidUrl);
