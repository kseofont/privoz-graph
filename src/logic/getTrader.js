import { gql } from '@apollo/client';
import updateSectorsWithNewTrader from './updateSectorsWithNewTrader';

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




async function getTrader(client, playerId, sectorId, productCardsIds, sectors, setError,   setSectors) {
  try {
    const playerIdInt = parseInt(playerId, 10); // Ensure playerId is an integer
    const sectorIdInt = parseInt(sectorId, 10); // Ensure sectorId is an integer
    const productCardsIdsInt = productCardsIds.map(id => parseInt(id, 10)); // Ensure each productCardId is an integer
    console.log('getTrader sectors get', sectors);
    const mutationResult = await client.mutate({
      mutation: GET_TRADER_MUTATION,
      variables: {
        playerId: playerIdInt,
        sectorId: sectorIdInt,
        productCardsIds: productCardsIdsInt,
      },
    });

    console.log('Mutation result', mutationResult);

    // Assuming mutationResult contains the new trader info and the sectorId to which it belongs
    const newTrader = mutationResult.data.getTrader.trader;

    console.log('newTrader', newTrader);
    // Call the callback function to update the sectors state
    if (updateSectorsWithNewTrader) {
      console.log('newTrader after', sectorIdInt);
      console.log('newTrader sectors', sectors);
      updateSectorsWithNewTrader(newTrader, sectorIdInt, sectors, setSectors);
    }

  } catch (error) {
    console.error('Error performing getTrader mutation:', error);
    // Handle errors (network, GraphQL, etc.) as before
    // setError handling remains the same
  }
}

export default getTrader;

