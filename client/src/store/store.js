import { configureStore } from "@reduxjs/toolkit";
import userData from "./features/userData";

export const store = configureStore({
    reducer:{
        userData: userData
    }
});