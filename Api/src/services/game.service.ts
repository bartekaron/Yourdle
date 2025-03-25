const { pool } = require ("../config/database")
const { decrypt } = require("../utils/decrypt");

export const getAllClassicService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM classic WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni a klasszikus játékokat" };
    }
};

export const getSolutionClassicService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM classic WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            });
        });

        if (!result) {
            return { success: false, message: "Nem található karakter ebben a kategóriában." };
        }

        return { success: true, data: result };  // Mindig legyen success flag!
    } catch (error) {
        return { success: false, message: "Nem sikerült karaktert lekérni" };
    }
}


export const getAllEmojiService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM emoji WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni a klasszikus játékokat" };
    }
};

export const getSolutionEmojiService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM emoji WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            });
        });

        if (!result) {
            return { success: false, message: "Nem található karakter ebben a kategóriában." };
        }

        return { success: true, data: result };  // Mindig legyen success flag!
    } catch (error) {
        return { success: false, message: "Nem sikerült karaktert lekérni" };
    }
}

export const getAllDescriptionService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM description WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni az emoji karaktereket" };
    }
}

export const getSolutionDescriptionService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM description WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            });
        });

        if (!result) {
            return { success: false, message: "Nem található karakter ebben a kategóriában." };
        }

        return { success: true, data: result }; 
    } catch (error) {
        return { success: false, message: "Nem sikerült karaktert lekérni" };
    }
}


export const getAllQuoteService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM quote WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni az idézeteket" };
    }
}

export const getSolutionQuoteService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) =>
            pool.query(`SELECT * FROM quote WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            })
        );

        if (!result) {
            return { success: false, message: "Nem található idézet ebben a kategóriában." };
        }

        return { success: true, data: result }; 
    } catch (error) {
        return { success: false, message: "Nem sikerült idézetet lekérni" };
    }
}

export const getAllPictureService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) =>
            pool.query(`SELECT * FROM picture WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                resolve(results);
            })
        );

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni a képeket" };
    }
}


export const getSolutionPictureService = async (id) => {
    try {
        const result:any = await new Promise((resolve, reject) =>
            pool.query(`SELECT id, categoryID, answer, picture FROM picture WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                if (results.length === 0) {
                    return resolve(null);
                }
                resolve(results[0]);
            })
        );

        if (!result) {
            return { success: false, message: "Nem található kép ebben a kategóriában." };
        }

        // Decrypt the picture
        if (result.picture) {
            result.picture = decrypt(result.picture);
        }

        return { success: true, data: result }; 
    } catch (error) {
        return { success: false, message: "Nem sikerült képet lekérni" };
    }
}