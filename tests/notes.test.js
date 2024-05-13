import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/db.js', () => ({
  readDB: jest.fn(),
  writeDB: jest.fn(),
  insertDB: jest.fn(),
}));

const { insertDB, readDB, writeDB } = await import('../src/db.js');
const { insertNote, getNotes, removeNote } = await import('../src/notes.js');

beforeEach(() => {
  readDB.mockClear();
  writeDB.mockClear();
  insertDB.mockClear();
})

test('insertNote inserts data and returns it', async () => {
  const note = 'Test note';
  const tags = ['tag1', 'tag2'];
  const data = {
    tags,
    content: note,
    id: Date.now(),
  };
  insertDB.mockResolvedValue(data);

  const result = await insertNote(note, tags);
  expect(result.content).toEqual(data.content);
  expect(result.tags).toEqual(data.tags);
});

test('getNotes returns all notes', async () => {
  const db = {
    notes: ['note1', 'note2', 'note3']
  };
  readDB.mockResolvedValue(db);

  const result = await getNotes();
  expect(result).toEqual(db.notes);
});

test('removeNote does nothing if id is not found', async () => {
  const notes = [
    { id: 1, content: 'note 1' },
    { id: 2, content: 'note 2' },
    { id: 3, content: 'note 3' },
  ];
  writeDB.mockResolvedValue(notes);

  const idToRemove = 4;
  const result = await removeNote(idToRemove);
  expect(result).toBeUndefined();
});

test('removeNote removes the note and returns it if id is found', async () => {
    const notes = [
      { id: 1, content: 'note 1' },
      { id: 2, content: 'note 2' },
      { id: 3, content: 'note 3' },
    ];
    readDB.mockResolvedValue({notes});
    writeDB.mockResolvedValue(notes.slice(0, 2));
  
    const idToRemove = 3;
    const result = await removeNote(idToRemove);
    expect(result).toEqual([notes[2]]);
  });