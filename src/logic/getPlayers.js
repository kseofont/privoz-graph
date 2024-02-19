import { gql } from '@apollo/client';

const GET_PLAYERS_DATA = gql`
query GetPlayers {
game {
    players {
      coins
      id
      hero {
        color
        id
        image
        name
      }
    }
  }
}
`;

async function GetPlayers(client) {
    try {
        const { data } = await client.query({ query: GET_PLAYERS_DATA });
        const players = data.game.players;
        return players;
    } catch (error) {
        // Handle error
        console.error('Error while fetching players:', error);
        return [];
    }
}

export default GetPlayers;
