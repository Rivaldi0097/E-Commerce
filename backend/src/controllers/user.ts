import { RequestHandler } from "express";
import UserModel from "../models/user";

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
  const data = req.body;

  try {
    const newUser = await UserModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      password: data.password,
      email: data.email,
      phoneNum: data.phoneNum,
      address: {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        zip: data.address.zip,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
