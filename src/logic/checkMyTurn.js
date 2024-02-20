import { gql } from '@apollo/client';

// Define the GraphQL query
export const GET_GAME_DATA = gql`
  query checkPhase {
    game {
     activePlayerId
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

// Function to check if it's the current player's turn
async function checkMyTurn(client, currentPlayerId) {
  try {
    const { data } = await client.query({ query: GET_GAME_DATA });
    //    console.log('data', data)
    const activePlayer = data.game.players.find(player => player.id == data.game.activePlayerId);
    //  console.log('activePlayer', activePlayer)
    // Check if it's the current player's turn
    const myTurn = activePlayer && activePlayer.id === currentPlayerId;
    //  console.log('myTurn', myTurn);
    return myTurn;
  } catch (error) {
    // Handle error
    console.error('Error while checking turn:', error);
    return false;
  }
}

export default checkMyTurn;
