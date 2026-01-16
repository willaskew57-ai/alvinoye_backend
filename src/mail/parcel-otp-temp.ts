// 1. Define the interface for the reset password data
interface IParcelOtpData {
  name: string;
  verificationCode: string;
}

/**
 * Generates the HTML for the Password Reset Email.
 */
export const parcelOtpEmailTemp = (data: IParcelOtpData): string => {
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
          max-width: 150px; /* Constrained for consistent email sizing */
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
        <h1>Password Reset Request</h1>
        <p>Hello, <strong>${data.name}</strong>,</p>
        <p>
          We have received a request to reset your password. Please use the code below to proceed with resetting your password:
        </p>
        <div class="code">${data.verificationCode}</div>
        
        <p>
          If you did not request a password reset, please disregard this email or contact support.
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