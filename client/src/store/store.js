import { configureStore } from "@reduxjs/toolkit";
import userData from "./features/userData";
import opponentData from "./features/opponentData";

export const store = configureStore({
    reducer:{
        userData: userData,
        opponentData: opponentData
    }
});