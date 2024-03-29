// Assuming setSectors comes from useState in your component,
// You'll need to pass it along with other parameters to this function.

const updateSectorsWithNewTrader = (newTrader, sectorIdInt, sectors, setSectors) => {
    console.log("Starting updateSectorsWithNewTrader with newTrader:", newTrader);
    console.log("Target sector ID:", sectorIdInt);
    console.log("Current sectors state:", sectors);

    const targetSectorId = Number(sectorIdInt);
    const updatedSectors = sectors.map((sector) => {
        if (sector.id === targetSectorId) {
            const updatedTraders = [...sector.traders, newTrader.id];
            return { ...sector, traders: updatedTraders };
        }
        return sector;
    });

    setSectors(updatedSectors);
};

export default updateSectorsWithNewTrader;
