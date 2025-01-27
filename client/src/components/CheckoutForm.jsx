import React, { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import '../stripe.css'
import { saveOrder } from "../api/user";
import useEcomStore from "../store/ecom-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm({ dpmCheckerLink }) {

    const navigate = useNavigate()

    const token = useEcomStore(state => state.token)
    const clearCart = useEcomStore(state => state.actionClearCart)

    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const payload = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });

        console.log('payload', payload)
        if (payload.error) {
            setMessage(payload.error.message);
            console.log('error', payload.error.message)
            toast.error(payload.error.message)
        } else if(payload.paymentIntent.status ==="succeeded") {
            console.log('Payment success')
            saveOrder(token,payload)
            .then((res)=>{
                console.log('Order saved successfully')
                console.log(res)
                clearCart() // clear cart after order saved locally
                toast.success('Order saved successfully')
                navigate('/user/history')
            })
            .catch((err)=>{
                console.log(err)                
            })            
        }
        else {
            console.log('Payment failed')
            toast.error('Payment failed')
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "accordion"
    }

    return (
        <>
            <form
                className="space-y-6"
                id="payment-form" onSubmit={handleSubmit}>

                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <button
                    className='stripe-button'
                    disabled={isLoading || !stripe || !elements}
                    id="submit">
                    <span id="button-text">
                        {isLoading ? (
                            <div className="spinner" id="spinner"></div>)
                            : ("Pay now")}
                    </span>
                </button>
                {/* Show any error or success messages */}
                {message && <div id="payment-message">{message}</div>}
            </form>
            {/* [DEV]: Display dynamic payment methods annotation and integration checker */}
            <div id="dpm-annotation">
                <p>
                    {/* Payment methods are dynamically displayed based on customer location, order amount, and currency.&nbsp; */}
                    <a href={dpmCheckerLink} target="_blank" rel="noopener noreferrer" id="dpm-integration-checker">Preview payment methods by transaction</a>
                </p>
            </div>
        </>
    );
}