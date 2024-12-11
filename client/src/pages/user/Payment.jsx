import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { payment } from '../../api/stripe';
import useEcomStore from '../../store/ecom-store';
import CheckoutForm from '../../components/CheckoutForm';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);


const Payment = () => {
    const token = useEcomStore((state) => state.token);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        payment(token)
            .then((res) => {
                setClientSecret(res.data.clientSecret)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const appearance = {
        theme: 'stripe',
    };
    // Enable the skeleton loader UT for optimal loading.
    const loader = 'auto'

    return (
        <div>
            {clientSecret && (
                <Elements options={{ clientSecret, appearance, loader }} stripe={stripePromise}>
                    <CheckoutForm/>
                </Elements>
            )}
        </div>
    )
}

export default Payment