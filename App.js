import React from 'react';
import {StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {itens} from "./itens.js"
import Parse from 'parse/react-native'
import {AsyncStorage} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.iniciaParse();
    this.state = {
      itens: itens,
      nomeItem: ''
    };
    this.iniciaLista();
  }

  iniciaParse = () => {
    Parse.setAsyncStorage(AsyncStorage);
    Parse.initialize("testeLivros", "123456");
    Parse.serverURL = 'http://192.168.0.9:1337/parse/'
  };

  iniciaLista = () => {

  };

  adicionaItem = () => {
    console.log(this.state.nomeItem);
    let item = new Item();
    // item.set("nome", this.state.nomeItem);
    item.save(
      {
        nome: this.state.nomeItem,
      }, {
        success: function (gameScore) {
          alert('New object created with objectId: ' + gameScore.id);
        },

        error: function (gameScore, error) {
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>

          <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => this.setState({nomeItem: text})}
            placeholder='Título do novo item'
            value={this.state.nomeItem}/>

          <Button
            title="Adicionar"
            onPress={this.adicionaItem}/>

        </View>

        <FlatList
          data={this.state.itens}
          renderItem={({item}) => <ListElement item={item}/>}
        />
      </View>
    );
  }
}

class ListElement extends React.Component {
  render() {
    return (
      <View style={styles.horizontal}>
        <View style={styles.itemContainer}>
          <Text>{this.props.item}</Text>
          <TouchableOpacity>

            <MaterialIcons
              name={'delete'}
              size={25}
              color={'#ae261f'}/>

          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class Item extends Parse.Object {

  constructor() {
    super('Item');
  }

}


const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: '#fff',
  },

  inputContainer: {
    flexWrap: 'wrap',
    padding: 10,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  textInputStyle: {
    padding: 2,
    height: 40,
    flex: 1
  },

  horizontal: {},

  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

});

