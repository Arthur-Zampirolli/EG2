import { gql } from "graphql-request";
import GraphQLRepository from "../repository/graphQL-repository";

export default class PullRequestController{
    async getComments(owner: string, name: string){
        const variables = {
            owner: owner,
            name: name
        }
        const repository = new GraphQLRepository()
        const query = gql`
          query GetPRComments($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              pullRequests(first: 50, orderBy: {field: CREATED_AT, direction: DESC}) {
                nodes {
                  number
                  title
                  comments(first: 100) {
                    nodes {
                      author {
                        login
                      }
                      body
                      createdAt
                    }
                  }
                }
              }
            }
          }
        `;
        return await repository.run(query, variables)
    }
}