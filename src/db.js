import fs from 'node:fs/promises';
//const DB_PATH = new URL('../db.json', import.meta.url).pathname;
const DB_PATH = './db.json';

export const readDB = async () => {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
}

export const writeDB = async (db) => {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
    return db;
}

export const insertDB = async (note) => {
    const db = await readDB();
    db.notes.push(note);
    await writeDB(db);
    return note;
}
