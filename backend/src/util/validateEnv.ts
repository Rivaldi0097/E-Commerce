import { cleanEnv, port, str  } from "envalid";

//to check the env variables
export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
});