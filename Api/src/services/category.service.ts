import { decrypt } from "../utils/decrypt";

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

export const createClassicService = async ({answer, gender, height, weight, hairColor, address, age, categoryID }) => {
    try {
        const id = uuidv4();
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO classic SET ?`, { id, answer, gender, height, weight, hairColor, address, age, categoryID}, (err, results) => {
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

export const createDescriptionService = async ({answer, description, categoryID}) => {
    try {
        const id = uuidv4();
        const results = await new Promise((resolve, reject) => {
            pool.query(`INSERT INTO description SET ?`, {id, answer, description, categoryID}, (err, results) => {
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

export const getAllCategoriesService = async () => {
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM categories`, (err, results) => {
                if (err) {
                    return reject(new Error('Hiba az adatbázis kapcsolatban'));
                }
                resolve(results);
            });
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni a kategóriákat" };
    }
};



export const getCategoryDataService = async (id) => {
    try {
        // Első lépésben lekérdezzük a kategória mezőit
        const categoryData:any = await new Promise((resolve, reject) => {
            pool.query(
                `SELECT classic, quote, emoji, picture, description FROM categories WHERE id = ?`,
                [id],
                (err, results) => {
                    if (err) {
                        console.log(err)
                        return reject(new Error('Hiba az adatbázis kapcsolatban'));
                    }
                    if (results.length === 0) {
                        return reject(new Error('Nincs ilyen kategória'));
                    }
                    resolve(results[0]);
                }
            );
        });


        // Kategória mezők, amik alapján szűrünk
        const { classic, quote, description, picture, emoji } = categoryData;

        // Eredmények tárolása
        let result = [];

        // Lekérdezés és eredmények hozzáadása
        if (classic === 1) {
            const classicData:any = await new Promise((resolve, reject) => {
                pool.query(
                    `SELECT * FROM classic WHERE categoryID = ?`,
                    [id],
                    (err, results) => {
                        if (err) {
                            return reject(new Error('Hiba az adatbázis kapcsolatban'));
                        }
                        resolve(results);
                    }
                );
            });
            result = [...result, ...classicData];
        }

        if (quote === 1) {
            const quoteData:any = await new Promise((resolve, reject) => {
                pool.query(
                    `SELECT * FROM quote WHERE categoryID = ?`,
                    [id],
                    (err, results) => {
                        if (err) {
                            return reject(new Error('Hiba az adatbázis kapcsolatban'));
                        }
                        resolve(results);
                    }
                );
            });
            result = [...result, ...quoteData];
        }

        if (description === 1) {
            const descriptionData:any = await new Promise((resolve, reject) => {
                pool.query(
                    `SELECT * FROM description WHERE categoryID = ?`,
                    [id],
                    (err, results) => {
                        if (err) {
                            return reject(new Error('Hiba az adatbázis kapcsolatban'));
                        }
                        resolve(results);
                    }
                );
            });
            result = [...result, ...descriptionData];
        }

        if (picture === 1) {
            const pictureData: any = await new Promise((resolve, reject) => {
                pool.query(
                    `SELECT * FROM picture WHERE categoryID = ?`,
                    [id],
                    (err, results) => {
                        if (err) {
                            return reject(new Error('Hiba az adatbázis kapcsolatban'));
                        }
                        resolve(results);
                    }
                );
            });

            // Ha van pictureData és a picture titkosítva van, visszafejtjük
            if (pictureData && pictureData.length > 0) {
                pictureData.forEach((item) => {
                    if (item.picture) {
                        item.picture = decrypt(item.picture); // Visszafejtés
                    } else {
                        item.picture = 'http://localhost:3000/uploads/placeholder.png'; // Placeholder kép ha nincs
                    }
                });
                result = [...result, ...pictureData];
            }
        }

        if (emoji === 1) {
            const emojiData:any = await new Promise((resolve, reject) => {
                pool.query(
                    `SELECT * FROM emoji WHERE categoryID = ?`,
                    [id],
                    (err, results) => {
                        if (err) {
                            return reject(new Error('Hiba az adatbázis kapcsolatban'));
                        }
                        resolve(results);
                    }
                );
            });
            result = [...result, ...emojiData];
        }

        // Ha nincs találat
        if (result.length === 0) {
            return { success: false, message: "Nincs elérhető adat a megadott kategóriában." };
        }

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: "Nem sikerült lekérni az adott kategória adatait" };
    }
};

export const deleteCategoryService = async(id)=>{
    try {
        const results:any = await new Promise((resolve, reject) => {
            pool.query(`DELETE FROM categories WHERE id = ?`, [id], (err, results) => {
                if (err) {
                    const error:any = new Error('Hiba az adatbázis kapcsolatban');
                    error.status = 500;
                    return reject(error);
                }
                resolve(results);
            });
        });
        return { success: true, message: "Kategória sikeresen törölve!" };
    } catch (error) {
        return { success: false, message: "Nem sikerült törölni a kategóriát" };
    }
}
