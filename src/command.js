import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { getNotes, insertNote, findNote, removeNote, removeNotes } from './notes.js';
import { start } from './server.js';

const displayNotes = (notes) => {
  notes.forEach(({id, content, tags}) => {
    console.log(`ID: ${id}`);
    console.log(`Content: ${content}`);
    console.log(`Tags: ${tags ? tags.join(', ') : 'none'}`);
    console.log('\n');
  });
}

yargs(hideBin(process.argv))
  .command('new <note>', 'create a new note', yargs => {
    return yargs.positional('note', {
      describe: 'The content of the note you want to create',
      type: 'string'
    })
  }, async (argv) => {
    const tags = argv.tags ? argv.tags.split(',') : [];
    const note = await insertNote(argv.note, tags);
    console.log('New note added!\n');
    displayNotes([note]);
  })
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'tags to add to the note'
  })
  .command('all', 'get all notes', () => {}, async (argv) => {
    const notes = await getNotes();
    displayNotes(notes);
  })
  .command('find <filter>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string'
    })
  }, async (argv) => {
    const notes = await findNote(argv.filter);
    displayNotes(notes);
  })
  .command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number',
      description: 'The id of the note you want to remove'
    })
  }, async (argv) => {
    const removed = await removeNote(argv.id);
    if (removed){
      console.log('Note removed!\n');
      displayNotes(removed);
    }
  })
  .command('web [port]', 'launch website to see notes', yargs => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number'
      })
  }, async (argv) => {
    const notes = await getNotes();
    start(notes, argv.port);
  })
  .command('clean', 'remove all notes', () => {}, async (argv) => {
    await removeNotes();
    console.log('All notes removed!');
  })
  .demandCommand(1)
  .parse()