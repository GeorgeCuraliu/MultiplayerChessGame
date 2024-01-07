const checkPossMoves = (matrix, possMoves, enemyColor) => {//possMoves will be in x, y format
    const returnData = {moves: [], attacks: []};
    console.log(possMoves);
    console.log(enemyColor);

    possMoves?.moves.forEach(move => {
        if(move[0] <= 7 && move[0] >= 0 && move[1] <= 7 && move[1] >= 0){
            console.log(move, matrix[move[0]][move[1]], enemyColor)
            if(!matrix[move[0]][move[1]]){
                returnData.moves.push(move);
            }else if(matrix[move[0]][move[1]].slice(0,1) === enemyColor){
                returnData.attacks.push(move);
            }
        }
    });

    possMoves?.attacks.forEach(move => {
        if(move[0] <= 7 && move[0] >= 0 && move[1] <= 7 && move[1] >= 0 && matrix[move[0]][move[1]] && matrix[move[0]][move[1]].slice(0,1) === enemyColor){
            console.log(move, matrix[move[0]][move[1]], enemyColor)
            returnData.attacks.push(move);
        };
    });

    return returnData;

}


const movesSim = {//location will reprezent the target piece
    pawn : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], pawn, ${color}`);
        

        if(color === "white"){
            const possMoves = {
                moves: [
                    [location[1]+1, location[0]]
                ], 
                attacks:[
                    [location[1]+1, location[0]+1],
                    [location[1]+1, location[0]-1]
                ]
            };

            if(location[1] === 1){
                possMoves.moves.push([location[1]+2, location[0]]);
            }

            return checkPossMoves(matrix, possMoves, matrix[location[1]][location[0]].slice(0, 1) === "W" ? "B" : "W");


        }

    },
    rook : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], rook, ${color}`);

    },
    knight : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], knight, ${color}`);

    },
    bishop : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], bishop, ${color}`);

    },
    king : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], king, ${color}`);

    },
    queen : (matrix, location, color) => {
        console.log(`simulating possible moves for [y-${location[1]}, x-${location[0]}], queen, ${color}`);

    }
}

const gameLogic = {
    checkMove: (data, targetLocation) => {

        let matrix=[];//first y, then x   matrix[y][x]
        for(let i = 0; i < 8; i++){
            matrix[i] = new Array(8);
            for(let j = 0; j < 8; j++){
                matrix[i][j] = false;
            }
        }

        Object.entries(data.dataValues).forEach(([piece, location]) => {
            if(piece.length <= 3 && piece !== "id" && location){

                const x = location.charCodeAt(0,1) - 96;
                const y = location.substring(1);
                matrix[y-1][x-1] = piece;

            };
        });
        console.log(matrix);

        const target = [targetLocation.charCodeAt(0,1) - 96-1, Number(targetLocation.substring(1))-1];//[x,y] -- location
        const targetPiece = matrix[target[1]][target[0]]; 

        if(targetPiece.length === 2){

            const color = targetPiece.slice(0, 1) === "B" ? "black" : "white";
            const type = target.slice(1, 2) === "Q" ? "queen" : "king";
            return movesSim[type](matrix, target, color);

        }else if(targetPiece.length === 3){

            const color = targetPiece.slice(0, 1) === "B" ? "black" : "white";
            const names = {P : "pawn", K : "knight", B: "bishop", R: "rook"};
            return movesSim[names[targetPiece.slice(1,2)]](matrix, target, color);

        }


    }
}

module.exports = gameLogic;