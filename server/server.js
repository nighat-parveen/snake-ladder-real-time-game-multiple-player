const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Import cors for Express if needed

const { snakesAndLadders } = require('./game_rule');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST'],
        credentials: true

    }
});

const port = process.env.port || 3000;
app.use(cors());

app.get('/check', (req, res) => {
   res.send('healthy stream !!');
});

let gameState = {
    players: [],
    currentPlayerIndex: 0,
    positions: [0,0], // lets take a 2 player game for now,
    diceNumber: null
};



const movePlayer = (position, steps) => {
    let newPosition = position + steps;
    if(newPosition > 100) return position;
    if(snakesAndLadders.has(newPosition)) {
        newPosition = snakesAndLadders.get(newPosition);
    }

    return newPosition;
}



io.on('connection', (socket_player) => {
    console.log('a user connected', socket_player.id);
    if(gameState.players.length >= 2) return;

    // once connection established check for players count if less than two , push it to gameState otherwise emit the message 
    if(gameState.players.length < 2) {
        //add the player to list
        gameState.players.push(socket_player.id);
        // emit the message to all players about gameState
        io.emit('gameStateUpdate', gameState);
    } else {
        socket_player.emit('game is full !!');
        socket_player.disconnect();
        return;
    }



    // if player roll the dice
    socket_player.on('rollDice', () => {

        if(gameState.players[gameState.currentPlayerIndex] === socket_player.id) {
            const diceNumber = Math.trunc((Math.random() * 6)) + 1;

            gameState.diceNumber = diceNumber;
            gameState.positions[gameState.currentPlayerIndex] = movePlayer(gameState.positions[gameState.currentPlayerIndex], diceNumber);
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players?.length;

            io.emit('gameStateUpdate', gameState);
        }
    });


    // if players discomnects
    socket_player.on('disconnects', () => {
        gameState.players = gameState.players(player => player !== socket_player.id);
        // update all players in group !!
        io.emit('Player disconnected =', socket_player.id);
    })
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
