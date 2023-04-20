import config from "@/config";
import axios from "axios";

const login = async (credentials) => {
    const response = await axios.post(
        `${config.BASE_URL}/api/auth/login`,
        credentials,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return response.data.data;
};

export default { login };
