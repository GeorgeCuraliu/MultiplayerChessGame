import { createSlice } from "@reduxjs/toolkit";

const oppoenntData = createSlice({
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
        }  
    }
});

export const {setOpponent, unsetOpponent} = oppoenntData.actions;
export default oppoenntData.reducer;