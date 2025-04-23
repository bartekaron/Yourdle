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
    });
}