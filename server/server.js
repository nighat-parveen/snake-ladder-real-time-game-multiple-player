const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db/connect');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtSecretKey = 'secret123'


const cors = require('cors'); // Import cors for Express if needed
const UserModal = require('./model/user.model');

const { snakesAndLadders } = require('./game_rule');


// const router = express.Router();
const app = express();
const httpServer = http.createServer(app);

connectDB();


const port = process.env.port || 3000;
app.use(express.json());
app.use(cors());

app.get('/check', (req, res) => {
   res.send('healthy stream !!');
});

app.post('/register', async(req, res)=> {
    console.log(req.body);
    const { username, email, password } = req.body;
    try {
        let userData = await UserModal.findOne({ email });
        if(userData) return res.status(400).send('User already exists');
        userData = new UserModal({ username, email, password });
        console.log('check');


        await userData.save();
        const token = jwt.sign({ user_id: userData._id , user_email: userData.email}, 'secret', { expiresIn: '1h' });
        res.status('201').send({ id: token, data: 'User Registered successfully' });
    }catch(error){
        console.log(error)
        res.status(500).json({error});
    }

});

app.post('/login', async(req, res, next) => {
    const {email, password} = req.body;
    try {
        const isUserData = await UserModal.findOne({ email, password });
        console.log(isUserData)
        if(!isUserData) return res.status(400).send('User does not exist');

        // const isMatchPassword = await bcrypt.compare(isUserData.password, password);
        // console.log(isMatchPassword)
        // if(!isMatchPassword) return res.status(400).send('Incorrect password');

        const token  = jwt.sign({
            user_id: isUserData._id,
            user_email: isUserData.email
        },
        jwtSecretKey,
        {expiresIn: '1h'});
        res.status(200).json({
            id: token,
            data: 'User logged in successfully'
        })
    }catch(error) {
        res.status(500).json({
            error: error
        });
    }
})

let gameState = {
    players: [],
    currentPlayerIndex: 0,
    positions: [0,0], // lets take a 2 player game for now,
    diceNumber: null
};



const movePlayer = (position, steps) => {
    let newPosition = position + steps;
    if(newPosition > 100) return position;
    if(newPosition === 100) {
        return newPosition;
    }
    if(snakesAndLadders.has(newPosition)) {
        newPosition = snakesAndLadders.get(newPosition);
    }
    return newPosition;
}


const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(!token) return next(new Error('invalid token'));
    try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, jwtSecretKey);
        socket.id = decoded.user_id;
        next();
    }catch(error){
        console.log(error);
        next(new Error(error))
    }
});

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
});
