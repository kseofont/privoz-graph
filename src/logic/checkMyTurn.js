import { gql } from '@apollo/client';

const GET_GAME_DATA = gql`
  query checkPhase {
    game {
      currentPhase
      currentTurnIndex
      players {
        id
        hero {
          id
          name
        }
        traders {
          id
          sector {
            traders {
              id
            }
            name
            id
          }
        }
      }
    }
  }
`;

async function checkMyTurn(client, currentPlayerId) {
  try {
    const { data } = await client.query({ query: GET_GAME_DATA });

    // Check if player with currentPlayerId and same currentTurnIndex exists
    const currentPlayerIndex = data.game.players.findIndex(player => player.id === currentPlayerId);
    const myTurn = currentPlayerIndex !== -1 && currentPlayerIndex === data.game.currentTurnIndex;
    return myTurn;
  } catch (error) {
    // Handle error
    console.error('Error while checking turn:', error);
    return false;
  }
}

export default checkMyTurn;
