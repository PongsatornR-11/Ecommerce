import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { payment } from '../../api/stripe';
import useEcomStore from '../../store/ecom-store';

const stripePromise = loadStripe("pk_test_51QTdPoClpvgManj8Y4YrlTovz7T7WrUXAWbU9jVz84ILzNomfBKd8DZLnUMTK3JRzoqw8RNPXD5jIgHHsoEcuK1n00nUTE9VRU");


const Payment = () => {
    const token = useEcomStore((state) => state.token);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        payment(token)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    return (
        <div>Payment</div>
    )
}

export default Payment