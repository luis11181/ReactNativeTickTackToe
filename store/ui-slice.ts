import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const X_SYMBOL = "X";
const O_SYMBOL = "O";
const gameMatrix = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    gameStage: gameMatrix,
    winnerSymbol: undefined,
    personWins: 0,
    computerWins: 0,
    ties: 0,
    difficulty: 1,
    stumm: false,
    portrait: true,
    multigameStage: gameMatrix,
    multiwinnerSymbol: null,
    multicupo: true,
    multiturnSymbol: O_SYMBOL,
  },
  reducers: {
    gameStage(state, action: PayloadAction<any>) {
      state.gameStage = action.payload;
    },
    personWins(state, action: PayloadAction<number>) {
      state.personWins = action.payload;
    },
    computerWins(state, action: PayloadAction<number>) {
      state.computerWins = action.payload;
    },
    ties(state, action: PayloadAction<number>) {
      state.ties = action.payload;
    },
    winnerSymbol(state, action: PayloadAction<any>) {
      state.winnerSymbol = action.payload;
    },
    difficulty(state, action: PayloadAction<number>) {
      state.difficulty = action.payload;
    },
    stumm(state, action: PayloadAction<boolean>) {
      state.stumm = !state.stumm;
    },
    portrait(state, action: PayloadAction<boolean>) {
      state.portrait = action.payload;
    },
    multigameStage(state, action: PayloadAction<any>) {
      state.multigameStage = action.payload;
    },
    multicupo(state, action: PayloadAction<boolean>) {
      state.multicupo = action.payload;
    },
    multiwinnerSymbol(state, action: PayloadAction<any>) {
      state.multiwinnerSymbol = action.payload;
    },
    multiturnSymbol(state, action: PayloadAction<any>) {
      state.multiturnSymbol = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
