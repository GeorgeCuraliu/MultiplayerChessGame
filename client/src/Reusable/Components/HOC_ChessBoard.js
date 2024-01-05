import ChessBoard from "./ChessBoard";
import { useDispatch } from "react-redux";
import { setOpponent } from "../../store/features/opponentData";
import { useState, useEffect } from "react";

//get chess board component
//object !-! mode will have the methods or be a class that will process the events



const HOC_ChessBoard = (mode) => {

    const WebSocket = window.WebSocket;
    const websocket = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/match`);

    const dispatch = useDispatch();

    //opponent: {}, localization:{square: piece(db_format)}, checkMoves(), move(), turn: id
    const [data, setData] = useState({});

    console.log(mode + " mode");

    useEffect(()=>{
        if(mode === "active"){//for active matchmaking and logic processing
            console.log("inside if")

            websocket.addEventListener('open', () => {
                console.log("connected");
                websocket.send(JSON.stringify({ type: 'auth' }));
            });

            websocket.onmessage = message => {
                console.log('received data')
                const temp = JSON.parse(message.data);
                console.log('received data')
                if(temp.type === "set"){//will set the initial value for the pieces location
                    dispatch(setOpponent(temp.data.opponent));
                    setData({...temp.data});
                }
                if(temp.typr === ""){

                }
            };

            data.checkMove = location => {
                console.log(`cheking moves for piece with location ${location}`)
                websocket.send(JSON.stringify({type:"checkMove", location}));
            }

        }
    },[]);

    return () => {
        return(<ChessBoard data = {data} />);
    };
};

export default HOC_ChessBoard;