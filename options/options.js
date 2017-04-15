/*
browser.storage.localにアドオンの設定を保存
*/
function storeSettings() {

  function getRadio() {
    const checked = document.querySelector("input[name=filename]:checked");
    return checked.id;
  }

  const checkedRadio = getRadio();
  browser.storage.local.set({
    "filename":checkedRadio
  });

}

/*
オプションページを開いたときに現在の設定を反映する
ローカルストレージに設定がないときは空
*/
function updateUI(restoredSettings) {

  const radiobuttons = document.querySelectorAll("input[name=filename]");
  for (let radiobutton of radiobuttons) {
    if (restoredSettings.filename.indexOf(radiobutton.id) != -1) {
      radiobutton.checked = true;
    } else {
      radiobutton.checked = false;
    }
  }

}

function onError(e) {
  console.error(e);
}

/*
オプションページを開いたときに現在の設定を反映する
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
現在の設定を保存する
*/
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
