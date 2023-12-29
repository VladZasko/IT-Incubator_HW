import {app} from "./app";
import {runDb} from "./db/db";
import dotenv from "dotenv";

dotenv.config()
export const port = 3000


app.listen(port, async() => {
    await runDb()
})
