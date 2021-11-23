/*
browser.storage.localにアドオンの設定を保存
*/
function storeSettings() {

  let auto_like = document.getElementById("auto_like");
  let filename_definition = document.getElementById("filename_definition");
  let download_modes = document.getElementsByName("download_mode");
  let download_mode = "1";

  for (let i = 0; i < download_modes.length; i++) {
    if (download_modes[i].checked) {
      download_mode = download_modes[i].value;
      break;
    }
  }

  chrome.storage.local.set({
    auto_like: auto_like.checked,
    download_mode: download_mode,
    filename_definition: filename_definition.value
  }, updateStatus);

}

/*
オプションページを開いたときに現在の設定を反映する
ローカルストレージに設定がないときは空
*/
function updateUI(restoredSettings) {
  document.getElementById('auto_like').checked = restoredSettings.auto_like;

  if (typeof restoredSettings.download_mode !== "undefined") {
    document.getElementById('download_mode'+restoredSettings.download_mode).checked = true
  }else{
    document.getElementById('download_mode1').checked = true
  }

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
