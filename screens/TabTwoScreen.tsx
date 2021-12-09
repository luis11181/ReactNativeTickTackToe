import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { useEffect, useState, useRef } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Button } from "react-native";
import { Text, View } from "../components/Themed";

import { uiActions } from "../store/ui-slice";
import { useSelector, useDispatch } from "react-redux";

import {
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

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

export default function TabTwoScreen({ navigation }) {
  const [cargo, setCargo] = useState(false);
  const [render, setRender] = useState([]);

  async function getgames() {
    const q = query(collection(db, "users"), where("cupo", "==", true));
    let result = [];
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      result.push(doc.id);
    });

    let transformresult = result.map((item) => (
      <Button
        title={"Enter available game:   " + item.substring(0, 3)}
        onPress={() => {
          navigation.navigate("OnlineScreen2", { idgame: item });
        }}
      />
    ));

    setRender(transformresult);
    setCargo(true);
  }

  if (cargo === false) {
    getgames();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create or select game</Text>
      <View style={styles.flex}>
        <Button
          color="orange"
          title="create game"
          onPress={() => {
            navigation.navigate("OnlineScreen");
          }}
        />
        <Text> </Text>
        {cargo && render}
        {!cargo && <Text>cargando</Text>}

        <Text> </Text>

        <Button
          color="orange"
          title="refresh"
          onPress={() => {
            setCargo(false);
          }}
        />
      </View>
    </View>
  );
}
