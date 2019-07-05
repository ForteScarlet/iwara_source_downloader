/*
browser.storage.localにアドオンの設定を保存
*/
function storeSettings() {

  let filename_definition = document.getElementById("filename_definition");

  chrome.storage.local.set({
    filename_definition: filename_definition.value
  }, updateStatus);

}

/*
オプションページを開いたときに現在の設定を反映する
ローカルストレージに設定がないときは空
*/
function updateUI(restoredSettings) {
  let filename_definition = document.getElementById("filename_definition");

  if (typeof restoredSettings.filename_definition !== "undefined") {
    filename_definition.value = restoredSettings.filename_definition;
  } else {
    filename_definition.value = '?username? - ?title?';
  }
}

/**
 * オプションページを開いたときに現在の設定を反映する
 * ストレージに設定がないときは空
 */
const gettingStoredSettings = chrome.storage.local.get(updateUI);

let updateStatus = () => {
  var status = document.getElementById('status');
  status.textContent = '保存しました';

  setTimeout(function() {
    status.textContent = '';
  }, 750);
}

/**
 * 現在の設定を保存する
 */
document.getElementById("save-button").addEventListener("click", storeSettings);
