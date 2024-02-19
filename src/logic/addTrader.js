import { gql } from '@apollo/client';
import client from '../client'; // Import your Apollo Client instance

// Define the GraphQL mutation
const ADD_TRADER = gql`
  mutation HireTrader($playerId: Int!, $sectorId: Int!) {
    hireTrader(playerId: $playerId, sectorId: $sectorId) {
      trader {
        id
        # Include any other fields you need from the TraderType
      }
    }
  }
`;

// Define the addTrader function
const addTrader = async (playerId, sectorId) => {
    // Perform validation to check if playerId and sectorId are valid
    if (!playerId || !sectorId) {
        throw new Error('Player ID and Sector ID are required');
    }

    // Check if playerId and sectorId are valid integers
    if (isNaN(playerId) || isNaN(sectorId)) {
        throw new Error('Player ID and Sector ID must be valid integers');
    }

    try {
        // Send the mutation request to the server
        const { data } = await client.mutate({
            mutation: ADD_TRADER,
            variables: {
                playerId,
                sectorId
            }
        });

        // Extract and return the trader data from the response
        return data.hireTrader.trader;
    } catch (error) {
        // Handle any errors that occur during the mutation
        console.error('Error adding trader:', error);
        throw error;
    }
};

export default addTrader;
