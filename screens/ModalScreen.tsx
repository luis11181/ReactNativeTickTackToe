import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Button } from "react-native";
import { Text, View } from "../components/Themed";

import { uiActions } from "../store/ui-slice";
import { useSelector, useDispatch } from "react-redux";

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default function ModalScreen({ navigation }) {
  const difficulty = useSelector((state) => state.ui.difficulty);
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a difficulty level</Text>
      <View style={styles.flex}>
        <Button
          title="Easy"
          onPress={() => {
            navigation.navigate("NewGame");
            dispatch(uiActions.difficulty(1));
          }}
        />
        <Text> </Text>

        <Button
          title="Harder"
          onPress={() => {
            navigation.navigate("NewGame");
            dispatch(uiActions.difficulty(2));
          }}
        />

        <Text> </Text>

        <Button
          title="Expert"
          onPress={() => {
            navigation.navigate("NewGame");
            dispatch(uiActions.difficulty(3));
          }}
        />
      </View>
    </View>
  );
}
