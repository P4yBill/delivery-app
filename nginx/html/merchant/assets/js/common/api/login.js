const LoginApiContainer = {
    /**
     * Retrieves orders from the database.
     * 
     * @param {Object} params 
     * @returns {Array<Object>} orders
     */
    post(params) {
        const configNew = config;
        configNew.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        return HTTP.post('login', params, configNew);
    }
};