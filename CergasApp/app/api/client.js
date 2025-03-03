import { create } from 'apisauce';

const apiClient = create({
    baseURL: "http://10.204.52.164:9000/api",
    port: 9000
})

export default apiClient;