

import nodemailer from 'nodemailer'


const nodeMailer = async (email) => {
    
    const transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'privatething789736@gmail.com',
            pass: 'ylpa stve wvnu tsly'
        }
    })

    const otp = Math.floor(Math.random() * 9999)

    const mailOptions = {
        from:  '<privatething789736@gmail.com>',
        to: email,
        subject: 'verification',
        text: `Your four digit otp is here ${otp}`
    }

    transport.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log('Error is sending the mail',err)
        } else {
            console.log('Email is send successfully : ', info)
        }
    })

    return otp


}

export {
    nodeMailer
}