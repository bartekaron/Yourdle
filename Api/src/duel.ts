import { Server } from "socket.io";
 
const rooms = new Map();
 
export function initializeSocketIO(io: Server) {
    io.on("connection", (socket) => {
        socket.on("createRoom", ({ roomName, category, gameTypes, owner, categoryId }) => {
            if (!rooms.has(roomName)) {
                rooms.set(roomName, {
                    owner,
                    category,
                    categoryId,
                    gameTypes,
                    members: [{ id: socket.id, name: owner }],
                });
                socket.join(roomName);
 
                io.emit("roomList", Array.from(rooms.entries()).map(([roomName, data]) => ({
                    roomName,
                    owner: data.owner,
                    category: data.category,
                    categoryId: data.categoryId,
                    gameTypes: data.gameTypes,
                })));
                
                socket.emit("roomCreated", { roomName, owner, redirect: true });
            } else {
                socket.emit("roomCreated", { success: false, message: "Ez a szoba már létezik!" });
            }
        });
 
        socket.on("getRooms", () => {
            socket.emit("roomList", Array.from(rooms.entries()).map(([roomName, data]) => ({
                roomName,
                owner: data.owner,
                category: data.category,
                gameTypes: data.gameTypes,
            })));
        });
 
        socket.on("joinRoom", ({ roomName, name }) => {
            if (rooms.has(roomName)) {
                const room = rooms.get(roomName);
                if (!room.members.some(member => member.id === socket.id)) {
                    room.members.push({ id: socket.id, name });
                    socket.join(roomName);
                }
                io.to(roomName).emit("playerList", room.members);
                socket.emit("roomInfo", {
                    owner: room.owner,
                    category: room.category,
                    categoryId: room.categoryId,
                    gameTypes: room.gameTypes
                });
            }
        });
 
        socket.on("startGame", ({ roomName }) => {
            const room = rooms.get(roomName);
            if (room && room.members.length >= 2) {
                io.to(roomName).emit("gameStarted", { 
                    success: true, 
                    message: "Játék elindítva!",
                    gameTypes: room.gameTypes
                });
            } else {
                io.to(roomName).emit("gameStarted", { 
                    success: false, 
                    message: "Legalább két játékosnak kell lenni a játék indításához." 
                });
            }
        });
 
        socket.on("leaveRoom", ({ roomName }, callback) => {
            if (rooms.has(roomName)) {
              const room = rooms.get(roomName);
              room.members = room.members.filter(member => member.id !== socket.id);
              socket.leave(roomName);
              io.to(roomName).emit("playerList", room.members);
             
              if (room.members.length === 0) {
                rooms.delete(roomName);
                io.emit("roomList", Array.from(rooms.entries()).map(([roomName, data]) => ({
                  roomName,
                  owner: data.owner,
                  category: data.category,
                  gameTypes: data.gameTypes,
                })));
              }
            }
         
            if (callback) callback();
          });
 
        socket.on("disconnect", () => {
            rooms.forEach((room, roomName) => {
                room.members = room.members.filter(member => member.id !== socket.id);
                io.to(roomName).emit("playerList", room.members);
                if (room.members.length === 0) {
                    rooms.delete(roomName);
                    io.emit("roomList", Array.from(rooms.entries()).map(([roomName, data]) => ({
                        roomName,
                        owner: data.owner,
                        category: data.category,
                        gameTypes: data.gameTypes,
                    })));
                   
                }
            });
        });

        socket.on("submitGuess", ({ roomName, guess, player }) => {
            if (rooms.has(roomName)) {
                // Broadcast the guess to all players in the room
                io.to(roomName).emit("newGuess", {
                    guess,
                    player
                });
                
                // Change turn to next player
                const room = rooms.get(roomName);
                if (room && room.members.length > 1) {
                    const currentPlayerIndex = room.members.findIndex(member => member.name === player);
                    const nextPlayerIndex = (currentPlayerIndex + 1) % room.members.length;
                    const nextPlayer = room.members[nextPlayerIndex].name;
                    
                    io.to(roomName).emit("playerTurn", nextPlayer);
                }
            }
        });

        socket.on("gameCompleted", ({ roomName, winner }) => {
            if (rooms.has(roomName)) {
                const room = rooms.get(roomName);
                io.to(roomName).emit("gameOver", {
                    winner,
                    targetCharacter: room.targetCharacter
                });
            }
        });

        socket.on("setTargetCharacter", ({ roomName, target }) => {
            if (rooms.has(roomName)) {
                const room = rooms.get(roomName);
                // Store the target character in the room object
                room.targetCharacter = target;
                
                // Broadcast to all players
                io.to(roomName).emit("targetCharacter", {
                    target
                });

                // When sending room info, include the target character
                socket.on("getRoomInfo", ({ roomName }) => {
                    if (rooms.has(roomName)) {
                        const room = rooms.get(roomName);
                        socket.emit("roomInfo", {
                            owner: room.owner,
                            category: room.category,
                            categoryId: room.categoryId,
                            gameTypes: room.gameTypes,
                            targetCharacter: room.targetCharacter // Include target character
                        });
                    }
                });
            }
        });

        socket.on("playerTurn", ({ roomName, playerName }) => {
            if (rooms.has(roomName)) {
                // Broadcast to everyone in the room who's turn it is
                io.to(roomName).emit("playerTurn", playerName);
            }
        });

        socket.on("getRoomInfo", ({ roomName }) => {
            if (rooms.has(roomName)) {
                const room = rooms.get(roomName);
                socket.emit("roomInfo", {
                    owner: room.owner,
                    category: room.category,
                    categoryId: room.categoryId,
                    gameTypes: room.gameTypes,
                    targetCharacter: room.targetCharacter // Include target character
                });
            }
        });

        socket.on("getPlayers", ({ roomName }) => {
            if (rooms.has(roomName)) {
                const room = rooms.get(roomName);
                socket.emit("playerList", room.members);
            }
        });
    });
}