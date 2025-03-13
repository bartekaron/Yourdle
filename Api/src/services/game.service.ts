const { pool } = require ("../config/database")

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

