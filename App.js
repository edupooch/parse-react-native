import React from 'react';
import {StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {DocumentPicker} from 'expo';
import Parse from 'parse/react-native'
import {AsyncStorage} from 'react-native';

const SERVER_URL = 'http://192.168.0.9:1337/parse/';
const APP_ID = 'testeLivros';
const MASTER_KEY = '123456';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itens: [],
      itemName: '',
      fileBase64: undefined
    };
    this.initializeParse();
    this.initializeList();
  }

  // PARSE //////////////////////////////
  initializeParse = () => {
    Parse.setAsyncStorage(AsyncStorage);
    Parse.serverURL = SERVER_URL;
    Parse.initialize(APP_ID, MASTER_KEY);
  };

  initializeList = () => {
    const query = new Parse.Query(Item);

    query.find({
      success: results => {
        console.log("Successfully retrieved " + results.length + " itens.");
        this.setState({itens: results});
      },
      error: error => {
        alert("Error: " + error.code + " " + error.message);
      }
    });
    this.registerLiveQuery(query);
  };

  registerLiveQuery = query => {
    let subscription = query.subscribe();
    subscription.on('create', (object) => {
      this.addItemOnState(object);
    });
    subscription.on('update', (object) => {
      this.updateItemOnState(object)
    });
    subscription.on('delete', (object) => {
      this.deleteItemOnState(object)
    });
  };

  addItemParse = (itemName, fileBase64) => {
    let item = new Item();
    item.save({nome: itemName, arquivo: fileBase64},
      {
        success: item => {
          console.log(item.id + " added")
        },
        error: (item, error) => {
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });
  };

  deleteItemParse = (item) => {
    item.destroy({
      success: myObject => {
        console.log("Objeto deletado: " + myObject.id);
        this.deleteItemOnState(myObject);
      },
      error: function (myObject, error) {
        console.log("Falha ao deletar objeto. Erro: " + error)
      }
    });
  };

  addItemOnState = object => {
    let itens = this.state.itens;
    itens.push(object);
    this.setState({itens: itens})
  };

  updateItemOnState = object => {
    let itens = this.state.itens;
    const index = itens.indexOf(itens.find(item => item.id === object.id));
    itens[index] = object;
    this.setState({itens: itens});
  };

  deleteItemOnState = object => {
    this.setState({
      itens: this.state.itens.filter(item => item.id !== object.id)
    });
  };

  addFileBase64ToState = async filePicked => {
    await fetch(filePicked.uri)
      .then(res => res.blob())
      .then(blob => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          this.setState({fileBase64: new Parse.File("filename", {base64: reader.result})})
        };
        reader.onerror = (error) => {
          throw new Error("There was an error reading the file " + error);
        };
      });
  };

  // CLICKS /////////////
  _onClickAdd = () => {
    this.addItemParse(this.state.itemName, this.state.fileBase64);
    //limpa state
    this.setState({itemName: "", fileBase64: undefined});
  };

  _onClickDelete = (item) => {
    this.deleteItemParse(item);
  };

  _onClickPickFile = async () => {
    let filePicked = await DocumentPicker.getDocumentAsync();
    if (filePicked.type === "success") {
      console.log("User selected the file in " + filePicked.uri);
      this.addFileBase64ToState(filePicked);
    } else if (filePicked.type === "failed") {
      console.log("User cancelled the file picking");
    }
  };

  // VIEW ///////////////////////////////
  render() {
    return (
      <View style={styles.container}>

        <View style={styles.inputContainer}>

          <TouchableOpacity
            onPress={this._onClickPickFile}
            style={styles.btContainer}>

            <MaterialIcons
              name={'image'}
              size={35}
              color={this.state.fileBase64 ? '#367ec1' : '#dddddd'}/>

          </TouchableOpacity>

          <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => this.setState({itemName: text})}
            placeholder='Insert new item'
            value={this.state.itemName}/>

          <Button
            title="Add"
            onPress={this._onClickAdd}/>
        </View>

        <Text style={styles.textItem}>
          {this.state.itens.length} items
        </Text>

        <FlatList
          data={this.state.itens}
          extraData={this.state}
          renderItem={({item}) => <ListElement item={item} deleteItem={this._onClickDelete}/>}
          keyExtractor={(item) => (item.id)}/>
      </View>
    );
  }
}

const ListElement = props => (
  <View style={styles.itemContainer}>

    <Image
      style={styles.imageItem}
      source={{uri: props.item.get("arquivo").url()}}/>

    <Text style={{flex: 1}}>{props.item.get("nome")}</Text>

    <TouchableOpacity onPress={() => props.deleteItem(props.item)}>

      <MaterialIcons
        name={'delete'}
        size={25}
        color={'#ae261f'}/>

    </TouchableOpacity>
  </View>
);

class Item extends Parse.Object {
  constructor() {
    super('Item');
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 10,
    marginBottom: 100,
    backgroundColor: '#fff',
  },

  inputContainer: {
    padding: 10,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  textInputStyle: {
    padding: 2,
    height: 40,
    flex: 1
  },

  btContainer: {
    paddingRight: 5,
  },

  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  textItem: {
    alignSelf: "center"
  },

  imageItem: {
    marginRight: 10,
    width: 35,
    height: 40
  }

});
