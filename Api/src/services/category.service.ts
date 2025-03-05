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

export const createClassicService = async (classic) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO classic SET ?`, classic, (err, results) => {
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

export const createDescriptionService = async (description) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO description SET ?`, description, (err, results) => {
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

export const createEmojiService = async (emoji) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO emoji SET ?`, emoji, (err, results) => {
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

export const createQuoteService = async (quote) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO quote SET ?`, quote, (err, results) => {
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

export const createPictureService = async (picture) => {
    try {
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO picture SET ?`, picture, (err, results) => {
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