import fs from 'node:fs';
import { parse } from 'csv-parse';

const path = new URL('./tasks.csv', import.meta.url);

const readStream = fs.createReadStream(path);

const csvParser = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
});

async function loadRecords(){
    const lines = readStream.pipe(csvParser);

    for await(const line of lines){
        const [title, description] = line;
    
        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            body: JSON.stringify({title, description}),
            headers: {'Content-Type': 'application/json'}
        })
    }
}

loadRecords()
