const { pool } = require ("../config/database")
const { v4: uuidv4 } = require('uuid');

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

export const createClassicService = async ({answer, gender, height, weight, hairColor, address, birthDate, categoryID }) => {
    try {
        const id = uuidv4();
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO classic SET ?`, { id, answer, gender, height, weight, hairColor, address, birthDate, categoryID}, (err, results) => {
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

export const createDescriptionService = async ({answer, desc, categoryID}) => {
    try {
        const id = uuidv4();
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO description SET ?`, {id, answer, desc, categoryID}, (err, results) => {
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

export const createEmojiService = async ({answer, firstEmoji, secondEmoji, thirdEmoji, categoryID}) => {
    try {
        const id = uuidv4();
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO emoji SET ?`, {id, answer, firstEmoji, secondEmoji, thirdEmoji, categoryID}, (err, results) => {
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

export const createQuoteService = async ({answer, quote, categoryID}) => {
    try {
        const id = uuidv4();
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO quote SET ?`, {id, answer, quote, categoryID},(err, results) => {
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

export const createPictureService = async ({answer, picture, categoryID}) => {
    try {
        const id = uuidv4();
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO picture SET ?`, {id, answer, picture, categoryID}, (err, results) => {
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