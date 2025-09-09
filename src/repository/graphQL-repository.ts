import { gql } from 'graphql-request';
import { client } from '../services/graphQL-client'
import { IPullRequestResponse } from '../helpers/interfaces';
export default class GraphQLRepository {
    async run(query: string, variables: any): Promise<IPullRequestResponse>{
        try {
            console.log('🔄 Fazendo request GraphQL...');
            console.log('Variables:', variables);
            const data = await client.request(query, variables);
            console.log('✅ Request concluído');
            return data as IPullRequestResponse
        } catch (err) {
            console.error('❌ Erro no GraphQL:', err);
            throw new Error(err);
        }
    }
}