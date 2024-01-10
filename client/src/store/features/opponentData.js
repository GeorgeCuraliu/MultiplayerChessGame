import { createSlice } from "@reduxjs/toolkit";

const opponentData = createSlice({
    name:"opponentData",
    initialState: {
        username: undefined,
        points: 0,
        matchID:undefined//will contain all the info about pieces location
    },
    reducers:{
        setOpponent: (state, action) => {
            console.log(action.payload);
            state.username = action.payload.username;
            state.points = action.payload.points;
            state.matchID = action.payload.matchID;
        },
        unsetOpponent: (state) => {
            state = {
                username: undefined,
                points: 0,
                matchID:undefined
            }
        },
        addOpponentPoints : (state, action) => {
            state.points+=action.payload.points
        }  
    }
});

export const {setOpponent, unsetOpponent, addOpponentPoints} = opponentData.actions;
export default opponentData.reducer;