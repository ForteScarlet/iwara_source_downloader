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
  var username = info.getElementsByTagName('a');

  browser.runtime.sendMessage({
    source_url: links[0].href,
    title: convertSafeFileName(title[0].innerHTML),
    username: convertSafeFileName(username[1].innerHTML)
  });
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
  var safeStr = titleOrUsername
    .replace(/\\/g,'￥')
    .replace(/\//g,'／')
    .replace(/:/g,'：')
    .replace(/\?/g,'？')
    .replace(/"/g,'”')
    .replace(/</g,'＜')
    .replace(/>/g,'＞')
    .replace(/\|/g,'｜');
  return safeStr;
}
