import { createSlice } from "@reduxjs/toolkit";

const matchStats = createSlice({
    name: "matchStats",
    initialState:{
        time: undefined,
        turn: undefined,
        winner: undefined//will contain either "opponent" or "user"
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
        },
        setWinner: (state, action) => {
            state.winner = action.payload.winner
            console.log(action.payload.winner, " WINNER");
        }
    }
})

export const {setStats, updateTime, updateTurn, setWinner} = matchStats.actions;
export default matchStats.reducer;