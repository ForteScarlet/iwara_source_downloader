'use strict';
{
  /**
   * 動画の情報を取得してbackgroundへ投げる
   */
  let getInfo = (request, sender, sendResponse) => {
    let button = document.getElementById("download-button");
    button.click();
    let links = document.getElementById("download-options").getElementsByTagName('a');
    let info = document.getElementsByClassName('node-info')[0];
    let title = info.getElementsByTagName('h1');
    let username = info.getElementsByTagName('img');
    let html_lang = document.getElementsByTagName('html')[0].lang;
    if(html_lang === 'ja') {
      username = username[0].title.replace("ユーザー ","").replace(" の写真","");
    } else if(html_lang === 'en') {
      username = username[0].title.replace(/(&#39;)/, "'").replace("'s picture","");
    } else if(html_lang === 'zh-hans') {
      username = username[0].title.replace("的头像", "");
    } else {
      username = username[0].title.replace("Bild des Benutzers ", "");
    }
    let posted_date = info.textContent.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
    let year = posted_date[1];
    let month = posted_date[2];
    let day = posted_date[3];
    let hour = posted_date[4];
    let minute = posted_date[5];

    let video_id = new URL(request.current_url).pathname.split("/").pop();

    if(links[0].href.indexOf("_Source") != -1){
      chrome.runtime.sendMessage({
        source_url: links[0].href,
        title: title[0].innerText,
        username: username,
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        video_id: video_id
      });
    }
  }

  /**
   * backgroundからのメッセージを受信したらgetInfoを実行
   */
  chrome.runtime.onMessage.addListener(getInfo);
}
