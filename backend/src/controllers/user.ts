import { RequestHandler } from "express";
import UserModel from "../models/user";
import TokenModel from "../models/token";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

var crypto = require("crypto");
var sendEmail = require("../util/sendEmail");

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    if (!authenticatedUserId) {
      throw createHttpError(401, "User not authenticated");
    }

    const user = await UserModel.findById(authenticatedUserId)
      .select("+email")
      .exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  const username = req.params.username;

  try {
    const user = await UserModel.find({ username: username }).exec();
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface CreateUserBody {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phoneNum: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export const createUser: RequestHandler<
  unknown,
  unknown,
  CreateUserBody,
  unknown
> = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const street = req.body.address.street;
  const phoneNum = req.body.phoneNum;
  const city = req.body.address.city;
  const state = req.body.address.state;
  const zip = req.body.address.zip;

  try {
    if (
      !firstName ||
      !lastName ||
      !username ||
      !password ||
      !email ||
      !street ||
      !phoneNum ||
      !city ||
      !state ||
      !zip
    ) {
      throw createHttpError(400, "Missing parameters!");
    }

    const existUser = await UserModel.findOne({ username: username }).exec();

    if (existUser) {
      throw createHttpError(400, "User already created!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: hashedPassword,
      email: email,
      phoneNum: phoneNum,
      address: {
        street: street,
        city: city,
        state: state,
        zip: zip,
      },
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  })
}

interface GetResetPasswordTokenBody{
  email: string
}

export const getResetPasswordToken: RequestHandler<unknown, unknown, GetResetPasswordTokenBody, unknown> = async (req, res, next) => {
  const email = req.body.email;

  try {

    //check if email exist

    if(!email){
      throw createHttpError(400, "Email is missing")
    }

    const user = await UserModel.findOne({email: email}).select("+_id").exec();


    if(!user){
      throw createHttpError(401, "User not found, please check your email again")
    }

    //input data into the token document
    const newToken = await TokenModel.create({
      userId: user._id,
      email: email,
      token: crypto.randomBytes(32).toString("hex"),
    })

    //send email to user on how to reset their password
    const emailResult = await sendEmail(
      email,
      "Reset your password!",
      `Please use this link to reset your password http://localhost:3000/forgetPassword/resetPassword?uid=${user._id}&token=${newToken.token}`
    )

    console.log("email result: ", emailResult)

    if(!emailResult){
      throw createHttpError(400, "Please try again")
    }

    res.sendStatus(201)


  } catch (error) {
    next(error)
  }
}

interface ResetPasswordBody{
  userId: string,
  newPassword: string,
  token: string,
}

export const resetPassword: RequestHandler<unknown, unknown, ResetPasswordBody, unknown> = async (req, res, next) => {
  const userId = req.body.userId;
  const newPassword = req.body.newPassword;
  const token = req.body.token;

  try {
    
    //check if token exist
    const validToken = await TokenModel.find({token: token}).exec();

    console.log(validToken);

    if(!validToken){
      throw createHttpError(401, "Token is invalid")
    }

    //get user data
    const user = UserModel.findById(userId);

    if(!user){
      throw createHttpError(404, "User not found!")
    }

    //encrypt and update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedPassword = await user.updateOne({password: hashedPassword})

    res.status(200).json({
      userId: userId
    })

  } catch (error) {
    next(error)
  }
}
