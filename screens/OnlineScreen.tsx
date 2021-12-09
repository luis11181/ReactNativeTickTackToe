import * as React from "react";
import { StyleSheet, Image, Dimensions } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

import { useEffect, useState, useRef } from "react";
import { storeData, getData } from "../store/localStorage";
import { TouchableOpacity } from "react-native";
import update from "immutability-helper";
import { uiActions } from "../store/ui-slice";
import { useSelector, useDispatch } from "react-redux";
import { Audio } from "expo-av";

import {
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

const gameMatrix = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },

  cell: {
    width: 110,
    height: 110,
    borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },

  celllandscape: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },

  cellText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  cellImage: {
    width: 90,
    height: 90,
  },
  cellImagelandscape: {
    width: 50,
    height: 50,
  },
});

const X_SYMBOL = "X";
const O_SYMBOL = "O";

const getWinner = (gameStage: any) => {
  let transposed = [[], [], []];
  let diagonals = [[], []];
  for (let i = 0; i < gameStage.length; i++) {
    const row = gameStage[i];
    for (let j = 0; j < row.length; j++) {
      transposed[i][j] = gameStage[j][i];
      if (i === j) {
        diagonals[0][i] = gameStage[i][j];
      }
      if (i === Math.abs(j - (row.length - 1))) {
        diagonals[1][i] = gameStage[i][j];
      }
    }
  }

  const allLines = gameStage.concat(transposed).concat(diagonals);
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    const isEqual = line.every((item) => item === line[0]);
    if (isEqual) {
      return line[0];
    }
  }

  return null;
};

export default function OnlineScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const dispatch = useDispatch();
  const winnerSymbol = useSelector((state) => state.ui.multiwinnerSymbol);
  const gameStage = useSelector((state) => state.ui.multigameStage);

  const cupo = useSelector((state) => state.ui.multicupo);
  //const [gameStage, setGameStage] = useState(gameMatrix);
  const turnSymbol = useSelector((state) => state.ui.multiturnSymbol);
  const [id, setid] = useState(makeid(5).toString());
  const [allInfo, setAllInfo] = useState(null);
  //const [winnerSymbol, setWinnerSymbol] = useState<string | undefined>();
  //  const [isHuman, setHuman] = useState(true);

  /*
  //add sound
  const stumm = useSelector((state) => state.ui.stumm);
  const [sound, setSound] = useState<any>();

  const x1 = require(`../assets/x.mp3`);
  const o1 = require(`../assets/o.mp3`);

  async function playSound() {
    //console.log("Loading Sound");

    const { sound } = await Audio.Sound.createAsync(x1);
    setSound(sound);
    //console.log("Loading Sound222222222222");

    //console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          //console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  //end sound
  async function playSound2() {
    //console.log("Loading Sound");

    const { sound } = await Audio.Sound.createAsync(o1);
    setSound(sound);
    //console.log("Loading Sound222222222222");
    //console.log(sound);

    //console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          // console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  //end sound

  */

  ///////////////////////////
  //generate map to make the grid od x and 0
  const generateMap = (mapData: any, callback) => {
    const mapJsx = [];
    let mostrar;
    for (let i = 0; i < mapData.length; i++) {
      const row = mapData[i];
      const rowJsx = [];
      //create the array of objects
      for (let j = 0; j < row.length; j++) {
        mostrar = <View />;
        if (mapData[i][j] === null) {
          mostrar = <View />;
        } else if (mapData[i][j] === "X") {
          mostrar = (
            <Image
              style={portrait ? styles.cellImage : styles.cellImagelandscape}
              source={require("../assets/x.png")}
            />
          );
        } else if (mapData[i][j] === "O") {
          mostrar = (
            <Image
              style={portrait ? styles.cellImage : styles.cellImagelandscape}
              source={require("../assets/o.png")}
            />
          );
        }
        rowJsx.push(
          <TouchableOpacity
            onPress={() => {
              callback(i, j);
              //if (!stumm) {
              //  playSound();
              //}
            }}
            style={portrait ? styles.cell : styles.celllandscape}
            key={`cell_${i}_${j}`}
          >
            {mostrar}
          </TouchableOpacity>
        );
      }
      mapJsx.push(
        <View style={styles.row} key={`row_${i}`}>
          {rowJsx}
        </View>
      );
    }

    return mapJsx;
  };

  /////////////////////////////////////

  const hasNulls = (inputArray) => {
    let hasNulls = false;
    for (let i = 0; i < inputArray.length; i++) {
      const row = inputArray[i];
      for (let j = 0; j < row.length; j++) {
        if (inputArray[i][j] === null) {
          hasNulls = true;
        }
      }
    }

    return hasNulls;
  };
  //console.log(winsComputer);

  //********************************************** */
  //! code firebase to create the board and subscribe to changes

  // Set the "capital" field of the city 'DC'

  useEffect(() => {
    async function a() {
      try {
        await setDoc(doc(db, "users", id), {
          id: id,
          gameStage: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
          ].map((x) => {
            return { a: x };
          }),
          winnerSymbol: null,
          cupo: true,
          turnSymbol: O_SYMBOL,
        });

        cambioFirebase();
      } catch (err) {
        console.error(err);
      }

      // console.log("localData", localData);
    }
    a();
  }, []);

  //useEffect(() => {}, []);

  //! if there are chanches in firebase it will update local state
  async function cambioFirebase() {
    try {
      console.log("cambioFirebase corrio la funcion con onsnapshot");

      onSnapshot(doc(db, "users", id), (doc) => {
        //setAllInfo(doc.data()); //Write here wahtever you want
        //* sincroniza firebase con mi estado local de redux
        console.log(
          "log doc.data() dentro de on snapshot, antes de entrar",
          doc.data()
        );
        if (doc.data() !== null) {
          console.log("doc.data()distinto de null,entro");
          dispatch(
            uiActions.multigameStage(
              doc.data().gameStage.map((x) => Object.values(x)[0])
            )
          );
          dispatch(uiActions.multiwinnerSymbol(doc.data().winnerSymbol));
          dispatch(uiActions.multicupo(doc.data().cupo));
          dispatch(uiActions.multiturnSymbol(doc.data().turnSymbol));
          //make a timer to run in one second
          setTimeout(() => {
            console.log("gamestage inside snapshot", gameStage);
            console.log("winnerSymbol inside snapshot", winnerSymbol);
            console.log("cupo inside snapshot", cupo);
            console.log("turnSymbol inside snapshot", turnSymbol);
          }, 1000);
          //console.log("allInfo", allInfo);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  //********************************************** */
  //! code to see if the app is in portrait mode,

  /**
   * Returns true if the screen is in portrait mode
   */
  const isPortrait = () => {
    const dim = Dimensions.get("screen");
    return dim.height >= dim.width;
  };

  /**
   * Returns true of the screen is in landscape mode
   */
  const isLandscape = () => {
    const dim = Dimensions.get("screen");
    return dim.width >= dim.height;
  };

  // Event Listener for orientation changes
  Dimensions.addEventListener("change", () => {
    let orientation = isPortrait() ? true : false;
    dispatch(uiActions.portrait(orientation));
  });

  let portrait = useSelector((state) => state.ui.portrait);
  //console.log("portrait", portrait);

  //* ***************************************************

  return (
    <View
      style={
        portrait
          ? { flex: 1, flexDirection: "column" }
          : { flex: 1, flexDirection: "row" }
      }
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          minWidth: "40%",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 25 }}>
            {!winnerSymbol && `It's  ${turnSymbol}'s turn`}
          </Text>

          <Text style={{ fontSize: 25 }}>{winnerSymbol}</Text>
          {winnerSymbol && (
            <TouchableOpacity
              onPress={() => {
                //dispatch(uiActions.gameStage(gameMatrix));

                let newStageFirebase = gameMatrix.map((x) => {
                  return { a: x };
                });
                updateDoc(doc(db, "users", id), {
                  gameStage: newStageFirebase,
                });
                //setTurnSymbol(X_SYMBOL);
                //dispatch(uiActions.winnerSymbol(undefined));
                updateDoc(doc(db, "users", id), {
                  winnerSymbol: null,
                });
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  textTransform: "uppercase",
                  color: "red",
                }}
              >
                {" <restart>"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View
        style={{
          flex: 6,
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
        }}
      >
        {generateMap(gameStage, (i, j) => {
          console.log(
            "if to check if user can play or not",
            "winnerSymbol",
            winnerSymbol,
            "gameStage",
            gameStage,
            "gameStage[i][j]",
            gameStage[i][j],
            "turnSymbol",
            turnSymbol
          );

          if (winnerSymbol || gameStage[i][j] || turnSymbol !== O_SYMBOL) {
            console.log("entro al if, no deja hacer nada", turnSymbol);

            //console.log("aaaaa ishuman", isHuman);
            return;
          } else {
            console.log("segundo el else", turnSymbol);
            console.log("clicked", i, j);
            // console.log("aaaaa ishuman", isHuman);
            // new stage updates the current stage changing the value that wqs played
            const newStage = update(gameStage, {
              [i]: {
                [j]: { $set: turnSymbol },
              },
            });

            //! only runs for human player
            //changes the siymble, there was a change in turn
            //nextTurnSymbol();
            updateDoc(doc(db, "users", id), {
              turnSymbol: X_SYMBOL,
            });
            //*dispatch(uiActions.gameStage(newStage));
            let newStageFirebase = newStage.map((x) => {
              return { a: x };
            });

            updateDoc(doc(db, "users", id), {
              gameStage: newStageFirebase,
            });

            const winner = getWinner(newStage);
            if (winner) {
              console.log("entro al if (winner)");

              //setWinnerSymbol(`${winner} wins!`);
              if (winner === "O") {
                //dispatch(uiActions.winnerSymbol("O wins!"));
                updateDoc(doc(db, "users", id), {
                  winnerSymbol: "O wins!",
                });
              }
              if (winner === "X") {
                updateDoc(doc(db, "users", id), {
                  winnerSymbol: "X wins!",
                });
              }
              //if (isHuman) {
              //  setTurnSymbol(X_SYMBOL);
              //} else {
              //  setTurnSymbol(O_SYMBOL);
              //}
            } else if (!hasNulls(newStage)) {
              console.log("entro al else if (!hasNulls(newStage))");
              //dispatch(uiActions.winnerSymbol("It is a tie!"));
              updateDoc(doc(db, "users", id), {
                turnSymbol: "It is a tie!",
              });
            }
            //setHuman(false);
          }
        })}
      </View>
    </View>
  );
}
