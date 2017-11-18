/*
動画の情報を取得してbackgroundへ投げる
取得する情報：
  ・SourceのURL
  ・タイトル
  ・アップロードしたユーザーの名前
*/
function getInfo(){
  var button = document.getElementById("download-button");
  button.click();
  var links = document.getElementById("download-options").getElementsByTagName('a');
  var info = document.getElementsByClassName('node-info')[0];
  var title = info.getElementsByTagName('h1');
  var username = info.getElementsByTagName('img');
  var html_lang = document.getElementsByTagName('html')[0].lang;
  if(html_lang === 'ja') {
    username = username[0].title.replace("ユーザー ","").replace(" の写真","");
  } else if(html_lang === 'en') {
    username = username[0].title.replace(/(&#39;)/, "'").replace("'s picture","");
  } else if(html_lang === 'zh-hans') {
    username = username[0].title.replace("的头像", "");
  } else {
    username = username[0].title.replace("Bild des Benutzers ", "");
  }

  if(links[0].href.indexOf("_Source") != -1){
    browser.runtime.sendMessage({
      source_url: links[0].href,
      title: convertSafeFileName(title[0].innerHTML),
      username: convertSafeFileName(username)
    });
  }
}

/*
backgroundからのメッセージを受信したらgetInfoを実行
*/
chrome.runtime.onMessage.addListener(getInfo);

/*
使用できない文字を全角に置き換え
¥　/　:　*　?　"　<　>　|
*/
function convertSafeFileName(titleOrUsername){
  return unEscapeHTML(titleOrUsername)
    .replace(/\\/g,'￥')
    .replace(/\//g,'／')
    .replace(/:/g,'：')
    .replace(/\*/g,'＊')
    .replace(/\?/g,'？')
    .replace(/"/g,'”')
    .replace(/</g,'＜')
    .replace(/>/g,'＞')
    .replace(/\|/g,'｜');
}

/**
 * HTMLアンエスケープ
 *
 * @param {String} str 変換したい文字列
 */
var unEscapeHTML = function (str) {
    return str
      .replace(/(&lt;)/g, '<')
      .replace(/(&gt;)/g, '>')
      .replace(/(&quot;)/g, '"')
      .replace(/(&#39;)/g, "'")
      .replace(/(&amp;)/g, '&');
};
