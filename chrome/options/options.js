/*
browser.storage.localにアドオンの設定を保存
*/
function storeSettings() {

  function getRadio() {
    const checked = document.querySelector("input[name=filename]:checked");
    if(checked !== null){
      return checked.id;
    }
  }

  const checkedRadio = getRadio();
  chrome.storage.local.set({
    "filename":checkedRadio
  });
  chrome.storage.local.set({
    "posted_date": document.getElementById("posted_date").checked
  });

}

/*
オプションページを開いたときに現在の設定を反映する
ローカルストレージに設定がないときは空
*/
function updateUI(restoredSettings) {

  const radiobuttons = document.querySelectorAll("input[name=filename]");
  if (typeof restoredSettings.filename !== "undefined") {
    for (let radiobutton of radiobuttons) {
      if (restoredSettings.filename.indexOf(radiobutton.id) != -1) {
        radiobutton.checked = true;
      } else {
        radiobutton.checked = false;
      }
    }
  }

  if(restoredSettings.posted_date){
    document.getElementById("posted_date").checked = true;
  }

}

function onError(e) {
  console.error(e);
}

/*
オプションページを開いたときに現在の設定を反映する
*/
const gettingStoredSettings = chrome.storage.local.get(updateUI);
//gettingStoredSettings.then(updateUI, onError);

/*
現在の設定を保存する
*/
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
