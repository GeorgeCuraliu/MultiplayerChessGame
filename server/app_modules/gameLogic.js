const checkPossMoves = (matrix, possMoves, enemyColor, pawn = false) => {//possMoves will be in x, y format

    const returnData = {moves: [], attacks: []};
    console.log(" ---- ");
    console.log(possMoves);
    console.log(enemyColor);
    console.log(" ---- ");
    possMoves?.moves.forEach((movesArr) => {
        console.log(movesArr, " array of directional moves")
        for(let move of movesArr){
            if(move[0] <= 7 && move[0] >= 0 && move[1] <= 7 && move[1] >= 0){
                console.log(move, matrix[move[0]][move[1]], enemyColor)
                if(!matrix[move[0]][move[1]]){
                    returnData.moves.push(move);
                }else if(matrix[move[0]][move[1]].slice(0,1) === enemyColor && !pawn){
                    returnData.attacks.push(move);
                    return;
                }else{
                    return;
                }
            }
        }
    });

    possMoves?.attacks.forEach(move => {
        if(move[0] <= 7 && move[0] >= 0 && move[1] <= 7 && move[1] >= 0 && matrix[move[0]][move[1]] && matrix[move[0]][move[1]].slice(0,1) === enemyColor){
            console.log(move, matrix[move[0]][move[1]], enemyColor)
            returnData.attacks.push(move);
        };
    });

    console.log(returnData);
    return returnData;

};


const generateProceduralMoves = (init, y, x) => {//will create the move pattern for pieces like rook
    let moves = [];
    for(let i = 0; i < 7; i++){
        let extraX = x*i;
        let extraY = y*i;

        moves.push([init[0] + y + extraY, init[1] + x + extraX]);
    };
    console.log(init,y, x);
    console.log(moves);
    return moves;
}


const movesSim = {//location will reprezent the target piece
    pawn : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], pawn, ${color}`);
        
        if(color === "white"){//good
            const possMoves = {
                moves: [
                    [[location[1]+1, location[0]]]
                ], 
                attacks:[
                    [location[1]+1, location[0]+1],
                    [location[1]+1, location[0]-1]
                ]
            };

            if(location[1] === 1){
                possMoves.moves[0].push([location[1]+2, location[0]]);
            }

            return checkPossMoves(matrix, possMoves, matrix[location[1]][location[0]].slice(0, 1) === "W" ? "B" : "W", true);

        }else{

            const possMoves = {
                moves: [
                    [[location[1]-1,location[0]]]
                ], 
                attacks:[
                    [location[1]-1, location[0]+1],
                    [location[1]-1, location[0]-1]
                ]
            };

            if(location[1] === 6){
                possMoves.moves[0].push([location[1]-2, location[0]]);
            }

            return checkPossMoves(matrix, possMoves, matrix[location[1]][location[0]].slice(0, 1) === "W" ? "B" : "W", true);

        }

    },
    rook : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], rook, ${color}`);

        const possMoves = {moves:[], attacks: []};
        possMoves.moves =[
            [...generateProceduralMoves([location[1], location[0]],  1,  0)],
            [...generateProceduralMoves([location[1], location[0]],  0,  1)],
            [...generateProceduralMoves([location[1], location[0]], -1,  0)],
            [...generateProceduralMoves([location[1], location[0]],  0, -1)]
        ];

        return checkPossMoves(matrix, possMoves, matrix[location[1]][location[0]].slice(0, 1) === "W" ? "B" : "W");

    },
    knight : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], knight, ${color}`);

        const possMoves = {moves:[], attacks: []};
        possMoves.moves =[
            [[location[1]-2, location[0]-1]],
            [[location[1]-1,  location[0]-2]],
            [[location[1]+1,  location[0]-2]],
            [[location[1]+2,  location[0]-1]],
            [[location[1]+2,  location[0]+1]],
            [[location[1]+1,  location[0]+2]],
            [[location[1]-1,  location[0]+2]],
            [[location[1]-2,  location[0]+1]]
        ];

        return checkPossMoves(matrix, possMoves, matrix[location[1]][location[0]].slice(0, 1) === "W" ? "B" : "W");

    },
    bishop : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], bishop, ${color}`);

        const possMoves = {moves:[], attacks: []};
        possMoves.moves =[
            [...generateProceduralMoves([location[1], location[0]],  1,   1)],
            [...generateProceduralMoves([location[1], location[0]], -1,  -1)],
            [...generateProceduralMoves([location[1], location[0]], -1,   1)],
            [...generateProceduralMoves([location[1], location[0]],  1,  -1)]
        ];

        return checkPossMoves(matrix, possMoves, matrix[location[1]][location[0]].slice(0, 1) === "W" ? "B" : "W");

    },
    king : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], king, ${color}`);

        const possMoves = {moves:[], attacks: []};
        possMoves.moves =[
            [[location[1]-1, location[0]-1]],
            [[location[1],    location[0]-1]],
            [[location[1]+1,  location[0]-1]],
            [[location[1]+1,  location[0]]],
            [[location[1]+1,  location[0]+1]],
            [[location[1],    location[0]+1]],
            [[location[1]-1,  location[0]+1]],
            [[location[1]-1,  location[0]]]
        ];

        return checkPossMoves(matrix, possMoves, matrix[location[1]][location[0]].slice(0, 1) === "W" ? "B" : "W");

    },
    queen : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], queen, ${color}`);

        const possMoves = {moves:[], attacks: []};
        possMoves.moves =[
            [...generateProceduralMoves([location[1], location[0]],  1,   1)],
            [...generateProceduralMoves([location[1], location[0]], -1,  -1)],
            [...generateProceduralMoves([location[1], location[0]], -1,   1)],
            [...generateProceduralMoves([location[1], location[0]],  1,  -1)],
            [...generateProceduralMoves([location[1], location[0]],  1,   0)],
            [...generateProceduralMoves([location[1], location[0]],  0,   1)],
            [...generateProceduralMoves([location[1], location[0]], -1,   0)],
            [...generateProceduralMoves([location[1], location[0]],  0,  -1)]
        ];

        return checkPossMoves(matrix, possMoves, matrix[location[1]][location[0]].slice(0, 1) === "W" ? "B" : "W");

    }
}

const getMoves = (data, currentLocation, returnMatrix = false) => {
    let matrix=[];//matrix[y][x]
    for(let i = 0; i < 8; i++){
        matrix[i] = new Array(8);
        for(let j = 0; j < 8; j++){
            matrix[i][j] = false;
        }
    }

    Object.entries(data.dataValues).forEach(([piece, location]) => {
        if(piece.length <= 3 && piece !== "id" && location != 0 && piece){
            
            const x = location.charCodeAt(0,1) - 96;
            const y = location.substring(1);
            console.log(piece, x, y, location);
            matrix[y-1][x-1] = piece;

        };
    });
    //console.log(matrix);
    let target
    if(typeof(currentLocation) === "string"){
        target = [currentLocation.charCodeAt(0,1) - 96 - 1, Number(currentLocation.substring(1)) - 1];//[x,y] -- location
    }else{
        target = currentLocation;
    }
    
    const targetPiece = matrix[target[1]][target[0]]; 
    console.log(targetPiece, target, returnMatrix, targetPiece.slice(1, 2), " err data");
    if(targetPiece.length === 2){

        const color = targetPiece.slice(0, 1) === "B" ? "black" : "white";
        const type = targetPiece.slice(1, 2) === "Q" ? "queen" : "king";
        let obj = {...movesSim[type](matrix, target, color), selected: target};
        returnMatrix ? obj.matrix = {...matrix} : undefined;
        return obj;    

    }else if(targetPiece.length === 3){

        const color = targetPiece.slice(0, 1) === "B" ? "black" : "white";
        const names = {P : "pawn", K : "knight", B: "bishop", R: "rook"};
        let obj = {...movesSim[names[targetPiece.slice(1,2)]](matrix, target, color), selected: target};
        returnMatrix ? obj.matrix = {...matrix} : undefined;
        return obj;

    }
}

const gameLogic = {
    checkMove: (data, currentLocation) => {
        return getMoves(data, currentLocation);
        
    },
    move: (data, currentLocation, targetLocation) => {
        console.log("current location ", currentLocation, targetLocation);
        const possMoves = getMoves(data, currentLocation, true);
        console.log(possMoves);

        const coordsTargetLoc = [Number(targetLocation.substring(1))-1, targetLocation.charCodeAt(0,1) - 96-1];
        console.log(coordsTargetLoc);

        const moveData = {
            movedPiece: possMoves.matrix[currentLocation[1]][currentLocation[0]]
        }; 

        possMoves.moves.forEach(move => {
            if(move[0] === coordsTargetLoc[0] && move[1] === coordsTargetLoc[1]){
                moveData.targetPosition = move;
            }
        });

        possMoves.attacks.forEach(attack => {
            if(attack[0] === coordsTargetLoc[0] && attack[1] === coordsTargetLoc[1]){
                moveData.targetPosition = attack;
                moveData.attackedPiece = possMoves.matrix[attack[0]][attack[1]];
            }
        });

        console.log(moveData);
        return moveData;

    }
}

module.exports = gameLogic;