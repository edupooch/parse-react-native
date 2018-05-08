import React from 'react';
import { StyleSheet, Text, View, Header, Button, TextInput } from 'react-native';



export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ListView />
      </View>
    );
  }
}

class ListView extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Header
                    centerComponent={{ text: 'Listinha', style: { color: '#fff' } }}
                />

                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({text})}
                    value='Título do novo item'
                />
                <Button
                    onPress={onPressAddItem}
                    title="Adicionar"
                    color="#841584"
                    accessibilityLabel="Adicionar"
                />

                <FlatList
                    data={/*array de items*/}
                    renderItem={({item}) => item}
                />
            </View>
        );
    }
}

class ListElement extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Título do item</Text>
                <Button
                    onPress={onPressDeleteItem}
                    title="Deletar"
                    color="#841584"
                    accessibilityLabel="Deletar"
                />
            </View>
        );
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
