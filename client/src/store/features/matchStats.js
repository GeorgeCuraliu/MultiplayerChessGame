import { createSlice } from "@reduxjs/toolkit";

const matchStats = createSlice({
    name: "matchStats",
    initialState:{
        time: undefined,
        turn: undefined
    },
    reducers:{
        setStats: (state, action) => {
            state.time = action.payload.time;
            state.turn = action.payload.turn;
        },
        updateTime:(state) => {
            state.time -= 60 * 1000;
        },
        updateTurn: (state) => {
            state.turn = state.turn === "black" ? "white" : "black"; 
        }
    }
})

export const {setStats, updateTime, updateTurn} = matchStats.actions;
export default matchStats.reducer;