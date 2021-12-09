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

const gameMatrix = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

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

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const dispatch = useDispatch();
  const winnerSymbol = useSelector((state) => state.ui.winnerSymbol);
  const gameStage = useSelector((state) => state.ui.gameStage);
  const difficulty = useSelector((state) => state.ui.difficulty);

  //const [gameStage, setGameStage] = useState(gameMatrix);
  const [turnSymbol, setTurnSymbol] = useState(O_SYMBOL);
  //const [winnerSymbol, setWinnerSymbol] = useState<string | undefined>();
  const [isHuman, setHuman] = useState(true);
  const winsComputer = useSelector((state) => state.ui.computerWins);
  const winsHuman = useSelector((state) => state.ui.personWins);
  const Ties = useSelector((state) => state.ui.ties);

  const nextTurnSymbol = () => {
    setTurnSymbol(turnSymbol === X_SYMBOL ? O_SYMBOL : X_SYMBOL);
  };

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
              if (!stumm) {
                playSound();
              }
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

  useEffect(() => {
    //! computer moves, hook that runs for computer moves
    const asyncwait = setTimeout(() => {
      if (!isHuman && !winnerSymbol) {
        //set a one second timeout, that does not make any action, just waits
        if (!stumm) {
          playSound2();
        }

        if (difficulty == 1) {
          let posicionpcx = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
          let posicionpcy = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
          while (gameStage[posicionpcx][posicionpcy]) {
            posicionpcx = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            posicionpcy = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            console.log(posicionpcx, posicionpcy);
          }
          const newStage = update(gameStage, {
            [posicionpcx]: {
              [posicionpcy]: { $set: turnSymbol },
            },
          });
          //changes the siymble, there was a change in turn
          nextTurnSymbol();
          dispatch(uiActions.gameStage(newStage));
          const winner = getWinner(newStage);
          if (winner) {
            //setWinnerSymbol(`${winner} wins!`);
            if (winner === "O") {
              dispatch(uiActions.winnerSymbol("Human wins!"));
              dispatch(uiActions.personWins(winsHuman + 1));
            }
            if (winner === "X") {
              dispatch(uiActions.winnerSymbol("Computer wins!"));
              dispatch(uiActions.computerWins(winsComputer + 1));
            }
            if (isHuman) {
              setTurnSymbol(X_SYMBOL);
            } else {
              setTurnSymbol(O_SYMBOL);
            }
          } else if (!hasNulls(newStage)) {
            dispatch(uiActions.winnerSymbol("It is a tie!"));
            dispatch(uiActions.ties(Ties + 1));
          }

          setHuman(true);
        }
        //* mpves for level 2 bot
        if (difficulty == 2) {
          //* codigo para bloquear todo movimiento en eje x
          let posicionpcx;
          let posicionpcy;
          let salir = false; //define si hay una buena jugada para salir del ciclo y jugar
          let hayjugada = false; //define si hay una buena jugada para que no ejecute los ptros bloqueos
          for (let i = 0; i < gameStage.length; i++) {
            const row = gameStage[i];
            let str = "";
            let numerodeo = 0;
            let haynulo = false;
            if (salir) {
              break;
            }

            salir = false;
            // console.log(gameStage[i]);
            for (let j = 0; j < row.length; j++) {
              if (gameStage[i][j] !== null) {
                str = str + gameStage[i][j];
              }

              numerodeo = str.split("O").length - 1;

              if (gameStage[i][j] == null) {
                posicionpcx = i;
                posicionpcy = j;
                haynulo = true;
              }

              //console.log("i:", i, "j:", j, "str:", str);
              //console.log("numeroo:", numerodeo, "haynulo:", haynulo);
              //console.log("posicionpcx",posicionpcx, "posicionpcy",  posicionpcy);

              //entra solo si el oponente tiene dos en linea para bloquearlo
              if (numerodeo == 2 && haynulo == true) {
                if (!gameStage[posicionpcx][posicionpcy]) {
                  //console.log("entra");
                  salir = true;
                  hayjugada = true;
                }
                break;
              }
            }
          }

          //* codigo para bloquear todo movimiento en eje y, solo entra si no hay que bloquear en el eje x
          if (!hayjugada) {
            posicionpcx = undefined;
            posicionpcy = undefined;
            salir = false;
            for (let j = 0; j < gameStage.length; j++) {
              const row = gameStage[j];
              let str = "";
              let numerodeo = 0;
              let haynulo = false;
              if (salir) {
                break;
              }

              salir = false;
              // console.log(gameStage[i]);
              for (let i = 0; i < row.length; i++) {
                if (gameStage[i][j] !== null) {
                  str = str + gameStage[i][j];
                }

                numerodeo = str.split("O").length - 1;

                if (gameStage[i][j] == null) {
                  posicionpcx = i;
                  posicionpcy = j;
                  haynulo = true;
                }

                console.log("i:", i, "j:", j, "str:", str);
                console.log("numeroo:", numerodeo, "haynulo:", haynulo);
                console.log(
                  "posicionpcx",
                  posicionpcx,
                  "posicionpcy",
                  posicionpcy
                );

                //entra solo si el oponente tiene dos en linea para bloquearlo
                if (numerodeo == 2 && haynulo == true) {
                  if (!gameStage[posicionpcx][posicionpcy]) {
                    //console.log("entra");
                    salir = true;
                    hayjugada = true;
                  }
                  break;
                }
              }
            }
          }

          if (gameStage[posicionpcx][posicionpcy] || !hayjugada) {
            posicionpcx = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            posicionpcy = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
          }

          while (gameStage[posicionpcx][posicionpcy]) {
            posicionpcx = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            posicionpcy = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            //console.log(posicionpcx, posicionpcy);
          }

          //********************************* */

          const newStage = update(gameStage, {
            [posicionpcx]: {
              [posicionpcy]: { $set: turnSymbol },
            },
          });
          //changes the siymble, there was a change in turn
          nextTurnSymbol();
          dispatch(uiActions.gameStage(newStage));
          const winner = getWinner(newStage);
          if (winner) {
            //setWinnerSymbol(`${winner} wins!`);
            if (winner === "O") {
              dispatch(uiActions.winnerSymbol("Human wins!"));
              dispatch(uiActions.personWins(winsHuman + 1));
            }
            if (winner === "X") {
              dispatch(uiActions.winnerSymbol("Computer wins!"));
              dispatch(uiActions.computerWins(winsComputer + 1));
            }
            if (isHuman) {
              setTurnSymbol(X_SYMBOL);
            } else {
              setTurnSymbol(O_SYMBOL);
            }
          } else if (!hasNulls(newStage)) {
            dispatch(uiActions.winnerSymbol("It is a tie!"));
            dispatch(uiActions.ties(Ties + 1));
          }

          setHuman(true);
        }
        if (difficulty == 3) {
          //* codigo para bloquear todo movimiento en eje x
          let posicionpcx;
          let posicionpcy;
          let salir = false; //define si hay una buena jugada para salir del ciclo y jugar
          let hayjugada = false; //define si hay una buena jugada para que no ejecute los ptros bloqueos
          let diagonals = [[], []];
          for (let i = 0; i < gameStage.length; i++) {
            const row = gameStage[i];
            let str = "";
            let numerodeo = 0;
            let haynulo = false;
            if (salir) {
              break;
            }

            salir = false;
            // console.log(gameStage[i]);
            for (let j = 0; j < row.length; j++) {
              //guarda la jugada si no es nulls
              if (gameStage[i][j] !== null) {
                str = str + gameStage[i][j];
              }

              numerodeo = str.split("O").length - 1;

              if (gameStage[i][j] == null) {
                posicionpcx = i;
                posicionpcy = j;
                haynulo = true;
              }

              console.log("i:", i, "j:", j, "str:", str);
              console.log("numeroo:", numerodeo, "haynulo:", haynulo);
              console.log(
                "posicionpcx",
                posicionpcx,
                "posicionpcy",
                posicionpcy
              );

              //entra solo si el oponente tiene dos en linea para bloquearlo
              if (numerodeo == 2 && haynulo == true) {
                if (!gameStage[posicionpcx][posicionpcy]) {
                  console.log("entra");
                  salir = true;
                  hayjugada = true;
                }
                break;
              }
            }
          }

          //* codigo para bloquear todo movimiento en eje y, solo entra si no hay que bloquear en el eje x
          if (!hayjugada) {
            posicionpcx = undefined;
            posicionpcy = undefined;
            salir = false;
            for (let j = 0; j < gameStage.length; j++) {
              if (salir) {
                break;
              }
              const row = gameStage[j];
              let str = "";
              let numerodeo = 0;
              let haynulo = false;

              salir = false;
              // console.log(gameStage[i]);
              for (let i = 0; i < row.length; i++) {
                //coger las diagonales
                /* if (i === j) {
                diagonals[0][i] = gameStage[i][j];
              }
              if (i === Math.abs(j - (row.length - 1))) {
                diagonals[1][i] = gameStage[i][j];
              }*/
                //guarda la jugada si no es nulls
                if (gameStage[i][j] !== null) {
                  str = str + gameStage[i][j];
                }

                numerodeo = str.split("O").length - 1;

                if (gameStage[i][j] == null) {
                  posicionpcx = i;
                  posicionpcy = j;
                  haynulo = true;
                }

                console.log("i:", i, "j:", j, "str:", str);
                console.log("numeroo:", numerodeo, "haynulo:", haynulo);
                console.log(
                  "posicionpcx",
                  posicionpcx,
                  "posicionpcy",
                  posicionpcy
                );

                //entra solo si el oponente tiene dos en linea para bloquearlo
                if (numerodeo == 2 && haynulo == true) {
                  if (!gameStage[posicionpcx][posicionpcy]) {
                    console.log("entra");
                    salir = true;
                    hayjugada = true;
                  }
                  break;
                }
              }
            }
          }

          //FIXME: IMPLEMENTAR BLOQUEOS EN LAS DIAGONALES
          //* code to block the movements in the diagonal
          if (!hayjugada) {
            posicionpcx = undefined;
            posicionpcy = undefined;
          }

          //* random si no hay mejor movimiento

          if (gameStage[posicionpcx][posicionpcy] || !hayjugada) {
            posicionpcx = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            posicionpcy = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
          }

          while (gameStage[posicionpcx][posicionpcy]) {
            posicionpcx = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            posicionpcy = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
            console.log(posicionpcx, posicionpcy);
          }

          //********************************* */

          const newStage = update(gameStage, {
            [posicionpcx]: {
              [posicionpcy]: { $set: turnSymbol },
            },
          });
          //changes the siymble, there was a change in turn
          nextTurnSymbol();
          dispatch(uiActions.gameStage(newStage));
          const winner = getWinner(newStage);
          if (winner) {
            //setWinnerSymbol(`${winner} wins!`);
            if (winner === "O") {
              dispatch(uiActions.winnerSymbol("Human wins!"));
              dispatch(uiActions.personWins(winsHuman + 1));
            }
            if (winner === "X") {
              dispatch(uiActions.winnerSymbol("Computer wins!"));
              dispatch(uiActions.computerWins(winsComputer + 1));
            }
            if (isHuman) {
              setTurnSymbol(X_SYMBOL);
            } else {
              setTurnSymbol(O_SYMBOL);
            }
          } else if (!hasNulls(newStage)) {
            dispatch(uiActions.winnerSymbol("It is a tie!"));
            dispatch(uiActions.ties(Ties + 1));
          }
          setHuman(true);
        }
      } else {
        return;
      }
    }, 1000);

    return () => {
      clearTimeout(asyncwait);
    };
  }, [winnerSymbol, isHuman, gameStage, dispatch]);
  //console.log("ishuman", isHuman);

  //********************************************** */
  //! code to update the state with the local stored data

  const dataToStore = {
    difficulty: difficulty,
    winsComputer: winsComputer,
    winsHuman: winsHuman,
    Ties: Ties,
  };

  useEffect(() => {
    async function a() {
      const localData: any = await getData();
      // console.log("localData", localData);

      if (localData) {
        console.log("hay datos locales completos");
        dispatch(uiActions.difficulty(localData.difficulty));
        dispatch(uiActions.computerWins(localData.winsComputer));
        dispatch(uiActions.personWins(localData.winsHuman));
        dispatch(uiActions.ties(localData.Ties));
      }
    }
    a();
  }, []);

  useEffect(() => {
    storeData(dataToStore);
  }, [difficulty, winsComputer, winsHuman, Ties]);

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
                dispatch(uiActions.gameStage(gameMatrix));
                //setTurnSymbol(X_SYMBOL);
                dispatch(uiActions.winnerSymbol(undefined));
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

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontSize: 18 }}
          >{`human wins: ${winsHuman} computer wins: ${winsComputer} ties: ${Ties}`}</Text>
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
          if (winnerSymbol || gameStage[i][j] || isHuman == false) {
            //console.log("aaaaa ishuman", isHuman);
            return;
          } else {
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
            nextTurnSymbol();
            dispatch(uiActions.gameStage(newStage));
            const winner = getWinner(newStage);
            if (winner) {
              //setWinnerSymbol(`${winner} wins!`);
              if (winner === "O") {
                dispatch(uiActions.winnerSymbol("Human wins!"));
                dispatch(uiActions.personWins(winsHuman + 1));
              }
              if (winner === "X") {
                dispatch(uiActions.winnerSymbol("Computer wins!"));
                dispatch(uiActions.computerWins(winsComputer + 1));
              }
              if (isHuman) {
                setTurnSymbol(X_SYMBOL);
              } else {
                setTurnSymbol(O_SYMBOL);
              }
            } else if (!hasNulls(newStage)) {
              dispatch(uiActions.winnerSymbol("It is a tie!"));
              dispatch(uiActions.ties(Ties + 1));
            }
            setHuman(false);
          }
        })}
      </View>
    </View>
  );
}
