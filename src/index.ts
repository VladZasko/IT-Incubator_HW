import {app} from "./app";
import {runDb} from "./db/db";

export const port = 3000
app.listen(port, async() => {
    await runDb()
})
