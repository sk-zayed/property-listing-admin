import config from "@/config";
import store from "@/store";
import axios from "axios";

const getHistory = async (rera) => {
    // const account = store.getters.account;
    const contract = store.getters.contract;
    return await contract.methods.getHistory(rera).call();
};

const getUsers = async () => {
    const response = await axios.get(`${config.BASE_URL}/api/admin/users`);
    return response.data;
};

const getProperties = async () => {
    const response = await axios.get(`${config.BASE_URL}/api/admin/properties`);
    return response.data;
};

const verifyUser = async (id) => {
    return await axios.patch(`${config.BASE_URL}/api/admin/verify-user/${id}`);
};

const deleteUser = async (id) => {
    return await axios.delete(`${config.BASE_URL}/api/admin/delete-user/${id}`);
};

const verifyProperty = async (id) => {
    return await axios.patch(
        `${config.BASE_URL}/api/admin/verify-property/${id}`
    );
};

const deleteProperty = async (id) => {
    return await axios.delete(
        `${config.BASE_URL}/api/admin/delete-property/${id}`
    );
};

export default {
    getHistory,
    getUsers,
    getProperties,
    verifyUser,
    deleteUser,
    verifyProperty,
    deleteProperty,
};
