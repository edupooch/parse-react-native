import React from 'react';
import {StyleSheet, Text, View, Button, TextInput, FlatList, TouchableOpacity, Image} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import {DocumentPicker, FileSystem} from 'expo';
import Parse from 'parse/react-native'
import {AsyncStorage} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itens: [],
      nomeItem: '',
      arquivoBase64: undefined
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
    this.registraLiveQuery(query);
  };

  registraLiveQuery = query => {
    let subscription = query.subscribe();
    subscription.on('create', (object) => {
      this.criaObjetoLocal(object);
    });
    subscription.on('update', (object) => {
      this.atualizaObjetoLocal(object)
    });
    subscription.on('delete', (object) => {
      this.deletaObjetoLocal(object)
    });
  };

  adicionaItemParse = (nomeItem, arquivoBase64) => {
    let item = new Item();
    item.save({nome: nomeItem, arquivo: arquivoBase64},
      {
        success: item => {
          console.log(item.id + " adicionado")
        },

        error: (item, error) => {
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });
  };

  deletaItemParse = (item) => {
    item.destroy({
      success: myObject => {
        console.log("Objeto deletado: " + myObject.id);
        this.deletaObjetoLocal(myObject);
      },
      error: function (myObject, error) {
        console.log("Falha ao deletar objeto. Erro: " + error)
      }
    });
  };

  criaObjetoLocal = object => {
    let itens = this.state.itens;
    itens.push(object);
    this.setState({itens: itens})
  };

  atualizaObjetoLocal = object => {
    let itens = this.state.itens;
    const index = itens.indexOf(itens.find(item => item.id === object.id));
    itens[index] = object;
    this.setState({itens: itens});
  };

  deletaObjetoLocal = object => {
    this.setState({
      itens: this.state.itens.filter(item => item.id !== object.id)
    });
  };

  criaArquivoLocal = async documentPicked => {
    await fetch(documentPicked.uri)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          this.setState({arquivoBase64: new Parse.File("arquivo", {base64: reader.result})})
        };
        reader.onerror = (error) => {
          throw new Error("There was an error reading the file " + error);
        };
      });
  };


  _onClickAdicionar = () => {
    this.adicionaItemParse(this.state.nomeItem, this.state.arquivoBase64);
    this.setState({nomeItem: "", arquivoBase64: undefined});
  };

  _onClickDeletar = (item) => {
    this.deletaItemParse(item);
  };

  _onClickPickDocument = async () => {
    let documentPicked = await DocumentPicker.getDocumentAsync();
    if (documentPicked.type === "success") {
      console.log("User selected the file in " + documentPicked.uri);
      this.criaArquivoLocal(documentPicked);
    } else if (documentPicked.type === "failed") {
      console.log("User cancelled the file picking");
    }
  };

  // VIEW ///////////////////////////////
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>

          <TouchableOpacity
            onPress={this._onClickPickDocument}
            style={styles.btContainer}>

            <MaterialIcons
              name={'image'}
              size={35}
              color={this.state.arquivoBase64 ? '#367ec1' : '#dddddd'}/>

          </TouchableOpacity>

          <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => this.setState({nomeItem: text})}
            placeholder='Título do novo item'
            value={this.state.nomeItem}/>

          <Button
            title="Adicionar"
            onPress={this._onClickAdicionar}/>
        </View>

        <Text style={styles.textoItem}>
          {this.state.itens.length} itens
        </Text>

        <FlatList
          data={this.state.itens}
          extraData={this.state}
          renderItem={({item}) => <ListElement item={item} deletaItem={this._onClickDeletar}/>}
          keyExtractor={(item) => (item.id)}/>
      </View>
    );
  }
}

const ListElement = props => (
  <View style={styles.itemContainer}>

    <Image
      style={styles.imagemItem}
      source={{uri: props.item.get("arquivo").url()}}/>

    <Text style={{flex: 1}}>{props.item.get("nome")}</Text>

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

  textoItem: {
    alignSelf: "center"
  },

  imagemItem: {
    marginRight: 10,
    width: 35,
    height: 40
  }

});