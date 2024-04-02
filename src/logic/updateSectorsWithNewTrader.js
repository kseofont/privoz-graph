// Assuming setSectors comes from useState in your component,
// You'll need to pass it along with other parameters to this function.

const updateSectorsWithNewTrader = (newTrader, sectorIdInt, sectors, setSectors) => {
    console.log("Starting updateSectorsWithNewTrader with newTrader:", newTrader);
    console.log("Target sector ID:", sectorIdInt);
    console.log("Current sectors state:", sectors);



    // setSectors(updatedSectors);
    console.log('sectorIdInt', sectorIdInt)
    console.log('sectorssector.id', sectors)
    // Find the index of the sector to be updated
    const sectorIndex = sectors.findIndex(sector => sector.id === sectorIdInt);


    // If the sector is found
    if (sectorIndex !== -1) {
        // Copy the existing sector and add the new trader to its traders array
        const updatedSector = {
            ...sectors[sectorIndex],
            traders: [...sectors[sectorIndex].traders, newTrader]
        };

        // Construct a new array with the updated sector
        const updatedSectors = [
            ...sectors.slice(0, sectorIndex),
            updatedSector,
            ...sectors.slice(sectorIndex + 1)
        ];

        // Update the state with the new sectors array
        setSectors(updatedSectors);
        console.log("Updated sectors:", updatedSectors);
    }
};

export default updateSectorsWithNewTrader;
