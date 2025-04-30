import { Server } from "socket.io";
 
const rooms = new Map();
 
export function initializeSocketIO(io: Server) {
    io.on("connection", (socket) => {
        socket.on("createRoom", ({ roomName, category, gameTypes, owner, categoryId }) => {
            if (!rooms.has(roomName)) {
                // Create game sequence with correct order
                const orderedGameTypes = [];
                const gameOrder = ['klasszikus', 'leiras', 'emoji', 'idezet', 'kep'];
                
                // Filter game types in the correct order
                gameOrder.forEach(type => {
                    if (gameTypes.includes(type)) {
                        orderedGameTypes.push(type);
                    }
                });
                
                rooms.set(roomName, {
                    owner,
                    category,
                    categoryId,
                    gameTypes: orderedGameTypes,
                    members: [{ id: socket.id, name: owner }],
                    currentGameIndex: 0,  // Track which game in the sequence we're on
                    gameResults: [], // Track game results
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
                // Get the first game type in sequence
                const firstGameType = room.gameTypes && room.gameTypes.length > 0 ? 
                    room.gameTypes[0] : null;
                    
                // Map from display names to component names
                const gameTypeMapping = {
                    'klasszikus': 'classic',
                    'leiras': 'description',
                    'emoji': 'emoji',
                    'idezet': 'quote',
                    'kep': 'picture'
                };
                
                const firstGame = firstGameType ? gameTypeMapping[firstGameType] : null;
                
                io.to(roomName).emit("gameStarted", { 
                    success: true, 
                    message: "Játék elindítva!",
                    gameTypes: room.gameTypes,
                    firstGame: firstGame
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

        socket.on("gameCompleted", ({ roomName, winner, targetCharacter, currentGame, nextGame }) => {
            if (rooms.has(roomName)) {
                const room = rooms.get(roomName);
                
                // Map display game types to their internal socket names
                const gameTypeMapping = {
                    'klasszikus': 'classic',
                    'leiras': 'description',
                    'emoji': 'emoji',
                    'idezet': 'quote', 
                    'kep': 'picture'
                };
                
                // Map internal names to display types
                const reverseMapping = {};
                Object.keys(gameTypeMapping).forEach(key => {
                    reverseMapping[gameTypeMapping[key]] = key;
                });
                
                // Save game result
                if (!room.gameResults) room.gameResults = [];
                room.gameResults.push({
                    gameType: currentGame,
                    winner: winner
                });
                
                // Increment the game index in the sequence
                if (typeof room.currentGameIndex === 'undefined') {
                    room.currentGameIndex = 0;
                } else {
                    room.currentGameIndex++;
                }
                
                // Check if we have more games
                const hasMoreGames = room.currentGameIndex < room.gameTypes.length;
                
                // Find the next game type from the sequence
                const nextGameType = hasMoreGames ? 
                    gameTypeMapping[room.gameTypes[room.currentGameIndex]] : null;
                
                // If there are no more games, go to summary page
                const targetPage = hasMoreGames ? nextGameType + "-duel" : "summary-duel";
                
                // Broadcast completion to all players
                io.to(roomName).emit("gameOver", {
                    winner,
                    targetCharacter,
                    nextGame: hasMoreGames ? nextGameType : null,
                    isLastGame: !hasMoreGames,
                    summaryPage: !hasMoreGames ? "summary-duel" : null
                });
                
                // Clear the target character for the next game
                delete room.targetCharacter;
                
                // Broadcast updated game sequence
                io.to(roomName).emit("gameSequence", {
                    sequence: room.gameTypes.map(type => gameTypeMapping[type]),
                    currentIndex: room.currentGameIndex
                });
            }
        });

        // Add a new handler for getting duel summary
        socket.on("getDuelSummary", ({ roomName }) => {
            if (rooms.has(roomName)) {
                const room = rooms.get(roomName);
                
                // Calculate points for each player
                const scores = {}; 
                
                // Initialize scores for all players
                room.members.forEach(member => {
                    scores[member.name] = 0;
                });
                
                // Add up scores from all games
                if (room.gameResults) {
                    room.gameResults.forEach(result => {
                        if (result.winner && scores.hasOwnProperty(result.winner)) {
                            scores[result.winner] += 1;
                        }
                    });
                }
                
                // Determine the winner
                let maxScore = 0;
                let winners = [];
                
                // Find highest score
                Object.keys(scores).forEach(player => {
                    if (scores[player] > maxScore) {
                        maxScore = scores[player];
                        winners = [player];
                    } else if (scores[player] === maxScore && maxScore > 0) {
                        winners.push(player);
                    }
                });
                
                // Create the final result object
                const finalResult = {
                    isDraw: winners.length !== 1,
                    winner: winners.length === 1 ? winners[0] : undefined,
                    scores: scores
                };
                
                // Send data back to client
                socket.emit("duelSummary", {
                    results: room.gameResults || [],
                    finalResult: finalResult
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
                    targetCharacter: room.targetCharacter, // Include target character
                    currentGameIndex: room.currentGameIndex || 0
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