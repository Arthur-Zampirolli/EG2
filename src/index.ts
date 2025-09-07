import * as dotenv from 'dotenv'
dotenv.config({ path: ".env" })
const token = process.env.API_TOKEN
import { writeFileSync } from 'fs';
import { gql } from 'graphql-request';
import PullRequestController from './controller/pull-requests-controller';
import { get } from 'http';


async function getFirst50() {
    const controller = new PullRequestController()
    const response = await controller.getComments('facebook', 'react')
    return JSON.stringify(response)
}
function save(content: string, path:string){
    try{
        console.log(`saving ${content} to ${path}`)
        writeFileSync(path, content, { flag: 'w' });
    }catch(error){
        throw new Error(error.message)
    }
}

save(await getFirst50(), '50-PR.json')