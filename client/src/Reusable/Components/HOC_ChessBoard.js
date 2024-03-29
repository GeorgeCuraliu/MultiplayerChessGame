import ChessBoard from "./ChessBoard";
import { useDispatch } from "react-redux";
import { setOpponent } from "../../store/features/opponentData";
import { useState, useEffect } from "react";
import { addOpponentPoints } from "../../store/features/opponentData";
import { addUserPoints } from "../../store/features/userData";
import { setStats, updateTurn, setWinner } from "../../store/features/matchStats";

//get chess board component
//object !-! mode will have the methods or be a class that will process the events

const HOC_ChessBoard = (mode, receivedData={}) => {

    console.log("HOC_ChessBoard");

    const WebSocket = window.WebSocket;
    const websocket = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/match`);

    const dispatch = useDispatch();
    console.log("Dwada");
    console.log(mode);
    console.log(receivedData);

    const [data, setData] = useState({});
    
    useEffect(()=>{
        
        if(mode === "active"){//for active matchmaking and logic processing
            let matchID, localData = {}, opponent;
            const checkMove = location => {
                console.log({type:"checkMove", location, matchID : matchID});
                websocket.send(JSON.stringify({type:"checkMove", location, matchID : matchID}));
            }

            const move = targetLocation => {
                console.log(localData);
                console.log({type:"move", selected: localData.selected, targetLocation, matchID: matchID});
                websocket.send(JSON.stringify({type:"move", selected: localData.selected, targetLocation, matchID: matchID, opponent: localData.opponent.username}));
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
                    dispatch(setStats({time: temp.data.time, turn: temp.data.turn}));
                    matchID = temp.data.opponent.matchID;
                    opponent = temp.data.opponent.username;
                    setData({...temp.data, checkMove: checkMove, move: move});
                    localData = {...temp.data, checkMove: checkMove, move: move};
                }else if(temp.type === "checkMove"){
                    setData(val=>{return{...val, ...temp.data}});
                    localData = {...localData, ...temp.data};
                }else if(temp.type === "move"){
                    dispatch(updateTurn());
                    localData.turn = temp.turn;
                    const piece = localData.localization[`${String.fromCharCode(96+temp.selected[0]+1)}${temp.selected[1]+1}`];
                    console.log(piece, temp.targetPosition);
                    delete localData.localization[`${String.fromCharCode(96+temp.selected[0]+1)}${temp.selected[1]+1}`];
                    localData.localization[`${String.fromCharCode(96+temp.targetPosition[1]+1)}${temp.targetPosition[0]+1}`] = piece;
                    localData.moves = [];
                    localData.attacks = [];
                    console.log(Object.keys(temp.addPoints)[0],opponent, " points");

                    //will add points in case of a piece being attacked
                    if(temp.addPoints && Object.keys(temp.addPoints).length !== 0){
                        if(Object.keys(temp.addPoints)[0] === opponent){
                            dispatch(addOpponentPoints({points : Object.values(temp.addPoints)[0]}));
                        }else{
                            dispatch(addUserPoints({points : Object.values(temp.addPoints)[0]}));
                        }
                    }

                    //will apply game-over logic
                    if(temp?.winner){
                        if(temp.winner === temp.team){
                            dispatch(setWinner({winner: "user"}));
                        }else{
                            dispatch(setWinner({winner: "opponent"}));
                        }
                    }
                    setData({...localData});
                }
            }
        }else if(mode==="passive"){
            console.log("passive mode chessboard");
            // console.log(receivedData);
            // setData({...receivedData});
        }
    },[]);
    
    return (props) => {
        console.warn(props.updatedData ? props.updatedData : "no updatedData received")
        return(<ChessBoard data = {props.updatedData ? props.updatedData : data} />);
    };
};

export default HOC_ChessBoard;