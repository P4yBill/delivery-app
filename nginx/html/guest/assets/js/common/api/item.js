const ItemsApiContainer = {
    /**
     * Retrieves items from the database.
     * 
     * @param {Object} params 
     * @returns {Array<Object>} items
     */
    getItems(params) {
        return HTTP.get('item', { params, ...config });
        // return Promise.resolve({
        //     data: {
        //         success: true,
        //         target_currency: 'JPY',
        //         base_currency: 'EUR',
        //         currency_rate: 10,
        //         items: [
        //             {
        //                 id: "aisdauih2u1hhasd",
        //                 title: 'Bolonez',
        //                 description: 'Makaronia me kima 100% mosxari.',
        //                 cost: 8,
        //                 category: '1293as8dasjdu',
        //             }
        //         ]
        //     }
        // });
    },
};