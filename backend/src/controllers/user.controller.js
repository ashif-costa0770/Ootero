import prisma from "../lib/prisma.js";
import { errorResponse, successResponse } from "../utils/respones.js";
import bcrypt from "bcrypt";


//! Get User Profile based on id
export const getUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    //validate userId
    if (isNaN(userId)) {
      return errorResponse(res, 400, "Invalid User ID");
    }

    //find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        profileImage: true,
        direction: true,
        facebook: true,
        linkedIn: true,
        skype: true,
        emailSignature: true,
        twoFactorType: true,
        country: true,
        company: true,
        createdAt: true,
        lastPasswordChange: true,
      },
    });

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, "User profile fetched successfully", user);
  } catch (error) {
    return errorResponse(res, 500, "Error in Get User Profile", error.message);
  }
};

//! Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const imageUrl = req.file?.path;

    //validate userId
    if (isNaN(userId)) {
      return errorResponse(res, 400, "Invalid User ID");
    }

    //find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    //update the user
    const data = {
      ...req.body,
    };

    // Only update profile image when a new file is uploaded.
    if (imageUrl) {
      data.profileImage = imageUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return successResponse(
      res,
      200,
      "User profile updated successfully",
      updatedUser,
    );
  } catch (error) {
    return errorResponse(
      res,
      500,
      "Error in Update User Profile",
      error.message,
    );
  }
};

//! Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { currentPassword, newPassword } = req.body;

    //validate userId
    if (isNaN(userId)) {
      return errorResponse(res, 400, "Invalid User ID");
    }

    //find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    //verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return errorResponse(res, 400, "Invalid current password");
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update password
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, lastPasswordChange: new Date() },
    });

    return successResponse(res, 200, "Password changed successfully", {
      lastPasswordChange: updatedUser.lastPasswordChange,
    });
  } catch (error) {
    return errorResponse(res, 500, "Error in Change Password", error.message);
  }
};
