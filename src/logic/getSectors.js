import { gql } from '@apollo/client';

export const GET_SECTOR_DATA = gql`
query GetSectors {
  game {
    sectors {
      id
      name
      traders {
        id
        player {
          id
        }
      }
    }
  }
}
`;

async function getSectors(client) {
    try {
        const { data } = await client.query({ query: GET_SECTOR_DATA });
        const sectors = data.game.sectors.filter(sector => sector.name !== 'Illegal');
        return sectors;
    } catch (error) {
        // Handle error
        console.error('Error while fetching sectors:', error);
        return [];
    }
}

export default getSectors;
