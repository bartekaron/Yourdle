const { pool } = require ("../config/database")

export const getAllClassicService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM classic WHERE categoryID = ?`, [id], (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            });
        });
        return result;
    } catch (error) {
        return {success: false, message:"Nem sikerült lekérni a klasszikus játékokat"}
    }
}

export const getSolutionClassicService = async (id) => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM classic WHERE categoryID = ? ORDER BY RAND() LIMIT 1`, [id], (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
        return result;
    } catch (error) {
        return {success: false, message:"Nem sikerült karaktert lekérni"}
    }
}
