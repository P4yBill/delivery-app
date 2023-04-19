const config = {
    baseURL: "http://localhost/",
    // withCredentials: true,
    timeout: 100000,
    responseType: 'json',
    header: {
        'Content-Type': 'application/json',
    },
};

const HTTP = axios.create(config);