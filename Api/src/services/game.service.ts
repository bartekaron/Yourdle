const { pool } = require("../config/database");
const { decrypt } = require("../utils/decrypt");
const { v4: uuidv4 } = require('uuid');

export const getAllClassicService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM classic WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni a klasszikus játékokat!" };
    }
};

export const getSolutionClassicService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM classic WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            });
        });

        if (!result) {
            return { success: false, message: "Nem található karakter ebben a kategóriában!" };
        }

        return { success: true, data: result };  // Mindig legyen success flag!
    } catch (error) {
        return { success: false, message: "Nem sikerült karaktert lekérni!" };
    }
}


export const getAllEmojiService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM emoji WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni a klasszikus játékokat!" };
    }
};

export const getSolutionEmojiService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM emoji WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            });
        });

        if (!result) {
            return { success: false, message: "Nem található karakter ebben a kategóriában!" };
        }

        return { success: true, data: result };  // Mindig legyen success flag!
    } catch (error) {
        return { success: false, message: "Nem sikerült karaktert lekérni!" };
    }
}

export const getAllDescriptionService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM description WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni az emoji karaktereket!" };
    }
}

export const getSolutionDescriptionService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM description WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            });
        });

        if (!result) {
            return { success: false, message: "Nem található karakter ebben a kategóriában!" };
        }

        return { success: true, data: result }; 
    } catch (error) {
        return { success: false, message: "Nem sikerült karaktert lekérni!" };
    }
}


export const getAllQuoteService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM quote WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni az idézeteket!" };
    }
}

export const getSolutionQuoteService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) =>
            pool.query(`SELECT * FROM quote WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            })
        );

        if (!result) {
            return { success: false, message: "Nem található idézet ebben a kategóriában!" };
        }

        return { success: true, data: result }; 
    } catch (error) {
        return { success: false, message: "Nem sikerült idézetet lekérni!" };
    }
}

export const getAllPictureService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) =>
            pool.query(`SELECT * FROM picture WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                resolve(results);
            })
        );

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni a képeket!" };
    }
}


export const getSolutionPictureService = async (id) => {
    try {
        const result:any = await new Promise((resolve, reject) =>
            pool.query(`SELECT id, categoryID, answer, picture FROM picture WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban!'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            })
        );

        if (!result) {
            return { success: false, message: "Nem található kép ebben a kategóriában!" };
        }

        // Decrypt the picture
        if (result.picture) {
            result.picture = decrypt(result.picture);
        }

        return { success: true, data: result }; 
    } catch (error) {
        return { success: false, message: "Nem sikerült képet lekérni!" };
    }
}

export const uploadLeaderboardService = async (player1ID, player2ID, winnerID) => {
    try {
        const players = [player1ID, player2ID];

        for (const userID of players) {
            await new Promise<void>((resolve, reject) => {
                pool.query(
                    `INSERT INTO leaderboard (id, userID, wins, losses, draws)
                     SELECT ?, ?, 0, 0, 0 FROM DUAL
                     WHERE NOT EXISTS (
                         SELECT 1 FROM leaderboard WHERE userID = ?
                     )`,
                    [uuidv4(), userID, userID],
                    (err) => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
        }

        if (winnerID === player1ID) {
            await updateStats(player1ID, "wins");
            await updateStats(player2ID, "losses");
        } else if (winnerID === player2ID) {
            await updateStats(player2ID, "wins");
            await updateStats(player1ID, "losses");
        } else {
            await updateStats(player1ID, "draws");
            await updateStats(player2ID, "draws");
        }

        return { success: true, message: "Leaderboard frissítve!" };
    } catch (error) {
        console.error("uploadLeaderboardService hiba:", error);
        return { success: false, message: "Nem sikerült frissíteni a toplistát!" };
    }
};

const updateStats = async (userID: string, field: "wins" | "losses" | "draws") => {
    return new Promise<void>((resolve, reject) => {
        pool.query(
            `UPDATE leaderboard SET ${field} = ${field} + 1 WHERE userID = ?`,
            [userID],
            (err) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
};

export const getAllLeaderboardService = async () => {
    try {
        const leaderboard:any = await new Promise((resolve, reject) => {
            pool.query(
                `SELECT leaderboard.id, leaderboard.userID, leaderboard.wins, leaderboard.losses, leaderboard.draws, users.name, users.profilePic 
                 FROM leaderboard 
                 JOIN users ON leaderboard.userID = users.id
                 ORDER BY leaderboard.wins DESC`,
                (err, results) => {
                    if (err) {
                        return reject(new Error("Hiba az adatbázis kapcsolatban!"));
                    }
                    resolve(results);
                }
            );
        });

        // Profilképek visszafejtése és alapértelmezett kép beállítása
        const formattedLeaderboard = leaderboard.map(entry => ({
            id: entry.id,
            name: entry.name,
            profilePic: entry.profilePic ? decrypt(entry.profilePic) : `http://localhost:3000/uploads/placeholder.png`,
            wins: entry.wins,
            losses: entry.losses,
            draws: entry.draws,
        }));

        return { success: true, data: formattedLeaderboard };
    } catch (error) {
        console.error("Leaderboard lekérési hiba:", error);
        return { success: false, message: "Nem sikerült a toplistát lekérni!" };
    }
};

export const getLeaderboardOneUserService = async (id) => {
    try {
        const leaderboard:any = await new Promise((resolve, reject) => {
            pool.query(
                `SELECT leaderboard.id, leaderboard.userID, leaderboard.wins, leaderboard.losses, leaderboard.draws, users.name, users.profilePic 
                 FROM leaderboard 
                 JOIN users ON leaderboard.userID = users.id
                 WHERE leaderboard.userID = ?`,
                [id],
                (err, results) => {
                    if (err) {
                        return reject(new Error("Hiba az adatbázis kapcsolatban!"));
                    }
                    if (results.length === 0) {
                        return resolve(null);
                    }
                    resolve(results[0]); // Csak egyetlen felhasználó adata kell
                }
            );
        });

        if (!leaderboard) {
            return { success: false, message: "A felhasználó nem található a toplistán!" };
        }

        // Profilkép visszafejtése vagy alapértelmezett kép beállítása
        const formattedLeaderboard = {
            id: leaderboard.id,
            name: leaderboard.name,
            profilePic: leaderboard.profilePic ? decrypt(leaderboard.profilePic) : `http://localhost:3000/uploads/placeholder.png`,
            wins: leaderboard.wins,
            losses: leaderboard.losses,
            draws: leaderboard.draws,
        };

        return { success: true, data: formattedLeaderboard };
    } catch (error) {
        console.error("Leaderboard lekérési hiba:", error);
        return { success: false, message: "Nem sikerült a toplistát lekérni!" };
    }
};

export const saveMatchResultService = async (matchData: { player1ID: string; player2ID: string; winnerID?: string; categoryId: number }) => {
  try {
    const { player1ID, player2ID, winnerID, categoryId } = matchData;
    
    // Generate a UUID for the game ID
    const gameId = uuidv4();
    
    // Insert to games table using the exact table structure - without gameType
    await new Promise<{affectedRows: number}>((resolve, reject) => {
      pool.query(
        `INSERT INTO games 
        (id, categoryID, player1ID, player2ID, winnerID, finishedAt)
        VALUES (?, ?, ?, ?, ?, NOW())`,
        [gameId, categoryId, player1ID, player2ID, winnerID || null],
        (err: Error, results: {affectedRows: number}) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
    
    return { success: true, gameId, message: 'Match result saved successfully' };
  } catch (error) {
    console.error('Error in saveMatchResultService:', error);
    return { success: false, message: 'Database error occurred' };
  }
};

