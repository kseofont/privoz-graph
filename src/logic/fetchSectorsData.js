// src/logic/fetchSectorsData.js
import getSectors from './getSectors'; 
import getPlayers from './getPlayers'; 

const fetchSectorsData = async (client, setSectors, setPlayers) => {
    try {
        const sectorsData = await getSectors(client) || [];
        const playersData = await getPlayers(client) || [];
        if (Array.isArray(sectorsData)) {
            const sectorOrder = ["Fruits", "Dairy", "Fish", "Vegetables", "Meat", "Household", "Illegal"];
            const myMaxValue = 6;

            sectorsData.sort((a, b) => {
                let indexA = sectorOrder.indexOf(a.name);
                let indexB = sectorOrder.indexOf(b.name);

                if (indexA === -1) indexA = myMaxValue;
                if (indexB === -1) indexB = myMaxValue;

                return indexA - indexB;
            });

            // Optionally filter sectors here if necessary
            setSectors(sectorsData);
        } else {
            console.error('Fetched sectors data is not an array:', sectorsData);
        }

        setPlayers(playersData);
    } catch (error) {
        console.error("Error fetching initial data:", error);
        setSectors([]);
        setPlayers([]);
    }
};

export default fetchSectorsData;
