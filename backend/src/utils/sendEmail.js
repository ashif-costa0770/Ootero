import nodemailer from "nodemailer" 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (to, subject, html) => {

    await transporter.sendMail({
      from: `"Ootero" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  };

  export const sendResetEmail = async (toEmail, resetLink) => {
    await transporter.sendMail({
      from: `"Ootero Support" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
  };