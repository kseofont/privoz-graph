import { gql } from '@apollo/client';

// Define the GraphQL query
export const GET_GAME_DATA = gql`
  query checkPhase {
  game {
    moveOrder {
      activePlayerId
      currentPhase
      playersOrderIds
    }
  }
  }
`;

// Function to check if it's the current player's turn
async function checkMyTurn(client, currentPlayerId) {
  try {
    const { data } = await client.query({ query: GET_GAME_DATA });
    //    console.log('data', data)
    const activePlayer = data.game.moveOrder.activePlayerId;
    const moveOrder = data.game.moveOrder;
    //  console.log('activePlayer', activePlayer)
    // Check if it's the current player's turn
    const myTurn = activePlayer && activePlayer.id === currentPlayerId;
    //  console.log('myTurn', myTurn);
    return moveOrder;
  } catch (error) {
    // Handle error
    console.error('Error while checking turn:', error);
    return false;
  }
}

export default checkMyTurn;
