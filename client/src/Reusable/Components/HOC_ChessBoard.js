import ChessBoard from "./ChessBoard";
import { useDispatch } from "react-redux";
import { setOpponent } from "../../store/features/opponentData";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

//get chess board component
//object !-! mode will have the methods or be a class that will process the events

const HOC_ChessBoard = (mode) => {

    const WebSocket = window.WebSocket;
    const websocket = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/match`);

    const dispatch = useDispatch();

    //opponent: {}, localization:{square: piece(db_format)}, checkMoves(), move(), turn: id
    const [data, setData] = useState({});

    useEffect(()=>{
        if(mode === "active"){//for active matchmaking and logic processing
            let matchID;
            const checkMove = location => {
                console.log({type:"checkMove", location, matchID : matchID});
                websocket.send(JSON.stringify({type:"checkMove", location, matchID : matchID}));
            }

            websocket.addEventListener('open', () => {
                console.log("connected");
                websocket.send(JSON.stringify({ type: 'auth' }));
            });

            websocket.onmessage = message => {
                let temp;
                if(typeof(message.data) === "string"){
                    temp = JSON.parse(message.data);
                }else{
                    temp = message.data;
                }
                console.log(temp);
                if(temp.type === "set"){//will set the initial value for the pieces location
                    dispatch(setOpponent(temp.data.opponent));
                    matchID = temp.data.opponent.matchID;
                    setData({...temp.data, checkMove: checkMove});
                }else if(temp.type === "checkMove"){
                    setData(val=>{return{...val, ...temp.data}})
                }
            };

            // setData(val => {return{...val});
        }
    },[]);

    return () => {
        return(<ChessBoard data = {data} />);
    };
};

export default HOC_ChessBoard;