import {dataTestUserCreate01} from "../../users/dataForTest/dataTestforUser";

export const dataTestUserAuth = {
    loginOrEmail: dataTestUserCreate01.login,
    password: dataTestUserCreate01.password
}
export const dataTestUserCreate02 = {
    login: 'SecondLog',
    email: 'secondmail@gmail.com',
    password: 'Qazwsx123'
}






export const incorrectUserData = {
    emptyLogin: '',
    tooLongLogin: 'LongLoginLongLogin',
    emptyEmail: '',
    incorrectEmail: 'incorrectemail',
    emptyPassword: '',
    tooLongPassword: 'LongPassword123456789',
    incorrectPassword: '+$*пароль&?'

}