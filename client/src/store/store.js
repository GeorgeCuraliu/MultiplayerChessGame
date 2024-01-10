import { configureStore } from "@reduxjs/toolkit";
import userData from "./features/userData";
import opponentData from "./features/opponentData";
import matchStats from "./features/matchStats";

export const store = configureStore({
    reducer:{
        userData: userData,
        opponentData: opponentData,
        matchStats: matchStats
    }
});