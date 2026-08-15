const prisma = require("../config/prisma");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.createPaymentIntent = async (req, res) => {
    try {
        // check user
        const cart = await prisma.cart.findFirst({
            where:{
                orderedById: req.user.id
            }
        })

        if (!cart) {
            return res.status(400).json({ message: "Cart not found!" });
        }

        const amountTHB = Number(cart.cartTotal) * 100
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountTHB,
            currency: "thb",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.log("create payment intent error");
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}
