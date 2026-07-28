import { RequestHandler } from "express";
import CartModel from "../models/cart";
import UserModel from "../models/user";
import createHttpError from "http-errors";

interface CreateCartBody {
  userId: string;
}

export const createCart: RequestHandler<
  unknown,
  unknown,
  CreateCartBody,
  unknown
> = async (req, res, next) => {
  const user = req.body.userId;

  try {
    if (!user) {
      throw createHttpError(400, "Cart must have a user associated");
    }

    const existingCart = await CartModel.find({ user: user }).exec();

    if (existingCart.length !== 0) {
      throw createHttpError(400, "User has an existing cart associated");
    }

    const newCart = await CartModel.create({
      user: user,
      product: "",
    }).then(async (newCart) => {
      console.log(newCart._id);
      const linkToUser = await UserModel.updateOne(
        { _id: user },
        {
          cartId: newCart._id,
        }
      );

      console.log(linkToUser);
      res.status(201).json(newCart);
    });
  } catch (error) {
    next(error);
  }
};

interface UpdateCartParams {
  cartId: string;
}

interface UpdateCartBody {
  product: string;
  quantity: number;
  increase: boolean;
}

export const updateCart: RequestHandler<
  UpdateCartParams,
  unknown,
  UpdateCartBody,
  unknown
> = async (req, res, next) => {
  try {
    const productId = req.body.product;
    const quantity = req.body.quantity;
    const increase = req.body.increase;

    const existCart = await CartModel.find({
      _id: req.params.cartId,
    });

    if (existCart.length === 0) {
      throw createHttpError(400, "Cart cannot be found");
    }

    if (!productId || !quantity) {
      throw createHttpError(400, "Please provide productId and quantity");
    }

    const existProduct = await CartModel.find({
      _id: req.params.cartId,
      products: { $elemMatch: { product: productId } },
    });

    if (increase) {
      // INCREASE PRODUCT QUANTITY IN CART
      if (existProduct.length !== 0) {
        const products = existProduct[0].products;
        for (const eachProduct of products) {
          if (String(eachProduct.product) === productId) {
            const oldQuantity = eachProduct.quantity;
            const increaseQty = await CartModel.findOneAndUpdate(
              { _id: req.params.cartId },
              {
                $set: {
                  "products.$[updateProduct].quantity": oldQuantity
                    ? oldQuantity + 1
                    : quantity,
                },
              },
              {
                arrayFilters: [{ "updateProduct.product": productId }],
                returnDocument: "after",
              }
            )
              .populate({ path: "user", select: "username" })
              .populate({
                path: "products.product",
                select: ["title", "price", "image"],
              });

            res.status(200).json(increaseQty);
          }
        }
      }
      // ADD PRODUCT INTO CART
      else {
        const addProduct = await CartModel.findOneAndUpdate(
          { _id: req.params.cartId },
          {
            $push: {
              products: {
                product: productId,
                quantity: quantity,
              },
            },
          },
          { returnDocument: "after" }
        )
          .populate({ path: "user", select: "username" })
          .populate({
            path: "products.product",
            select: ["title", "price", "image"],
          });

        res.status(200).json(addProduct);
      }
    } else {
      if (existProduct.length !== 0) {
        const products = existProduct[0].products;
        for (const eachProduct of products) {
          if (String(eachProduct.product) === productId) {
            const oldQuantity = eachProduct.quantity;
            // REMOVE PRODUCT FROM CART
            if (oldQuantity === 1) {
              const removeProduct = await CartModel.findOneAndUpdate(
                { _id: req.params.cartId },
                {
                  $pull: {
                    products: {
                      product: productId,
                    },
                  },
                },
                {
                  returnDocument: "after",
                }
              )
                .populate({ path: "user", select: "username" })
                .populate({
                  path: "products.product",
                  select: ["title", "price", "image"],
                });

              res.status(200).json(removeProduct);
            }
            // DECREASE PRODUCT QUANTITY IN CART
            else {
              const decreaseQty = await CartModel.findOneAndUpdate(
                { _id: req.params.cartId },
                {
                  $set: {
                    "products.$[updateProduct].quantity": oldQuantity
                      ? oldQuantity - 1
                      : quantity,
                  },
                },
                {
                  arrayFilters: [{ "updateProduct.product": productId }],
                  returnDocument: "after",
                }
              )
                .populate({ path: "user", select: "username" })
                .populate({
                  path: "products.product",
                  select: ["title", "price", "image"],
                });

              res.status(200).json(decreaseQty);
            }
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

interface getCartContentParams {
  userId: string;
}

export const getCartContent: RequestHandler<
  getCartContentParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const cartContent = await CartModel.findOne({ user: req.params.userId })
      .populate({ path: "user", select: "username" })
      .populate({
        path: "products.product",
        select: ["title", "price", "image"],
      })
      .exec();

    if (!cartContent) {
      throw createHttpError(404, "User does not have cart associated");
    }

    res.status(200).json(cartContent);
  } catch (error) {
    next(error);
  }
};

interface RemoveProductInCartParams {
  cartId: string;
}

interface RemoveProductInCart {
  product: string;
}

export const removeProductInCart: RequestHandler<
  RemoveProductInCartParams,
  unknown,
  RemoveProductInCart,
  unknown
> = async (req, res, next) => {
  try {
    const productId = req.body.product;

    if (!productId) {
      throw createHttpError(400, "Please provide id of product to be removed");
    }

    const removeProduct = await CartModel.findOneAndUpdate(
      { _id: req.params.cartId },
      {
        $pull: {
          products: {
            product: productId,
          },
        },
      },
      {
        returnDocument: "after",
      }
    )
      .populate({ path: "user", select: "username" })
      .populate({
        path: "products.product",
        select: ["title", "price", "image"],
      });

    res.status(200).json(removeProduct);
  } catch (error) {
    next(error);
  }
};

interface RemoveAllProductsInCartParams {
  userId: string;
}

export const removeAllProductsInCart: RequestHandler<
  RemoveAllProductsInCartParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const removeProduct = await CartModel.findOneAndUpdate(
      { user: req.params.userId },
      {
        $set: {
          products: [],
        },
      },
      {
        returnDocument: "after",
      }
    )
      .populate({ path: "user", select: "username" })
      .populate({
        path: "products.product",
        select: ["title", "price", "image"],
      });

    res.status(200).json(removeProduct);
  } catch (error) {
    next(error);
  }
};

interface removeCartParams {
  userId: string;
}

export const removeCart: RequestHandler<
  removeCartParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const cart = await CartModel.deleteOne({ user: req.params.userId });

    res.status(200).json("Successfully deleted cart for user");
  } catch (error) {
    next(error);
  }
};
