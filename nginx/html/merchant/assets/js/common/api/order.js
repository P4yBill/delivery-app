const OrderApiContainer = {
    /**
     * Retrieves orders from the database.
     * 
     * @param {Object} params 
     * @returns {Array<Object>} orders
     */
    get(params) {
        configNew = { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } };
        // return axios({ method: 'get', url: config.baseURL + 'api/v1/order', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        return HTTP.get('api/v1/order', configNew);
    },
};