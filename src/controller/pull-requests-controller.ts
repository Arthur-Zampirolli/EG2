import { gql } from "graphql-request";
import GraphQLRepository from "../repository/graphQL-repository";
import { IPullRequestResponse } from "../helpers/interfaces";
import { readFileSync } from "fs";

export default class PullRequestController {
  async getAllPRComments(owner: string, name: string) {
    const data = await this.getfirst50PR(owner, name)
    let result: any = []
    data.repository.pullRequests.nodes.forEach(element => {
      element.comments.nodes.forEach(c => {
        result.push({ pr_id: element.number, comment: c.body })
      })
      element.reviews.nodes.forEach(r => {
        result.push({ pr_id: element.number, comment: r.body })
      })
    });
    return result
  }
  async getfirst50PR(owner: string, name: string): Promise<IPullRequestResponse> {
    const variables = {
      owner: owner,
      name: name
    }
    const repository = new GraphQLRepository()
    // const query = gql`
    //   query GetPRComments($owner: String!, $name: String!) {
    //     repository(owner: $owner, name: $name) {
    //       pullRequests(first: 50, orderBy: {field: CREATED_AT, direction: DESC}) {
    //         nodes {
    //           number
    //           title
    //           comments(first: 100) {
    //             nodes {
    //               author {
    //                 login
    //               }
    //               body
    //               createdAt
    //             }
    //           }

    //         }
    //       }
    //     }
    //   }
    // `;
    const query = gql`${readFileSync('./src/repository/queries/pull-requests.gql', 'utf-8')}`
    return await repository.run(query, variables)
  }
}