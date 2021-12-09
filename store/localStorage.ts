import AsyncStorage from "@react-native-async-storage/async-storage";
import { uiActions } from "../store/ui-slice";
import { useSelector, useDispatch } from "react-redux";

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@storage_Key");

    if (jsonValue) {
      let data = await JSON.parse(jsonValue);
      // console.log("jsonvalue:", jsonValue);
      //console.log("data:", data);

      if (
        data.difficulty >= 0 &&
        data.winsComputer >= 0 &&
        data.winsHuman >= 0
      ) {
        console.log("getData", data);
        return data;
      } else {
        console.log("getData incompleta", data);
        return null;
      }
    }
  } catch (e) {
    console.log("Error retrieving data", e);
  }
};

export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@storage_Key", jsonValue);
    console.log("Storeddata: ", jsonValue);
  } catch (e) {
    // saving error
  }
};
