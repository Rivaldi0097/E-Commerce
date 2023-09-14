import { RequestHandler } from "express";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    if(!authenticatedUserId){
      throw createHttpError(401, "User not authenticated")
    }

    const user = await UserModel.findById(authenticatedUserId).select("+email").exec()
    res.status(200).json(user)

  } catch (error) {
    next(error)
  }
}

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
  username?: string,
  password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try{
    if(!username || !password){
      throw createHttpError(400, "Parameters missin")
    }

    const user = await UserModel.findOne({username: username}).select("+password +email").exec();

    if(!user){
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);


    if(!passwordMatch){
      throw createHttpError(401, "Invalid credentials")
    }

    req.session.userId = user._id;
    res.status(201).json(user);

  }catch(error){
    next(error)
  }
}

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy(error => {
    if(error){
      next(error)
    }else{
      res.sendStatus(200)
    }
  })
}