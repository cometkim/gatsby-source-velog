import { GraphQLClient } from 'graphql-request';
import { getSdk } from './__generated__/sdk';

export function makeClient(endpoint: string) {
  const graphqlClient = new GraphQLClient(endpoint);
  const client = getSdk(graphqlClient);
  return client;
}
