import Parse from "parse/react-native";
import { AsyncStorage } from "react-native";

import Item from "../components/item";

const SERVER_URL = "http://192.168.0.9:1337/parse/";
const APP_ID = "testItems";
const MASTER_KEY = "123456";

var view;

export default class ParseReadDelete {
  constructor(context) {
    view = context;
  }

  initParse = () => {
    Parse.setAsyncStorage(AsyncStorage);
    Parse.serverURL = SERVER_URL;
    Parse.initialize(APP_ID, MASTER_KEY);
  };

  initializeList = () => {
    const query = new Parse.Query(Item);
    query.find({
      success: this._onQueryFindSuccess,
      error: this._onQueryFindError
    });
    this.registerLiveQuery(query);
  };

  _onQueryFindSuccess = results => {
    console.log("Successfully retrieved " + results.length + " items.");
    view.setState({
      items: results
    });
  };

  _onQueryFindError = error => {
    alert("Error: " + error.code + " " + error.message);
  };

  registerLiveQuery = query => {
    let subscription = query.subscribe();
    subscription.on("create", object => {
      view.addItemOnState(object);
    });
    subscription.on("update", object => {
      view.updateItemOnState(object);
    });
    subscription.on("delete", object => {
      view.deleteItemOnState(object);
    });
  };

  deleteItemParse = item => {
    item.destroy({
      success: this._onItemDestroySuccess,
      error: this._onItemDestroyError
    });
  };

  _onItemDestroySuccess = myObject => {
    console.log("Deleted object: " + myObject.id);
    view.deleteItemOnState(myObject);
  };

  _onItemDestroyError = (myObject, error) => {
    console.log("Failed deleting object. Error: " + error);
  };
}
