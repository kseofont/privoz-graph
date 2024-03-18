const addTrader = async (selectedSectorId, currentPlayerObject, setError, setSectors, sectors, setProduct, product) => {
  try {
    // Assuming currentPlayerObject has a property `productCards` which is an array
    const updatedSectors = sectors.map(sector => {
      // Check if the sector id matches the selected sector id
      if (sector.id === selectedSectorId) {
        // Assuming sector has a property `traders` which is an array
        const updatedTraders = [
          ...sector.traders,
          {
            id: currentPlayerObject.id, // Assuming you want to add player id as trader id
            player: currentPlayerObject
          }
        ];

        // Check if currentPlayerObject has productCards
        if (currentPlayerObject.productCards) {
          // Update sector productCards based on currentPlayerObject's productCards
          sector.productCards = currentPlayerObject.productCards.filter(productCard =>
            productCard.sector.id === sector.id
          );
        }

        // Filter product cards of the currentPlayerObject that have the same sector ID as the selected sector
        const filteredProductCards = currentPlayerObject.productCards.filter(card => card.sector.id === selectedSectorId);

        // Update the product state with the filtered product cards
        setProduct([...product, ...filteredProductCards]);

        return { ...sector, traders: updatedTraders };
      }
      console.log('sector', sector)
      return sector;
    });
    console.log('secto1', sector)

    // Update the sectors state with the updated sectors
    setSectors(updatedSectors);
  } catch (error) {
    setError(error.message);
  }
};
