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

export const getCategoryByIDService = async (id) => {
    try {
        const results = await new Promise((resolve, reject) =>
            pool.query(`SELECT * FROM categories WHERE id = ?`, [id], (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            })
        );
        return results;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export const createCategoryService = async (category) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO categories SET ?`, category, (err, results) => {
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

export const createClassicService = async (answer, gender, height, weight, hairColor, adress, birthDate ) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO classic SET ?`, answer, gender, height, weight, hairColor, adress, birthDate, (err, results) => {
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

export const createDescriptionService = async (answer, desc) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO description SET ?`, answer, desc, (err, results) => {
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

export const createEmojiService = async (answer, firstEmoji, secondEmoji, thirdEmoji) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO emoji SET ?`, answer, firstEmoji, secondEmoji, thirdEmoji, (err, results) => {
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

export const createQuoteService = async (answer, quote) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO quote SET ?`, answer, quote, (err, results) => {
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

export const createPictureService = async (answer, picture) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO picture SET ?`, answer, picture, (err, results) => {
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