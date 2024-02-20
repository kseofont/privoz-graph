import { gql } from '@apollo/client';
import client from '../client';
import { GET_SECTOR_DATA } from './getSectors'; // Import the GET_SECTOR_DATA query

const ADD_TRADER = gql`
  mutation AddTrader($playerId: Int!, $sectorId: Int!) {
    hireTrader(playerId: $playerId, sectorId: $sectorId) {
      trader {
        id
        player {
          id
        }
        sector {
          id
        }
      }
    }
  }
`;

const addTrader = async (sectorId, playerId, setError, setSectors) => {
    try {
        // Parse playerId and sectorId to integers
        playerId = parseInt(playerId);
        sectorId = parseInt(sectorId);

        // Perform validation to check if playerId and sectorId are valid
        if (!playerId || !sectorId || isNaN(playerId) || isNaN(sectorId)) {
            throw new Error('Player ID and Sector ID must be valid integers');
        }

        // Send the mutation request to the server
        const { data } = await client.mutate({
            mutation: ADD_TRADER,
            variables: {
                playerId,
                sectorId
            }
        });

        // Refetch sectors data after adding trader
        const { data: sectorData } = await client.query({
            query: GET_SECTOR_DATA
        });

        // Update sectors state with new sector data
        setSectors(sectorData.game.sectors);

        // Extract and return the trader data from the response
        return data.hireTrader.trader;
    } catch (error) {
        // Set the error state to display the error modal
        console.error(error);
        setError(error);
        throw error; // Rethrow the error to be caught by the calling function if needed
    }
};

export default addTrader;
