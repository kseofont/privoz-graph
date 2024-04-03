// src/logic/fetchActiveUserId.js
import { gql } from '@apollo/client';

const GET_GAME_DATA = gql`
  query GetGameData {
    game {
      queue {
        activePlayerId
      }
    }
  }
`;

const fetchActiveUserId = async (client, setActiveUserId) => {
    try {
        const { data } = await client.query({
            query: GET_GAME_DATA,
            fetchPolicy: 'network-only' // Ensure fresh data is fetched
        });
        console.log('Fetched data:', data);
        setActiveUserId(data.game.queue.activePlayerId);
    } catch (error) {
        console.error('Error fetching active user id:', error);
    }
};

export default fetchActiveUserId;
