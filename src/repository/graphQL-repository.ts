import { gql } from 'graphql-request';
import { client } from '../services/graphQL-client'
export default class GraphQLRepository {
    async run(query: string, variables: any) {
        try {
            const data = await client.request(query, variables);
            console.log(data);
            return data
        } catch (err) {
            console.error(err);
        }
    }
}