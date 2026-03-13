"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpResendTemp = void 0;
const otpResendTemp = (data) => {
    const logoUrl = process.env.EMAIL_TEMP_IMAGE || 'https://via.placeholder.com/150';
    const displayCode = data.code ?? data.activationCode ?? '000000';
    const displayExpiry = data.expiresIn ?? data.activationCodeExpire ?? '5';
    return `
  <html>
    <head>
      <style>
        body {
          font-family: 'Verdana', 'Arial', sans-serif;
          background-color: #f2f3f8;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }
        h1 {
          text-align: center;
          color: #022C22;
          font-size: 26px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        p {
          color: #555555;
          line-height: 1.8;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .logo {
          text-align: center;
        }
        .logo-img {
          max-width: 150px;
          margin-bottom: 20px;
        }           
        .code {
          text-align: center;
          background-color: #e8f0fe;
          padding: 14px 24px;
          font-size: 24px;
          font-weight: bold;
          color: #022C22;
          border-radius: 6px;
          letter-spacing: 4px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          font-size: 13px;
          color: #9e9e9e;
          text-align: center;
        }
        a {
          color: #022C22;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="${logoUrl}" alt="Logo" class="logo-img" />
        </div>            
        <h1>New OTP</h1>
        <p>Hello, <strong>${data.user}</strong>,</p>
        <p>We're sending you this message because you've requested to receive a new OTP code.</p>
        <p style="text-align: center; margin-bottom: 5px;">Your new code is:</p>
        <div class="code">${displayCode}</div>
        <p>
          This code will be valid for the next <strong>${displayExpiry} minutes</strong>.
        </p>
        <p>
          If you did not request this code, please disregard this message. For assistance, reach out to us.
        </p>
        <p>Thank you,<br>The Parcel Delivery Team</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Parcel Delivery - All Rights Reserved.</p>
        
      </div>
    </body>
  </html>
`;
};
exports.otpResendTemp = otpResendTemp;
//# sourceMappingURL=otp-resend-temp.js.map