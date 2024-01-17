import nodemailer from "nodemailer";
import {UserAuthDBType} from "../../../db/types/users.types";

export const emailAdapter = {
    async sendCode(newUser: UserAuthDBType) {
        const transport = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "uladzislauzasko@gmail.com",
                pass: "ryko hyxu ntid aqrf",
            },
        });
        await transport.sendMail({
            from: "Vlad Zasko <uladzislauzasko@gmail.com>",
            to: newUser.accountData.email,
            subject: "Confirmation Code", // Subject line
            html: ' <h1>Thanks for your registration</h1>\n' +
                ' <p>To finish registration please follow the link below:\n' +
                `${newUser.emailConfirmation?.confirmationCode}` +
                `     <a href=\'https://somesite.com/confirm-email?code=${newUser.emailConfirmation?.confirmationCode}\'>complete registration</a>` +
                ' </p>', // html body
        });
        return true
    },
    async sendNewCode(user: UserAuthDBType, newCode: string) {
        const transport = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "uladzislauzasko@gmail.com",
                pass: "ryko hyxu ntid aqrf",
            },
        });
        await transport.sendMail({
            from: "Vlad Zasko <uladzislauzasko@gmail.com>",
            to: user.accountData.email,
            subject: "Confirmation Code", // Subject line
            html: ' <h1>new code</h1>\n' +
                ' <p>new code:\n' +
                `${newCode}` +
                `     <a href=\'https://somesite.com/confirm-email?code=${newCode}\'>complete registration</a>\n` +
                ' </p>', // html body
        });
        return true
    }
}