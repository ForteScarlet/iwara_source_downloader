/*
アイコンがクリックされたときにdown.jsへメッセージを送信する
*/
chrome.pageAction.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {"download": "run"});
});

/*
down.jsから動画情報を受け取ってダウンロードを開始する
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    chrome.storage.local.get(["filename","posted_date"],((settings)=>{

      var filename = request.username + ' - ' + request.title;
      if (typeof settings.filename !== "undefined") {
        if(settings.filename.indexOf("type1") != -1){
          filename = request.username + ' - ' + request.title;
        } else if(settings.filename.indexOf("type2") != -1) {
          filename = '['+request.username+'] ' + request.title;
        } else {
          filename = request.title;
        }
      }
      if(typeof settings.posted_date !== "undefined"){
        if(settings.posted_date){
          filename += "_" + request.posted_date;
        }
      }
      filename += '.mp4';

      function onStartedDownload(id) {
        //console.log("Started to download: "+id);
      }

      function onFailed(error) {
        //console.log("Something stinks: "+error);
      }

      var startDownload = chrome.downloads.download({
        url : request.source_url,
        filename: filename,
        conflictAction : 'prompt',
        saveAs : true
      });

      //startDownload.then(onStartedDownload, onFailed);
    }));
});

/* エラーログ */
function onError(e) {
  console.error(e);
}

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