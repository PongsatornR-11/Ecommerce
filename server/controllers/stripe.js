const prisma = require("../config/prisma");
const stripe = require("stripe")('sk_test_51QTdPoClpvgManj8NWDcSRQ4x73KcAYlK9qH518kmWAUwffaQza5gWMBegBIEQbtsAIVkesWT3KA4t29PHHJP0F800HAF74ixK');


exports.createPaymentIntent = async (req, res) => {
    try {

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 5000,
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
