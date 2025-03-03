import apiClient from './client'

const endpoint = "/trackings";

const getTrackings = () => apiClient.get(endpoint);

export default {
    getTrackings,
}