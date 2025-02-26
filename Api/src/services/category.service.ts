const { pool } = require ("../config/database")



export const getAllPublicCategories = async () => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM categories WHERE public = 1;`, (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            });
        });
        return results;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}