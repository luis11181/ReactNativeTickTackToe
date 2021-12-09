import * as React from "react";
import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { BackHandler } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

export default function TabThreeScreen({ navigation }) {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>reset scores and data?</Text>
      <View style={styles.flex}>
        <Button
          title="No, go to game"
          onPress={() => {
            navigation.navigate("NewGame");
          }}
        />
        <Text> </Text>

        <Button
          title="Yes, Reset"
          onPress={() => {
            dispatch(uiActions.difficulty(1));
            dispatch(uiActions.computerWins(0));
            dispatch(uiActions.personWins(0));
            dispatch(uiActions.ties(0));
            navigation.navigate("NewGame");
          }}
        />
      </View>
    </View>
  );

  //* old quit options
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Are you sure you want to quit?</Text>
  //     <View style={styles.flex}>
  //       <Button
  //         title="No, go to game"
  //         onPress={() => {
  //           navigation.navigate("NewGame");
  //         }}
  //       />
  //       <Text> </Text>

  //       <Button
  //         title="Yes, Quit"
  //         onPress={() => {
  //           BackHandler.exitApp();
  //         }}
  //       />
  //     </View>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  flex: {
    flexDirection: "row",
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
