import Parse from "parse/react-native";
import {
    AsyncStorage
} from "react-native";

import Item from "../components/item"

const SERVER_URL = "http://192.168.0.9:1337/parse/";
const APP_ID = "testItems";
const MASTER_KEY = "123456";

var view;

export default class ParseData {
    
    constructor(context) {
        view = context;
        Parse.setAsyncStorage(AsyncStorage);
        Parse.serverURL = SERVER_URL;
        Parse.initialize(APP_ID, MASTER_KEY);
    }

    initializeList = () => {
        const query = new Parse.Query(Item);
        query.find({
            success: this._onQueryFindSuccess,
            error: this._onQueryFindError,
        });
        this.registerLiveQuery(query);
    };

    _onQueryFindSuccess = results => {
        console.log("Successfully retrieved " + results.length + " items.");
        view.setState({
            items: results
        });
    }

    _onQueryFindError = error => {
        alert("Error: " + error.code + " " + error.message);
    }

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

    addItemParse = (itemName, itemFile) => {
        let item = new Item();
        item.set("nome",itemName);
        item.set("file",itemFile);
        item.save(null,{
            success: this._onItemSaveSuccess,
            error: this._onItemSaveError,
        });
    };

    _onItemSaveSuccess = item => {
        console.log(item.id + " added");
    }
    
    _onItemSaveError = (item, error) => {
        alert("Failed to create new object, with error code: " + error.message);
    }

    deleteItemParse = item => {
        item.destroy({
            success: this._onItemDestroySuccess,
            error: this._onItemDestroyError,
        });
    };

    _onItemDestroySuccess = myObject => {
        console.log("Deleted object: " + myObject.id);
        view.deleteItemOnState(myObject);
    };

    _onItemDestroyError = (myObject, error) => {
        console.log("Failed deleting object. Error: " + error);
    };

    addFileParse = async filePicked => {
        let blob = await this._convertFileToBlob(filePicked);
        let reader = new FileReader();
        reader.onload = () => {
            let base64 = reader.result;
            let file = new Parse.File("filename", {base64})
            view.addFileToState(file)
        };
        reader.onerror = this._onReaderError;
        reader.readAsDataURL(blob);
    }

    _convertFileToBlob = async filePicked => {
        let blob = await fetch(filePicked.uri)
            .then(res => res.blob())
            .then(blob => {
                return blob
            });

        return blob;
    }

    _onReaderError = error => {
        alert("Error: " + error.code + " " + error.message);
    }

}