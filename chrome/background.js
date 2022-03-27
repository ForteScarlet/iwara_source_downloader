'use strict';
{

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
   * 使用できない文字を全角に置き換え
   * ¥　/　:　*　?　"　<　>　| tab
   * chromeのみ
   * 半角チルダを全角チルダへ変換
   * 半角ピリオドを全角ピリオドへ変換
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
      .replace(/\t/g, '　')
      .replace(/~/g,'～')
      .replace(/\./g,'．');
  }

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

  let executeDownload = (info) => {
    chrome.storage.local.get({
      filename_definition: '?username? - ?title?',
      download_mode: '1'
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

      if(settings.download_mode == "2"){
        let listener = (downloadItem, callback) => {
          callback({filename: filename})
          chrome.downloads.onDeterminingFilename.removeListener(listener)
        }
        chrome.downloads.onDeterminingFilename.addListener(listener)
      }else if(settings.download_mode == "3"){
        // chrome.declarativeNetRequest.updateDynamicRules({
        //   addRules:[
        //     {
        //       "id": 1,
        //       "priority": 1,
        //       "action": {
        //         "type": "modifyHeaders",
        //         "responseHeaders": [
        //           // { "header": "content-disposition", "operation": "set", "value": 'attachment; filename="'+filename+'"' }
        //           { "header": "content-disposition", "operation": "remove" }
        //         ]
        //       },
        //       "condition": {"urlFilter": "*://*.iwara.tv/file.php*", "resourceTypes": ["main_frame", "sub_frame", "xmlhttprequest", "media", "other"]}
        //     }
        //   ],
        //   removeRuleIds: [1]
        // })
      }

      chrome.downloads.download({
        url : info.source_url,
        filename: filename,
        conflictAction : 'prompt',
        // saveAs : true
      },function(id){});
    });
  }

  /**
   * アイコンがクリックされたときにdown.jsへメッセージを送信する
   */
  chrome.action.onClicked.addListener((tab) => {
    if (tab.url.indexOf("iwara.tv") > -1) {
      chrome.tabs.sendMessage(tab.id, {"current_url": tab.url});
    }
  });

  /**
   * down.jsから動画情報を受け取ってダウンロードを開始する
   */
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    executeDownload(request);
    sendResponse({});
    return true;
  });

  /**
   * アップデート時にメッセージを表示
   */
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "update" && details.previousVersion === "1.3.2") {
      alert("Iwara Source Downloaderはversion2.0.0にアップデートされました。保存時のファイル名設定が変わったので確認をお願いします。\n------\nPlease check filename setting.");
    }
  });
}