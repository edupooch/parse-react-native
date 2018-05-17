import React from 'react';
import { StyleSheet,View,Image,Text,TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialIcons } from "@expo/vector-icons";


const ListElement = props => (
    <View style={styles.itemContainer}>
      <Image
        style={styles.imageItem}
        source={{
          uri: props.item.get("file") ? props.item.get("file").url() : null
        }}
      />
  
      <Text style={{ flex: 1 }}>{props.item.get("nome")}</Text>
  
      <TouchableOpacity onPress={() => props.deleteItem(props.item)}>
        <MaterialIcons name={"delete"} size={25} color={"#ae261f"} />
      </TouchableOpacity>
    </View>
  );
  
  ListElement.propTypes = {
    item: PropTypes.object,
    deleteItem: PropTypes.func
  };

  const styles = StyleSheet.create({
    itemContainer: {
      flex: 1,
      margin: 5,
      padding: 5,
      paddingLeft: 10,
      alignItems: "center",
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
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

  export default ListElement; 