const sgMail = require('@sendgrid/mail');

const sendGridApi = process.env.SEND_GRID_KEY;
sgMail.setApiKey(sendGridApi);

const sgVerification = (name, email, code) =>{
    return new Promise((resolve, reject)=>{
        mailContent = {
            to: email,
            from: 'otp@accountsbook.com',
            subject: 'OTP Confirmation',
            text: `Hello ${name},  your PIN reset verification code is : ${code} .`

        };

        sgMail.send(mailContent);
        resolve();
    });

}

module.exports = {
    sgVerification
}
