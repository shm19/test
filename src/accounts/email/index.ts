// eslint-disable-next-line import/no-import-module-exports
import nodemailer from 'nodemailer';

function createTransport() {
  if (process.env.NODE_ENV === 'production') {
    nodemailer.createTransport({
      //  host: process.env.MAIL_HOST,
      //  port: process.env.MAIL_PORT,
    });
  }
  return nodemailer.createTransport({
    // host: process.env.MAILTRAP_HOST,
    // port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
}

export async function sendEmail(options) {
  const transport = createTransport();
  // eslint-disable-next-line no-param-reassign
  options = {
    ...options,
    from: {
      name: 'PANTOhealth',
      address: process.env.MAIL_FROM,
    },
  };

  try {
    transport.sendMail(options);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

module.exports = sendEmail;
