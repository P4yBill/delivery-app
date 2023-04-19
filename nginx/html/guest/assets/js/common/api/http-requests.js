const config = {
    baseURL: "http://localhost/api/v1/",
    // withCredentials: true,
    timeout: 100000,
    responseType: 'json',
    header: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost'
    },
};

const HTTP = axios.create(config);