'use strict';
{
  /*
  アイコンがクリックされたときにdown.jsへメッセージを送信する
  */
  chrome.pageAction.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {"current_url": tab.url});
  });

  let executeDownload = (info) => {
    chrome.storage.local.get({
      filename_definition: '?username? - ?title?'
    },(settings)=>{
      let filename = settings.filename_definition
        .replace(/\?title\?/g, info.title)
        .replace(/\?username\?/g, info.username)
        .replace(/\?year\?/g, info.year)
        .replace(/\?month\?/g, info.month)
        .replace(/\?day\?/g, info.day)
        .replace(/\?hour\?/g, info.hour)
        .replace(/\?minute\?/g, info.minute)
        .replace(/\?video-id\?/g, info.video_id)
      filename = convertSafeFileName(filename)
      filename += '.mp4';

      chrome.downloads.download({
        url : info.source_url,
        filename: filename,
        conflictAction : 'uniquify',
        saveAs : true
      });
    });
  }

  /*
  down.jsから動画情報を受け取ってダウンロードを開始する
  */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    executeDownload(request);
  });

  /*
  タブのURLにiwara.tv/videos/があればアイコンを表示
  */
  let checkForValidUrl = (tabId, changeInfo, tab) => {
    if (tab.url.indexOf("iwara.tv/videos/") > -1) {
      chrome.pageAction.show(tabId);
    }
  }

  /*
  タブの切り替えを捕捉
  */
  chrome.tabs.onUpdated.addListener(checkForValidUrl);

  /**
   * 使用できない文字を全角に置き換え
   * ¥　/　:　*　?　"　<　>　| tab
   *
   * @param {String} str 変換したい文字列
   */
  let convertSafeFileName = (titleOrUsername) => {
    return unEscapeHTML(titleOrUsername)
      .replace(/\\/g,'￥')
      .replace(/\//g,'／')
      .replace(/:/g,'：')
      .replace(/\*/g,'＊')
      .replace(/\?/g,'？')
      .replace(/"/g,'”')
      .replace(/</g,'＜')
      .replace(/>/g,'＞')
      .replace(/\|/g,'｜')
      .replace(/\t/g, '　');
  }

  /**
   * HTMLアンエスケープ
   *
   * @param {String} str 変換したい文字列
   */
  let unEscapeHTML = (str) => {
    return str
      .replace(/(&lt;)/g, '<')
      .replace(/(&gt;)/g, '>')
      .replace(/(&quot;)/g, '"')
      .replace(/(&#39;)/g, "'")
      .replace(/(&amp;)/g, '&');
  };

  /**
   * アップデート時にメッセージを表示
   */
  chrome.runtime.onInstalled.addListener((OnInstalledReason) => {
    console.info(Notification.permission );
    if (OnInstalledReason.reason === "update") {
      browser.runtime.openOptionsPage();
    }
  });
}