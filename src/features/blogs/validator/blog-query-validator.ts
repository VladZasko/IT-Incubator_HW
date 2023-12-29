import { query} from "express-validator";


export const pageSizeValidation = query('pageSize').toFloat()
export const pageNumberValidation = query('pageNumber').toFloat()

export const queryValidation = () => [ pageSizeValidation, pageNumberValidation ]

// export const pageSizeValidation2 = query('pageSize').custom(async (value) => {
//         if (value !== null) {
//             value.toFloat()
//             return
//         }
//         return value === 1
//     })
//
// export const pageNumberValidation2 = query('pageNumber').custom(async (value) => {
//     if (value !== null) {
//         value.toFloat()
//         return
//     }
//     return value === 1
// })
//
//
// export const queryValidation2 = () => [ pageSizeValidation2, pageNumberValidation2 ]