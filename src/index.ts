import {app} from "./app";
import {dbControl} from "./db/db";

app.set('trust proxy', true)
export const port = 3000
app.listen(port, async() => {
    await dbControl.run()
})
