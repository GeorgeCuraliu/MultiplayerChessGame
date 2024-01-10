import { createSlice } from "@reduxjs/toolkit";

export const userData = createSlice({
    name: "userData",
    initialState:{
        username: undefined,
        inMatch: false,
        points: 0,
        wonMatches: 0
    },
    reducers: {
        setValues: (state, action) => {
            console.log(action.payload);
            state.username = action.payload.username;
            state.points = action.payload.points;
            state.inMatch = action.payload.inMatch
        },
        unsetValues: (state) => {
            state = {
                username: undefined,
                inMatch: false,
                points: 0,
                wonMatches: 0 
            }
        }, 
        addUserPoints : (state, action) => {
            state.points+=action.payload.points
        }
    }
});

export const {setValues, unsetValues, addUserPoints} = userData.actions;
export default userData.reducer;