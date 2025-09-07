import { GraphQLClient, gql } from 'graphql-request';
import * as dotenv from 'dotenv'
dotenv.config({ path: ".env" })

const API_TOKEN = process.env.API_TOKEN;

if (!API_TOKEN) throw new Error("undefined API_TOKEN. Check your .env file.");

export const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});