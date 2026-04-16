import prisma from "../lib/prisma.js";
import { successResponse, errorResponse } from "../utils/respones.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../utils/token.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { error } from "console";

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
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse(res, 400, "User already exists");
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

    // 📧 Send email
    await sendVerificationEmail(
      email,
      "Verify Your Email",
      `<p>Click below to verify your email:</p>
         <a href="${verifyLink}">Verify Email</a>`,
    );

    return successResponse(
      res,
      201,
      "Verification email sent. Please check your inbox",
    );
  } catch (error) {
    return errorResponse(res, 500, "Error in User Registration", error.message);
  }
};

//! Verify email
export const verifyEmail = async (req, res) => {
  try {
    console.log("Inside verify email controller");
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

    // redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
  } catch (error) {
    return errorResponse(res, 500, "Error in verify email", error.message);
  }
};

//! Login Controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return errorResponse(res, 400, "User not found");
    }

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
