import { readDB, writeDB, insertDB } from "./db.js";

export const insertNote = async (note, tags) => {
    const newNote = {
        tags: tags ? tags : [],
        content: note,
        id: Date.now()
    }

    await insertDB(newNote);
    return newNote;
}

export const getNotes = async () => {
    const {notes} = await readDB();
    return notes;
}

export const findNote = async (filter) => {
    const {notes} = await readDB();
    return notes.filter(note => note.content.toLowerCase().includes(filter.toLowerCase()));
}

export const removeNote = async id => {
    const {notes} = await readDB();
    const match = notes.filter(note => note.id === id);

    if(match.length > 0){
        const newNotes = notes.filter(note => note.id !== id);
        await writeDB({notes: newNotes});
        return match;
    }
}

export const removeNotes = () => writeDB({notes: []});
