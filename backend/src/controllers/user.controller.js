import prisma from "../lib/prisma.js";
import { errorResponse, successResponse } from "../utils/respones.js";

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
        twoFactorType: true,
        country: true,
        company: true,
        createdAt: true,
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
