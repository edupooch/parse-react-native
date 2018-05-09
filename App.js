import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import {itens} from './itens.js'

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ListView itens = {itens}/>
      </View>
    );
  }
}

export class ListView extends React.Component {
    render(props) {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({text})}
                        value='Título do novo item'
                    />

                    <Button
                        title="Adicionar"
                        color="#000088"
                        accessibilityLabel="Adicionar"
                    />
                </View>

                <FlatList
                    data={this.props.itens}
                    renderItem={({item}) => <ListElement item={item}/>}
                />
            </View>
        );
    }
}

class ListElement extends React.Component {
    render() {
        return (
            <View style={styles.itemContainer}>
                <Text>{this.props.item}</Text>
                <Button
                    title="Deletar"
                    color="#880000"
                    accessibilityLabel="Deletar"
                />
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection:'row',
    },
    itemContainer: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection:'row',
    }
});

