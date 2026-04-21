import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/respones.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateResetToken, generateToken } from "../utils/token.js";
import { sendAccountConfirmationEmail, sendResetEmail, sendVerificationEmail } from "../utils/sendEmail.js";

//! Register Controller
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      country,
      company,
      shipmentRange,
      captchaToken,
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse(res, 400, "User already exists");
    }

    // Verify captcha
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.GOOGLE_SECRET_KEY}&response=${captchaToken}`,
      },
    );

    const data = await response.json();
    if (!data.success) {
      return errorResponse(res, 400, "Invalid captcha");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔑 Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        country,
        company,
        shipmentRange,
        verificationToken: token,
      },
    });

    // 🔗 Verification link
    // const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const verifyLink = `${process.env.SERVER_URL}/api/auth/verify-email?token=${token}`;

    const recipientName = `${firstName?.trim() || ""} ${lastName?.trim() || ""}`.trim() || "there";

    // 📧 Send branded verification email
    await sendVerificationEmail(email, verifyLink, recipientName);

    return successResponse(
      res,
      201,
      "Registration successful. Please check your email for verification",
    );
  } catch (error) {
    return errorResponse(res, 500, "Error in User Registration", error.message);
  }
};

//! Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired token");
    }

    //update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    const recipientName = `${user.firstName?.trim() || ""} ${user.lastName?.trim() || ""}`.trim() || "there";

    //send account creation email
    await sendAccountConfirmationEmail(user.email, recipientName);


    // redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (error) {
    return errorResponse(res, 500, "Error in verify email", error.message);
  }
};

//! Login Controller

export const login = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;
    

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return errorResponse(res, 400, "Invalid email or password");
    }

    // Verify captcha
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.GOOGLE_SECRET_KEY}&response=${captchaToken}`,
      },
    );

    const data = await response.json();
    console.log(data);
    if (!data.success) {
      return errorResponse(res, 400, "Invalid captcha");
    }

    // Verify email verification
    if (!existingUser.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return errorResponse(res, 400, "Invalid password");
    }

    const token = generateToken(existingUser.id);

    res.cookie("token", token, { httpOnly: true });

    return successResponse(res, 200, "Login successful", {
      id: existingUser.id,
      firstName: existingUser.firstName,
      email: existingUser.email,
      token,
    });
  } catch (error) {
    return errorResponse(res, 500, "Error in User Login", error.message);
  }
};

//! Forgot Password Controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Prevent email enumeration
    if (!user) {
      return res.json({ message: "If email exists, link sent" });
    }

    // Generate reset token
    const { rawToken, tokenHash } = generateResetToken();

    //save token to database
    await prisma.passwordResetToken.create({
      data: {
        token: tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
      },
    });

    // 📧 Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    await sendResetEmail(email, resetLink);

    return successResponse(res, 200, "Reset password link sent to your email");
  } catch (error) {
    return errorResponse(res, 500, "Error in Forgot Password", error.message);
  }
};

//! Reset Password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Hash the raw token from the URL to compare with DB
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find the token in the database
    const record = await prisma.passwordResetToken.findFirst({
      where: {
        token: tokenHash,
        expiresAt: { gt: new Date() }, // not expired
      },
    });

    if (!record) {
      return errorResponse(res, 400, "Invalid or expired reset link");
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atomic transaction — update password + mark token used together
    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: record.userId }
      })
    ]);

    return successResponse(res, 200, "Password reset successful");
  } catch (error) {
    return errorResponse(res, 500, "Error in Reset Password", error.message);
  }
};
