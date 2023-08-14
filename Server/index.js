import { Server } from "socket.io";
// const Server = require("socket.io")
// import { CorsOptions } from "cors";
const io = new Server({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
})
const generateRandomPosition = () => {
    return [Math.random() *3,0,Math.random() *3];
}
io.listen(3001);
const characters =[];

io.on("connection", (socket) => {
    console.log("User connected!!")
characters.push({
    id: socket.id,
    position: generateRandomPosition()
})
    socket.emit("Hello!! ");
    io.emit("characters",characters);

    socket.on("move",(position) => {   
        const character = characters.find((character)=>{ return character.id === socket.id});
        console.log(character);
        character.position = position;
        io.emit("characters",characters);
     })

     
    // Send a message to all connected clients
    socket.on('message', (data) => {
        console.log(`${socket.id} sent a message to all clients: ${data.message}`);

        io.emit('message', {
            id: socket.id,
            message: data.message
        });

    });

    // socket.on("move", (position) => {
    //     const character = characters.find(
    //         (character) => character.id === socket.id
    //     );
    //     character.position = position;
    //     io.emit("characters", characters);
    // });

    socket.on("disconnect", () => {
        console.log("User disconnected!!");
        characters.splice(
            characters.findIndex((character) =>  character.id === socket.id ),1
        )

        io.emit("characters",characters);
    });

});