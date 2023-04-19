const OrderApiContainer = {
    /**
     * Retrieves items from the database.
     * 
     * @param {Object} params 
     * @returns {Array<Object>} items
     */
    create(params) {
        return HTTP.post('order', params, config);
        // console.log(params);
        // return Promise.resolve({
        //     data: {
        //         success: true,
        //         id: "12939asdasd18231"
        //     }
        // });
    },
};