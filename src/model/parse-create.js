import Parse from "parse/react-native";
import Item from "../components/item";

var view;

export default class ParseCreate {
  constructor(context) {
    view = context;
  }

  addItemParse = (itemName, itemFile) => {
    let item = new Item();
    item.set("nome", itemName);
    item.set("file", itemFile);
    item.save(null, {
      success: this._onItemSaveSuccess,
      error: this._onItemSaveError
    });
  };

  _onItemSaveSuccess = item => {
    console.log(item.id + " added");
  };

  _onItemSaveError = (item, error) => {
    alert("Failed to create new object, with error code: " + error.message);
  };

  addFileParse = async filePicked => {
    let blob = await this._convertFileToBlob(filePicked);
    let reader = new FileReader();
    reader.onload = () => {
      let base64 = reader.result;
      let file = new Parse.File("filename", {
        base64
      });
      view.addFileToState(file);
    };
    reader.onerror = this._onReaderError;
    reader.readAsDataURL(blob);
  };

  _convertFileToBlob = async filePicked => {
    let blob = await fetch(filePicked.uri)
      .then(res => res.blob())
      .then(blob => {
        return blob;
      });

    return blob;
  };

  _onReaderError = error => {
    alert("Error: " + error.code + " " + error.message);
  };
}
