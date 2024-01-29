import {app} from "./app";
import {dbControl} from "./db/db";

app.set('trust proxy', true)
export const port = 3000

const startApp = async () => {
    await dbControl.run()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
// app.listen(port, async() => {
//     await dbControl.run()
// })
