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
      filename_definition: '?username? - ?title?',
      save_location: '',
      auto_down: false
    },(settings)=>{
      let saved_dates = getDate(new Date());
      let filename = settings.filename_definition
        .replace(/\?title\?/g, info.title)
        .replace(/\?username\?/g, info.username)
        .replace(/\?year\?/g, info.year)
        .replace(/\?month\?/g, info.month)
        .replace(/\?day\?/g, info.day)
        .replace(/\?hour\?/g, info.hour)
        .replace(/\?minute\?/g, info.minute)
        .replace(/\?like\?/g, info.like)
        .replace(/\?view\?/g, info.view)
        .replace(/\?saved-year\?/g, saved_dates.year)
        .replace(/\?saved-month\?/g, saved_dates.month)
        .replace(/\?saved-day\?/g, saved_dates.day)
        .replace(/\?saved-hour\?/g, saved_dates.hour)
        .replace(/\?saved-minute\?/g, saved_dates.minute)
        .replace(/\?video-id\?/g, info.video_id)
      filename = convertSafeFileName(filename)
      filename += '.mp4';

      if(settings.save_location.length != 0){
        let save_location = settings.save_location
          .replace(/\?title\?/g, info.title)
          .replace(/\?username\?/g, info.username)
          .replace(/\?year\?/g, info.year)
          .replace(/\?month\?/g, info.month)
          .replace(/\?day\?/g, info.day)
          .replace(/\?hour\?/g, info.hour)
          .replace(/\?minute\?/g, info.minute)
          .replace(/\?like\?/g, info.like)
          .replace(/\?view\?/g, info.view)
          .replace(/\?saved-year\?/g, saved_dates.year)
          .replace(/\?saved-month\?/g, saved_dates.month)
          .replace(/\?saved-day\?/g, saved_dates.day)
          .replace(/\?saved-hour\?/g, saved_dates.hour)
          .replace(/\?saved-minute\?/g, saved_dates.minute)
          .replace(/\?video-id\?/g, info.video_id)
          .replace(/\//g, '__delimiter__')
        save_location = convertSafeFileName(save_location)
        save_location = save_location.replace(/__delimiter__/g, "/")
        if(save_location.slice(0,1) == "/"){
          save_location = save_location.slice(1)
        }
        if(save_location.slice(-1) != "/"){
          save_location += "/"
        }
        filename = save_location + filename
      }

      let saveas = true;
      if(settings.save_location.length != 0 && settings.auto_down){
        saveas = false;
      }

      chrome.downloads.download({
        url : info.source_url,
        filename: filename,
        conflictAction : 'uniquify',
        saveAs : saveas
      });
    });
  }

  /*
  down.jsから動画情報を受け取ってダウンロードを開始する
  */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    executeDownload(request);
    sendResponse({});
    return true;
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
   * ゼロパディングした日時を取得
   *
   * @param {Date} d 日付
   */
  let getDate = (d) => {
    return {
      'year': d.getFullYear().toString().padStart(4, '0'),
      'month': (d.getMonth()+1).toString().padStart(2, '0'),
      'day': d.getDate().toString().padStart(2, '0'),
      'hour': d.getHours().toString().padStart(2, '0'),
      'minute': d.getMinutes().toString().padStart(2, '0'),
    }
  };

  /**
   * アップデート時にメッセージを表示
   */
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "update" && details.previousVersion === "1.3.2") {
      browser.runtime.openOptionsPage();
    }
  });
}