const prisma = require("../config/prisma");

exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        address: true,
      },
    });
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { enabled: enabled },
    });
    // res.json({
    //     message: 'update user status success!',
    //     user: user
    // })
    res.send("update status success!");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role: role },
    });
    res.send("hello change role in controller");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Change role error" });
  }
};

exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;

    const user = await prisma.user.findFirst({
      where: { id: Number(req.user.id) },
    });
    // console.log(user)
    // delete old cart item
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });

    // delete old cart
    await prisma.cart.deleteMany({
      where: {
        orderedById: user.id,
      },
    });

    //prepare product
    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    // find total price
    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0,
    );

    const newCart = await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });
    console.log(newCart);
    res.send("Add cart completed!");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "user cart function error" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json({
      products: cart.products,
      cartTotal: cart.cartTotal,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "get User cart function error" });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
    });
    if (!cart) {
      return res.status(400).json({ message: "No cart!" });
    }

    await prisma.productOnCart.deleteMany({
      where: { cartId: cart.id },
    });
    const result = await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user.id) },
    });
    res.json({
      message: "Cart deleted",
      deletedCount: result.count,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Empty user cart function error" });
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const addressUser = await prisma.user.update({
      where: {
        id: Number(req.user.id),
      },
      data: {
        address: address,
      },
    });
    res.json({
      ok: true,
      message: "Update success",
      addressUpdate: addressUser.address,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Save address function error" });
  }
};

exports.saveOrder = async (req, res) => {
  try {
    // this is real !!!!
    // step 1 Get user Cart
    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: { products: true },
    });

    // check cart empty
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "cart is empty!",
      });
    }

    // check quantity for loop in object
    for (const item of userCart.products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { title: true, quantity: true },
      });

      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
          message: `sorry out of product ${product.title}`,
        });
      }
    }

    // create a new order
    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        orderedBy: {
          connect: {
            id: Number(req.user.id),
          },
        },
        cartTotal: userCart.cartTotal,
      },
    });

    // after save order success
    // 1. delete cart that orderbyId
    // 2.delete ProductOnCart, reduce quantity of product,

    // update product\

    // prepare object to decrease remain quantities and increate sold quantity
    const updateProductObject = userCart.products.map((item) => ({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.count },
        sold: { increment: item.count },
      },
    }));
    console.log(updateProductObject);

    await Promise.all(
      updateProductObject.map((updateproductItem) =>
        prisma.product.update(updateproductItem),
      ),
    );
    await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id),
      },
    });
    res.json({ ok: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Save order function error" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!orders.length === 0) {
      res.status(400).json({ ok: false, message: "No orders" });
    }
    res.json({
      ok: true,
      orders: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "getOrder function error" });
  }
};
