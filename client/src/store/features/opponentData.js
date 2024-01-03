import { createSlice } from "@reduxjs/toolkit";

const oppoenntData = createSlice({
    name:"opponentData",
    initialState: {
        username: undefined,
        points: 0,
        gameData:{}//will contain all the info about pieces location
    },
    reducers:{
        setOpponent: (state, action) => {
            console.log(action.payload);
            state = {...action.payload};
        },
        unsetOpponent: (state) => {
            state = {
                username: undefined,
                points: 0,
                gameData:{}
            }
        }  
    }
});

export const {setOpponent, unsetOpponent} = oppoenntData.actions;
export default oppoenntData.reducer;