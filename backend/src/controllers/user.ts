import { RequestHandler } from "express";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

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

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
