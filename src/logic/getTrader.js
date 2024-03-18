import { gql } from '@apollo/client';

// Define the GraphQL mutation
const GET_TRADER_MUTATION = gql`
  mutation GetTrader($playerId: Int!, $sectorId: Int!, $productCardsIds: [Int!]!) {
    getTrader(playerId: $playerId, sectorId: $sectorId, productCardsIds: $productCardsIds) {
      trader {
        id
      }
    }
  }
`;


console.log('Mutation addsdsdsd');

// Create the getTrader function
async function getTrader(client, playerId, sectorId, productCardsIds, setError, setSectors, sectors, setProduct, product) {
  try {
    const playerIdInt = parseInt(playerId, 10); // Ensure playerId is an integer
    const sectorIdInt = parseInt(sectorId, 10); // Ensure sectorId is an integer
    const productCardsIdsInt = productCardsIds.map(id => parseInt(id, 10)); // Ensure each productCardId is an integer

    const { data } = await client.mutate({
      mutation: GET_TRADER_MUTATION,
      variables: {
        playerId: playerIdInt,
        sectorId: sectorIdInt,
        productCardsIds: productCardsIdsInt,
      },
    });
    // Handle successful mutation here, for example:
    console.log('Mutation result', data);
    // Optionally, update your local state based on the mutation result

  } catch (error) {
    console.error('Error performing getTrader mutation:', error);

    // Check if the error is a network error (e.g., server not reachable)
    if (error.networkError) {
      console.error('Network error:', error.networkError);
    }

    // Extract GraphQL errors
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      // Log or handle GraphQL errors specifically
      console.error('GraphQL Errors:', error.graphQLErrors);
      setError(error.graphQLErrors.map(err => err.message).join(', '));
    } else if (error.networkError && error.networkError.result && error.networkError.result.errors) {
      // Sometimes GraphQL errors are in the result of a network error
      console.error('GraphQL Errors in Network Result:', error.networkError.result.errors);
      setError(error.networkError.result.errors.map(err => err.message).join(', '));
    } else {
      // Fallback for any other error scenarios
      setError(error.message || 'An unknown error occurred');
    }
  }
}

// Then, you would call getTrader(...) with the appropriate parameters where needed in your App component

export default getTrader;
