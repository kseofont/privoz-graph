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
          coins
          id
          productCards {
            id
            product {
              buyPrice
              description
              id
              image
              name
              isLegal
              sellPrice
            }
          }
          traders {
            id
          }
          hero {
            color
            id
            image
            name
          }
        }
      }
    }
  }
}
`;

async function getSectors(client) {
  try {
    const { data } = await client.query({ query: GET_SECTOR_DATA });
    //  console.log('data', data);
    const sectors = data.game.sectors.filter(sector => sector.name !== 'Illegal');
    return sectors;
  } catch (error) {
    // Handle error
    console.error('Error while fetching sectors:', error);
    return [];
  }
}

export default getSectors;
