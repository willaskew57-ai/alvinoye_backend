/**
 * Generates the HTML for the Registration Welcome Email.
 */
export const registerEmailTemp = (data) => {
    // Fallback for image to avoid undefined in src attribute
    const logoUrl = process.env.EMAIL_TEMP_IMAGE || 'https://via.placeholder.com/150';
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
          background-color: #ffffff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #022C22;
          font-size: 26px;
          margin-bottom: 20px;
          font-weight: bold;
          text-align: center;
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
          max-width: 150px; /* Constrain logo size for better email display */
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
        .footer p {
          margin: 5px 0;
        }
        a {
          color: #022C22;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="${logoUrl}" alt="Logo" class="logo-img" />
        </div>
        <h1>Welcome to Parcel Delivery</h1>
        <p>Hello, <strong>${data.user}</strong>,</p>
        <p>Thank you for registering with Parcel Delivery. To activate your account, please use the following activation code:</p>
        <div class="code">${data.activationCode}</div>
        <p>Please enter this code on the activation page within the next <strong>${data.activationCodeExpire} minutes</strong>.</p>
        <p>If you have any questions, please contact us at <a href="mailto:arifishtiaque.sparktech@gmail.com">arifishtiaque.sparktech@gmail.com</a>.</p>
        <p>Thank you,<br>The Parcel Delivery Team</p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Parcel Delivery - All Rights Reserved.</p>
      
      </div>
    </body>
  </html>
`;
};
//# sourceMappingURL=register-email-temp.js.map