// import nodemailer from 'nodemailer';
// import configs from '../configs';

// export const sendEmail = async (to: string, resetLink: string) => {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: configs.node_env === 'production',
//     auth: {
//       // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//       user: 'mostafizurrahaman0401@gmail.com',
//       pass: configs.my_gmail_app_password,
//     },
//   });

//   await transporter.sendMail({
//     from: 'mostafizurrahaman0401@gmail.com', // sender address
//     to, // list of receivers
//     subject: 'Reset Your Password WithIn 10 Minutes!!!', // Subject line
//     text: 'Reset Your Password WithIn 10 Min', // plain text body
//     html: `<!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Password Reset</title>
//         <style>
//             body {
//                 font-family: 'Arial', sans-serif;
//                 margin: 0;
//                 padding: 0;
//                 background-color: #f4f4f4;
//             }
//             .container {
//                 max-width: 600px;
//                 margin: 20px auto;
//                 background-color: #fff;
//                 padding: 20px;
//                 border-radius: 5px;
//                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//             }
//             h2 {
//                 color: #333;
//             }
//             p {
//                 color: #666;
//             }
//             .btn {
//                 display: inline-block;
//                 padding: 10px 20px;
//                 background-color: #007bff;
//                 color: #fff;
//                 text-decoration: none;
//                 border-radius: 5px;
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <h2>Password Reset</h2>
//             <p>Hello,</p>
//             <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
//             <p>To reset your password, click the button below:</p>
//             <a href="${resetLink}" class="btn">Reset Password</a>
//             <p>If the button above does not work, you can also copy and paste the following link into your browser:</p>
//             <p>${resetLink}</p>
//             <p>Thank you!</p>
//         </div>
//     </body>
//     </html>`,
//   });
// };
