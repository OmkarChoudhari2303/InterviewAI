import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {OAuth2Client} from "google-auth-library";

import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
} from "../validations/authValidation.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  generateResetToken,
} from "../utils/tokenUtils.js";

import { getSafeUser } from "../utils/safeUser.js";

import prisma from "../lib/prisma.js";

import transporter from "../utils/sendMail.js";
import { hash } from "crypto";
import { any } from "zod";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    signupSchema.parse(req.body); //validations are done using zod

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }

    //we never store plain text password, instead we store bcrypt hashed passwords for security.
    const hashedPassword = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    res.status(201).json({
      message: "User Created Successfully",
      user: safeUser,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "Invalid Email or Password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      String(password),
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    // jwt stores user identity inside signed token, which then used for protected routes and session verification.
    const accessToken = generateAccessToken(user.id);

    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: hashToken(refreshToken),

        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

        userId: user.id,
      },
    });

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV
          === "production",
        sameSite: "strict",
        maxAge:
          7 * 24 * 60 * 60 * 1000
      }
    )

    res.status(200).json({
      message: "Login Successful",
      accessToken,
      user: getSafeUser(user),
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: {
        token: hashToken(refreshToken),
      },
    });

    if (!storedToken) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    if (storedToken.expiresAt < new Date()) {
      return res.status(403).json({
        message: "Refresh token expired",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    await prisma.refreshToken.deleteMany({
      where:{
        token: hashToken(refreshToken)
      }
    })

    // After every refresh in the website, a refresh token is created , so that stolen refresh token could not be used, incase db is attacked.
    const newAccessToken = generateAccessToken(decoded.id);

    const newRefreshToken = generateRefreshToken(decoded.id)

    await prisma.refreshToken.create({
      data:{
        token: hashToken(newRefreshToken),

        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7days
        userId: decoded.id
      },
    })

    res.cookie(
      "refreshToken",
      newRefreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV
          === "production",
        sameSite: "strict",
        maxAge:
          7 * 24 * 60 * 60 * 1000
      }
    )

    res.status(200).json({
      accessToken: newAccessToken
    })
  } catch (error) {
    console.log(error);

    res.status(403).json({
      message: "Invalid refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: hashToken(refreshToken),
        },
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(200).json({
        message: "If an account exists, a reset link has been sent",
      });
    }

    const resetToken = generateResetToken();

    const hashedResetToken = hashToken(resetToken);

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        token: hashedResetToken,

        expiresAt: new Date(
          Date.now() + 15 * 60 * 1000, //expires in 15 Min
        ),

        userId: user.id,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${encodeURIComponent(resetToken)}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,

        to: user.email,

        subject: "Password Reset",

        html: `<h2>Password Reset</h2>
                <p>Click Below to Reset Password </p>
                <a href="${resetLink}"> Reset Password</a>`,
      });

      res.status(200).json({
        message: "If an account exists, a reset link has been sent",
      });
    } catch (mailError) {
      console.error("Mail sending failed:", mailError);
      res.status(200).json({
        message: "If an account exists, a reset link has been generated",
        resetLink,
      });
    }
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    console.error("Forgot Password Error:", error);

    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = hashToken(token);

    const storedToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: hashedToken,
      },
    });

    if (!storedToken) {
      return res.status(400).json({
        message: "Invalid or Expired Token",
      });
    }

    if (storedToken.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Token Expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: storedToken.userId,
      },

      data: {
        password: hashedPassword,
      },
    });

    await prisma.passwordResetToken.delete({
      //After the token is used delete the token , only one time usage
      where: {
        token: hashedToken,
      },
    });

    res.status(200).json({
      message: "Password Reset Successful",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
)

export const googleLogin = async (req,res) =>{
  try{
    const {credential} = req.body

    if(!credential){
      return res.status(400).json({
        message: "Credetial Missing"
      })
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    const{
      sub,
      email,
      name,
      email_verified
    } = payload

    if(!email_verified){
      return res.status(400).json({
        message: "Google email not verified"
      })
    }

    let user = await prisma.user.findUnique({
      where: {email}
    })

    // creating users if doesnt exists
    if(user){
      //users which logged in using email,pass and now tries to login with google
      if(!user.googleId){
        user = await prisma.user.update({
          where:{
            id: user.id
          },
          data:{
            googleId: sub
          }
        })
      }
    }else{
      //create new google user
      user = await prisma.user.create({
        data:{
          name, 
          email,
          googleId: sub
        }
      })
    }

    const accessToken = generateAccessToken(user.id);

    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data:{
        token: hashToken(refreshToken),

        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ),

        userId: user.id
      }
    })

    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV
          === "production",
        sameSite: "strict",
        maxAge:
          7 * 24 * 60 * 60 * 1000
      }
    )

    res.status(200).json({
      message: "Google Login Successful",

      accessToken,

      user: getSafeUser(user)
    })
  }catch(error){
    console.log(error)

    res.status(500).json({
      message: "Google authentication failed"
    })
  }
}