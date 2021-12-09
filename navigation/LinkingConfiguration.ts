/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: "singleplay",
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: "selectmultiplayer",
            },
          },
          TabThree: {
            screens: {
              TabThreeScreen: "three",
            },
          },
        },
      },
      Modal: "modal",
      OnlineScreen: "multiplayer",
      OnlineScreen2: "multiplayer2",
      NotFound: "*",
    },
  },
};

export default linking;
