import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to, verifyLink, recipientName) => {
  await transporter.sendMail({
    from: `"Ootero Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
      </head>
      <body style="margin:0;padding:0;background:#1e293b;font-family:Arial,Helvetica,sans-serif;">
        <div style="background-color:#1e293b;padding:30px 0;box-sizing:border-box;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ededee;">
                  <tr>
                    <td style="padding:0 24px 6px 24px;background:#ededee;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-size:1px;line-height:1px;">&nbsp;</td>
                          <td align="right">
                            <a href="${process.env.CLIENT_URL}" target="_blank" style="display:inline-block;text-decoration:none;">
                              <img src="https://ootero.com/uploads/company/white_logo.png" alt="Ootero" width="126" height="88" style="border:0;width:126px;height:88px;max-width:100%;padding:10px 12px;object-fit:contain;background:#1e293b;display:block;margin-top:0;" />
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 36px 38px;">
                      <h2 style="margin:0;font-size:30px;line-height:40px;font-weight:800;color:#191919;text-align:left;">Dear ${recipientName},</h2>

                      <p style="margin:18px 0 14px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        We're thrilled to have you on board! Before you can access your account, we need to verify your email address.
                      </p>

                      <p style="margin:0 0 24px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        Simply click the button below to confirm your email and start exploring all the great features we have in store for you.
                      </p>

                      <a href="${verifyLink}" target="_blank" style="font-size:13px;font-weight:800;line-height:13px;text-transform:uppercase;color:#f8f8f8;text-decoration:none;background-color:#1e293b;padding:12px 24px;border-radius:999px;display:inline-block;">
                        Verify Your Email
                      </a>

                      <p style="margin:36px 0 20px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        If you didn't sign up for an account, please ignore this email. Your account won't be activated until you verify your email.
                      </p>

                      <p style="margin:0;color:#555555;">Best Regards,</p>
                      <p style="margin-top:2px;margin-bottom:0;font-weight:600;font-size:16px;color:#111827;">Ootero</p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding:28px 50px;background:#000000;">
                            <p style="margin:0;text-align:center;font-size:16px;color:#fff;font-weight:600;">
                              Want updates through more platforms?
                            </p>

                            <table cellpadding="0" cellspacing="0" align="center" style="margin:20px auto 22px auto;">
                              <tr>
                                <td style="padding:0 8px;">
                                  <a href="https://instagram.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://x.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/x/ffffff" alt="X" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://youtube.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/youtube/ffffff" alt="YouTube" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://facebook.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/facebook/ffffff" alt="Facebook" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                              </tr>
                            </table>

                            <p style="margin:0;font-size:14px;color:#fff;text-align:center;font-weight:600;">
                              &copy; ${new Date().getFullYear()} Ootero. All rights reserved.
                            </p>

                            <p style="margin:20px 0 0;font-size:12px;color:#e6e6e6;text-align:center;">
                              <a href="${process.env.CLIENT_URL}/terms" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Terms & Conditions</a> |
                              <a href="${process.env.CLIENT_URL}/privacy" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Privacy Policy</a> |
                              <a href="${process.env.CLIENT_URL}/contact" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Contact Us</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
      `,
  });
};

export const sendResetEmail = async (toEmail, resetLink) => {
  await transporter.sendMail({
    from: `"Ootero Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset Request",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset Request</title>
      </head>
      <body style="margin:0;padding:0;background:#1e293b;font-family:Arial,Helvetica,sans-serif;">
        <div style="background-color:#1e293b;padding:30px 0;box-sizing:border-box;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ededee;">
                  <tr>
                    <td style="padding:0 24px 6px 24px;background:#ededee;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-size:1px;line-height:1px;">&nbsp;</td>
                          <td align="right">
                            <a href="${process.env.CLIENT_URL}" target="_blank" style="display:inline-block;text-decoration:none;">
                              <img src="https://ootero.com/uploads/company/white_logo.png" alt="Ootero" width="126" height="88" style="border:0;width:126px;height:88px;max-width:100%;padding:10px 12px;object-fit:contain;background:#1e293b;display:block;margin-top:0;" />
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 36px 38px;">
                      <h2 style="margin:0;font-size:30px;line-height:40px;font-weight:800;color:#191919;text-align:left;">Password Reset Request</h2>

                      <p style="margin:18px 0 12px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        You requested a password reset for your Ootero account.
                      </p>

                      <p style="margin:0 0 20px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        Click the button below to reset your password. This link expires in <strong>1 hour</strong>.
                      </p>

                      <a href="${resetLink}" target="_blank" style="font-size:13px;font-weight:800;line-height:13px;text-transform:uppercase;color:#f8f8f8;text-decoration:none;background-color:#1e293b;padding:12px 24px;border-radius:999px;display:inline-block;">
                        Reset Password
                      </a>

                      <p style="margin:28px 0 18px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        If you didn't request this, you can safely ignore this email.
                      </p>

                      <p style="margin:0;color:#555555;font-size:16px;line-height:150%;">Best Regards,</p>
                      <p style="margin:2px 0 0 0;font-weight:700;font-size:16px;line-height:18px;color:#111827;">ootero</p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding:28px 50px;background:#000000;">
                            <p style="margin:0;text-align:center;font-size:16px;color:#fff;font-weight:600;">
                              Want updates through more platforms?
                            </p>

                            <table cellpadding="0" cellspacing="0" align="center" style="margin:20px auto 22px auto;">
                              <tr>
                                <td style="padding:0 8px;">
                                  <a href="https://instagram.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://x.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/x/ffffff" alt="X" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://youtube.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/youtube/ffffff" alt="YouTube" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://facebook.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/facebook/ffffff" alt="Facebook" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                              </tr>
                            </table>

                            <p style="margin:0;font-size:14px;color:#fff;text-align:center;font-weight:600;">
                              &copy; ${new Date().getFullYear()} Ootero Auspost. All rights reserved.
                            </p>

                            <p style="margin:20px 0 0;font-size:12px;color:#e6e6e6;text-align:center;">
                              <a href="${process.env.CLIENT_URL}/terms" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Terms-And Conditions</a> |
                              <a href="${process.env.CLIENT_URL}/privacy" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Privacy policy</a> |
                              <a href="${process.env.CLIENT_URL}/contact" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Contact us</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `,
  });
};

export const sendAccountConfirmationEmail = async (to, recipientName) => {
  await transporter.sendMail({
    from: `"Ootero Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Account Confirmation",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Account Confirmation</title>
      </head>
      <body style="margin:0;padding:0;background:#1e293b;font-family:Arial,Helvetica,sans-serif;">
        <div style="background-color:#1e293b;padding:30px 0;box-sizing:border-box;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ededee;">
                  <tr>
                    <td style="padding:0 24px 6px 24px;background:#ededee;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-size:1px;line-height:1px;">&nbsp;</td>
                          <td align="right">
                            <a href="${process.env.CLIENT_URL}" target="_blank" style="display:inline-block;text-decoration:none;">
                              <img src="https://ootero.com/uploads/company/white_logo.png" alt="Ootero" width="126" height="88" style="border:0;width:126px;height:88px;max-width:100%;padding:10px 12px;object-fit:contain;background:#1e293b;display:block;margin-top:0;" />
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 36px 38px;">
                      <h2 style="margin:0;font-size:30px;line-height:40px;font-weight:800;color:#191919;text-align:left;">Dear ${recipientName}</h2>

                      <p style="margin:18px 0 12px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        We just wanted to let you know that your registration at ootero is successfully confirmed and your account is now active.
                      </p>

                      <p style="margin:0 0 12px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        You can login at
                        <a href="${process.env.CLIENT_URL}/login" target="_blank" style="color:#0b5bd3;font-weight:700;text-decoration:underline;">${process.env.CLIENT_URL}/login</a>
                        with the email and password you provided during registration.
                      </p>

                      <p style="margin:0 0 18px 0;font-size:16px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        Please contact us if you need any help.
                      </p>

                      <p style="margin:24px 0 0 0;color:#777777;font-size:16px;line-height:150%;">Kind Regards,</p>
                      <p style="margin:2px 0 0 0;font-weight:700;font-size:16px;line-height:18px;color:#111827;">ootero</p>

                      <p style="margin:24px 0 0 0;font-size:14px;line-height:150%;font-weight:500;color:#2c2c2c;">
                        (This is an automated email, so please don't reply to this email address)
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td align="center">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding:28px 50px;background:#000000;">
                            <p style="margin:0;text-align:center;font-size:16px;color:#fff;font-weight:600;">
                              Want updates through more platforms?
                            </p>

                            <table cellpadding="0" cellspacing="0" align="center" style="margin:20px auto 22px auto;">
                              <tr>
                                <td style="padding:0 8px;">
                                  <a href="https://instagram.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/instagram/ffffff" alt="Instagram" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://x.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/x/ffffff" alt="X" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://youtube.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/youtube/ffffff" alt="YouTube" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                                <td style="padding:0 8px;">
                                  <a href="https://facebook.com" target="_blank">
                                    <img src="https://cdn.simpleicons.org/facebook/ffffff" alt="Facebook" width="20" style="border:0;display:block;" />
                                  </a>
                                </td>
                              </tr>
                            </table>

                            <p style="margin:0;font-size:14px;color:#fff;text-align:center;font-weight:600;">
                              &copy; ${new Date().getFullYear()} Ootero Auspost. All rights reserved.
                            </p>

                            <p style="margin:20px 0 0;font-size:12px;color:#e6e6e6;text-align:center;">
                              <a href="${process.env.CLIENT_URL}/terms" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Terms-And Conditions</a> |
                              <a href="${process.env.CLIENT_URL}/privacy" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Privacy policy</a> |
                              <a href="${process.env.CLIENT_URL}/contact" style="color:#e6e6e6;text-decoration:none;padding:0 4px;">Contact us</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `,
  });
};