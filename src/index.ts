import {app} from "./app";
import {dbControl} from "./db/db";

export const port = 3000
app.listen(port, async() => {
    await dbControl.run()
})
