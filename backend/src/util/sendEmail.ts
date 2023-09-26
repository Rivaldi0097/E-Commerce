const nodemailer = require("nodemailer");

const sendEmail = async (email: string, subject: string, text: string) => {

    //https://dev.to/cyberwolves/how-to-implement-password-reset-via-email-in-node-js-132m
    //https://stackoverflow.com/questions/45478293/username-and-password-not-accepted-when-using-nodemailer
    //generate the password in: security > 2 steps verification > App Passwords

    try{
        const transpoter = nodemailer.createTransport({
            service: 'gmail',
            auth:{
                user: process.env.COMPANY_EMAIL,
                pass: process.env.COMPANY_EMAIL_PASSWORD
            }
        });
    
        await transpoter.sendMail({
            from: process.env.COMPANY_EMAIL,
            to: email,
            subject: subject,
            text: text,
        })

        console.log('email sent successfully')
        return true

    } catch (error) {

        console.log("email error")
        console.log(error)
        return false
    }

}

module.exports = sendEmail;