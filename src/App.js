import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,  
} from "react-native";
import { DocumentPicker } from "expo";
import { MaterialIcons } from "@expo/vector-icons";

//local imports
import ListElement from "./components/list-element"
import ParseData from './model/parse-data'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemName: "",
      itemFile: undefined
    };
   
    this.dados = new ParseData(this);
    this.dados.initializeList();
  }

  addItemOnState = object => {
    let items = this.state.items;
    items.push(object);
    this.setState({
      items: items
    });
  };

  updateItemOnState = object => {
    let items = this.state.items;
    const index = items.indexOf(items.find(item => item.id === object.id));
    items[index] = object;
    this.setState({
      items: items
    });
  };

  deleteItemOnState = object => {
    this.setState({
      items: this.state.items.filter(item => item.id !== object.id)
    });
  };

  addFileToState = itemFile => {
    this.setState({
      itemFile: itemFile
    });
  };

  cleanState = () => {
    this.setState({
      itemName: "",
      itemFile: undefined
    });
  }

  _onClickAdd = () => {
    this.dados.addItemParse(this.state.itemName, this.state.itemFile);
    this.cleanState();
  };

  _onClickDelete = item => {
    this.dados.deleteItemParse(item);
  };

  _onClickPickFile = async () => {
    let filePicked = await DocumentPicker.getDocumentAsync();
    if (filePicked.type === "success") {
      this.dados.addFileParse(filePicked);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={this._onClickPickFile}
            style={styles.btContainer}
          >
            <MaterialIcons
              name={"image"}
              size={35}
              color={this.state.itemFile ? "#367ec1" : "#dddddd"}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.textInputStyle}
            onChangeText={text => this.setState({ itemName: text })}
            placeholder="Insert new item"
            value={this.state.itemName}
          />

          <View style={styles.btContainer}>
            <Button title="Add" onPress={this._onClickAdd} />
          </View>
        </View>

        <Text style={styles.textItem}>{this.state.items.length} items</Text>

        <FlatList
          data={this.state.items}
          extraData={this.state}
          renderItem={({ item }) => (
            <ListElement item={item} deleteItem={this._onClickDelete} />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 10,
    marginBottom: 100,
    backgroundColor: "#fff"
  },

  inputContainer: {
    padding: 5,
    alignItems: "flex-start",
    flexDirection: "row"
  },

  textInputStyle: {
    flex: 1,
    padding: 2,
    height: 40,
  },

  btContainer: {
    paddingRight: 5,
    paddingLeft: 5,
  },
});
