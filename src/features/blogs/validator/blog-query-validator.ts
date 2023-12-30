import { query} from "express-validator";


export const pageSizeValidation = query('pageSize').toFloat()
export const pageNumberValidation = query('pageNumber').toFloat()

// export const queryValidation = () => [ pageSizeValidation, pageNumberValidation ]
//
// export const pageSizeValidation2 = query('pageSize').custom(async (v) => {
//         if (v >= 1) {
//             v.toFloat()
//         }
//     })
//
// export const pageNumberValidation2 = query('pageNumber').custom(async (v) => {
//     if (v >= 1) {
//         v.toFloat()
//     }
// })


// export const queryValidation2 = () => [ pageSizeValidation2, pageNumberValidation2 ]