import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

//local imports
import ListElement from "./components/list-element";
import ParseRD from "./model/parse-read-delete";
import InputAddItem from "./components/input-add-item";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemName: "",
      itemFile: undefined
    };

    this.dados = new ParseRD(this);
    this.dados.initParse();
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

  _onClickDelete = item => {
    this.dados.deleteItemParse(item);
  };

  render() {
    return (
      <View style={styles.container}>
        <InputAddItem />

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

  textItem: {
    alignSelf: "center"
  }
});
