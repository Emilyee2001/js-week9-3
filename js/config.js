// base
const apiPath = 'emilyee3';
const baseUrl = 'https://livejs-api.hexschool.io/api/livejs/v1';

// customer
const customerApi = `${baseUrl}/customer/${apiPath}`;
const instance = axios.create({
    baseURL: customerApi,
  });

// admin
const token = 'aJk6WymTnkPkrmZotc0bQfg0tvr1';
const adminApi = `${baseUrl}/admin/${apiPath}`;
const headers = {'authorization': token};

const adminInstance = axios.create({
    baseURL: adminApi,
    headers: headers,
});