import * as nodemailer from 'nodemailer';

const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        service: 'gmail',
        auth: {
            user: 'vungocson12d@gmail.com',
            pass: 'rrfy wced wagi slly', // rrfy wced wagi slly
        }
    })
}

export const sendOtp = async(to: string, otp: string): Promise<void> => {
    console.log("Eamil: ", to)
    console.log("OTP:", otp)
    const transporter = createTransporter();
    await transporter.sendMail({
        from: 'Trekking DSQ <vungocson12d@gmail.com>',
        to,
        subject: 'OTP code for register',
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        html: `<b>Your OTP code is ${otp}</b><br>It is valid for 5 minutes.`
    })
}