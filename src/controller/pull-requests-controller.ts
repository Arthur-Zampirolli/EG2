import { gql } from "graphql-request";
import GraphQLRepository from "../repository/graphQL-repository";
import { IPullRequestResponse } from "../helpers/interfaces";
import { readFileSync } from "fs";

export default class PullRequestController {
  async getAllPRComments(owner: string, name: string) {
    const data = await this.getfirst50PR(owner, name)
    console.log(`📊 Total de PRs encontrados: ${data.repository.pullRequests.nodes.length}`)
    
    let result: any = []
    data.repository.pullRequests.nodes.forEach((element, index) => {
      console.log(`PR #${element.number}: ${element.comments.nodes.length} comentários, ${element.reviews.nodes.length} reviews`)
      
      element.comments.nodes.forEach(c => {
        if (c.body && c.body.trim()) { // Só adiciona se o comentário não estiver vazio
          result.push({ pr_id: element.number, comment: c.body })
        }
      })
      element.reviews.nodes.forEach(r => {
        if (r.body && r.body.trim()) { // Só adiciona se o review não estiver vazio
          result.push({ pr_id: element.number, comment: r.body })
        }
      })
    });
    
    console.log(`📝 Total de comentários coletados: ${result.length}`)
    return result
  }
  async getfirst50PR(owner: string, name: string): Promise<IPullRequestResponse> {
    const variables = {
      owner: owner,
      name: name
    }
    const repository = new GraphQLRepository()
    const query = gql`${readFileSync('src/repository/queries/pull-requests.gql', 'utf-8')}`
    return await repository.run(query, variables)
  }
}