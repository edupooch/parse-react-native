import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button
} from "react-native";
import { DocumentPicker } from "expo";
import { MaterialIcons } from "@expo/vector-icons";

import ParseCreate from "../model/parse-create";

export default class InputAddItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      itemFile: undefined
    };
    this.dados = new ParseCreate(this);
  }

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
  };

  _onClickAdd = () => {
    this.dados.addItemParse(this.state.itemName, this.state.itemFile);
    this.cleanState();
  };

  _onClickPickFile = async () => {
    let filePicked = await DocumentPicker.getDocumentAsync();
    if (filePicked.type === "success") {
      this.dados.addFileParse(filePicked);
    }
  };

  render() {
    return (
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
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 5,
    alignItems: "flex-start",
    flexDirection: "row"
  },

  textInputStyle: {
    flex: 1,
    padding: 2,
    height: 40
  },

  btContainer: {
    paddingRight: 5,
    paddingLeft: 5
  }
});
