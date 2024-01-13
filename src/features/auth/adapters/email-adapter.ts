import nodemailer from "nodemailer";
import {UserAuthDBType} from "../../../db/types/users.types";

export const emailAdapter = {
    async sendEmail(data: any) {
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
        const info = await transport.sendMail({
            from: "Vlad Zasko <uladzislauzasko@gmail.com>",
            to: data.email,
            subject: data.subject, // Subject line
            html: data.message, // html body
        });
        return info
    },
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
        const info = await transport.sendMail({
            from: "Vlad Zasko <uladzislauzasko@gmail.com>",
            to: newUser.accountData.email,
            subject: "Confirmation Code", // Subject line
            html: ' <h1>Thanks for your registration</h1>\n' +
                ' <p>To finish registration please follow the link below:\n' +
                `     <a href=\`https://somesite.com/confirm-email?code=${newUser.emailConfirmation?.confirmationCode}\`>complete registration</a>\n` +
                ' </p>', // html body
        });
        return info
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
        const info = await transport.sendMail({
            from: "Vlad Zasko <uladzislauzasko@gmail.com>",
            to: user.accountData.email,
            subject: "Confirmation Code", // Subject line
            html: ' <h1>Thanks for your registration</h1>\n' +
                ' <p>To finish registration please follow the link below:\n' +
                `     <a href=\`https://somesite.com/confirm-email?code=${newCode}\`>complete registration</a>\n` +
                ' </p>', // html body
        });
        return info
    },

}