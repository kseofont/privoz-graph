import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://privoz.lavron.dev/graphql/', // Your GraphQL API endpoint
    cache: new InMemoryCache(),
});

export default client;
