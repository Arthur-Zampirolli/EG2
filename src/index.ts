import * as dotenv from 'dotenv'
dotenv.config({ path: ".env" })
const token = process.env.API_TOKEN
import { writeFileSync } from 'fs';
import PullRequestController from './controller/pull-requests-controller';
import { json2csv } from 'json-2-csv';


async function getFirst50() {
    const controller = new PullRequestController()
    const response = await controller.getfirst50PR('facebook', 'react')
    return response
}

async function getComments() {
    const controller = new PullRequestController()
    const response = await controller.getAllPRComments('facebook', 'react')
    return response
}

function saveJSON(content: string, path: string) {
    try {
        console.log(`saving ${content} to ${path}`)
        writeFileSync(path, content, { flag: 'w' });
    } catch (error) {
        throw new Error(error.message)
    }
}

async function saveCSV(content: any[], path: string) {
    try {
        const csv = await json2csv(content,
            {
                delimiter: {
                    field: ';',
                },
            }
        );
        //console.log(`saving ${JSON.stringify(content)} to ${path}`)
        writeFileSync(path, csv, { flag: 'w' });
    } catch (error) {
        throw new Error(error.message)
    }
}

//save(await getFirst50(), '50-PR.json')
saveCSV(await getComments(), 'comments-PR.csv')