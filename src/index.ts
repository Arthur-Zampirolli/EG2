import * as dotenv from 'dotenv'
import axios from 'axios'
dotenv.config({path: ".env"})
const token = process.env.API_TOKEN
import { writeFileSync } from 'fs';

// const url = 'https://api.github.com/orgs/ORG/repos'

async function getRepositories(organization:string){
    //console.log(JSON.stringify(config))
    try{
        //const url = `https://api.github.com/orgs/${organization}/repos`

        const githubApi = await axios.create({
                baseURL: 'https://api.github.com',
                // You can add common headers here, e.g., for authentication
                headers: {
                  'Authorization': `token ${token}`
                } 
            });
        const response = (await githubApi.get(`/orgs/${organization}/repos`)).data
        //console.log(`response :: ${JSON.stringify(response)}`)
        return response
    }catch(error){
        throw new Error(error.message)
    }
}

async function getIssueDataFromID(owner:string, repo:string, id:number){
    //console.log(JSON.stringify(config))
    ///repos/{owner}/{repo}/issues
    try{
        //const url = `https://api.github.com/orgs/${organization}/repos`

        const githubApi = await axios.create({
                baseURL: 'https://api.github.com',
                // You can add common headers here, e.g., for authentication
                headers: {
                  'Authorization': `token ${token}`
                } 
            });
        const response = (await githubApi.get(`repos/${owner}/${repo}/issues/${id}`)).data
        //console.log(`response :: ${JSON.stringify(response)}`)
        return response
    }catch(error){
        throw new Error(error.message)
    }
}

async function getRepoStargazers(owner:string, repo:string){
    //console.log(JSON.stringify(config))
    ///repos/{owner}/{repo}/issues
    try{
        //const url = `https://api.github.com/repos/OWNER/REPO/stargazers`

        const githubApi = await axios.create({
                baseURL: 'https://api.github.com',
                // You can add common headers here, e.g., for authentication
                headers: {
                  'Authorization': `token ${token}`
                } 
            });
        const response = (await githubApi.get(`repos/${owner}/${repo}/stargazers`)).data
        //console.log(`response :: ${JSON.stringify(response)}`)
        return response
    }catch(error){
        throw new Error(error.message)
    }
}

async function getPRData(owner:string, repo:string, pullNumber: number){
    //console.log(JSON.stringify(config))
    ///repos/{owner}/{repo}/issues
    try{
        //const url = `https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}/reviews`

        const githubApi = await axios.create({
                baseURL: 'https://api.github.com',
                // You can add common headers here, e.g., for authentication
                headers: {
                  'Authorization': `token ${token}`
                } 
            });
        const response = (await githubApi.get(`repos/${owner}/${repo}/pulls/${pullNumber}`)).data
        //console.log(`response :: ${JSON.stringify(response)}`)
        return response
    }catch(error){
        throw new Error(error.message)
    }
}


function save(content: string, path:string){
    try{
        console.log(`saving ${content} to ${path}`)
        writeFileSync(path, content, { flag: 'w' });
    }catch(error){
        throw new Error(error.message)
    }
}
//save(JSON.stringify(await getRepositories('google')), 'output-repositories.json')
//save(JSON.stringify(await getIssueDataFromID('jquery', 'jquery', 4056)), 'output-issues.json')
//save(JSON.stringify(await getRepoStargazers('facebook', 'react')), 'output-stars.json')
save(JSON.stringify(await getPRData('rails', 'rails', 33039)), 'output-pull-request.json')
