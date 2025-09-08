import { gql } from 'graphql-request';
import { client } from '../services/graphQL-client'
import { IPullRequestResponse } from '../helpers/interfaces';
export default class GraphQLRepository {
    async run(query: string, variables: any): Promise<IPullRequestResponse>{
        try {
            const data = await client.request(query, variables);
            console.log(data);
            return data as IPullRequestResponse
        } catch (err) {
            throw new Error(err);
        }
    }
}