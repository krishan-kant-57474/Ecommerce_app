const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("T3");

  const transporter = nodeMailer.createTransport({
    // host: "smtp.gmail.com",
    host: process.env.SMPT_HOST,
    // port: 465,
    port: process.env.PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    // from: "temp.sharma94@gmail.com",
  });
  // const mailOptions = {
  //   from: process.env.SMPT_MAIL,
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  // };

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
