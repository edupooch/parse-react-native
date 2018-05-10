import React from 'react';
import {StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import Parse from 'parse/react-native'
import {AsyncStorage} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itens: [],
      nomeItem: ''
    };
    this.iniciaParse();
    this.iniciaLista();
  }

  // PARSE //////////////////////////////
  iniciaParse = () => {
    Parse.setAsyncStorage(AsyncStorage);
    Parse.serverURL = 'http://192.168.0.9:1337/parse/';
    Parse.initialize("testeLivros", "123456");
  };

  iniciaLista = () => {
    const Item = Parse.Object.extend("Item");
    const query = new Parse.Query(Item);
    query.limit(3000);
    query.notEqualTo("nome", "bb");
    query.find({
      success: results => {
        console.log("Successfully retrieved " + results.length + " itens.");
        this.setState({itens: results});
      },
      error: error => {
        alert("Error: " + error.code + " " + error.message);
      }
    });

    this.registraLiveQuery(query);
  };

  registraLiveQuery = query => {
    let subscription = query.subscribe();
    subscription.on('create', (object) => {
      this.criaObjeto(object);
    });
    subscription.on('update', (object) => {
      this.atualizaObjeto(object)
    });
    subscription.on('delete', (object) => {
      this.deletaObjeto(object)
    });
  };

  criaObjeto = object => {
    let itens = this.state.itens;
    itens.push(object);
    this.setState({itens: itens})
  };

  atualizaObjeto = object => {
    let itens = this.state.itens;
    const index = itens.indexOf(itens.find(item => item.id === object.id));
    itens[index] = object;
    this.setState({itens: itens});
  };

  deletaObjeto = object => {
    this.setState({
      itens: this.state.itens.filter(item => item.id !== object.id)
    });
  };

  //CONTROLE ////////////////////////////
  _adicionaItem = () => {
    this.setState({nomeItem: ""});

    let item = new Item();
    item.save({nome: this.state.nomeItem},
      {
        success: item => {
          console.log(item.id + " adicionado")
        },

        error: (gameScore, error) => {
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });
  };

  _deletaItem = (item) => {
    item.destroy({
      success: myObject => {
        console.log("Objeto deletado: " + myObject.id);
        this.deletaObjeto(myObject);
      },
      error: function (myObject, error) {
        console.log("Falha ao deletar objeto. Erro: " + error)
      }
    });
  };

  // VIEW ///////////////////////////////
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
            onPress={this._adicionaItem}/>
        </View>

        <Text style={{alignSelf: "center"}}>
          {this.state.itens.length} itens
        </Text>

        <FlatList
          data={this.state.itens}
          extraData={this.state}
          renderItem={({item}) => <ListElement item={item} deletaItem={this._deletaItem}/>}
          keyExtractor={(item) => (item.id)}/>

      </View>
    );
  }
}

const ListElement = props => (
    <View style={styles.itemContainer}>

      <Text>{props.item.get("nome")}</Text>

      <TouchableOpacity onPress={() => props.deletaItem(props.item)}>

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


