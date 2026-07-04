import { createClient } from "redis";

const redisclient = createClient({
    url: "redis://localhost:6379"
});

redisclient.on("error", (err) => {
    console.error(err);
});

await redisclient.connect();

export default redisclient;