import { gql } from 'graphql-request';
import { client } from '../services/graphQL-client'
export default class GraphQLRepository {
    async run(query1: string) {
        const query = gql`
          query {
            viewer {
              login
              name
              bio
              email
            }
          }
        `;
        try {
            const data = await client.request(query);
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }
}