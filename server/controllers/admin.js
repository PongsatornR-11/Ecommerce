const prisma = require("../config/prisma");

exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    // get order id on database
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    // check that order id exist?
    if (!order) {
      return res.status(500).json({ message: "No order Id on record" });
    }

    //update status order
    const orderUpdate = await prisma.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        orderStatus: orderStatus,
      },
    });
    res.json(orderUpdate);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        orderedBy: {
          select: {
            id: true,
            email: true,
            address: true,
          },
        },
      },
    });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
