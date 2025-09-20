import React, { useEffect, useState } from 'react';
import type { Plan } from '../types';

interface PaymentProps {
    plan: Plan;
    onPaymentSuccess: (response: any) => void;
    onPaymentFailure: () => void;
}

// In a real application, declare the Razorpay type
declare const Razorpay: any;

export const Payment: React.FC<PaymentProps> = ({ plan, onPaymentSuccess, onPaymentFailure }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setError('');

        const options = {
            // IMPORTANT: Replace with your actual Razorpay Key ID, preferably from environment variables
            key: 'rzp_test_XXXXXXXXXXXXXX', 
            amount: plan.price, 
            currency: "INR", // Or your desired currency
            name: "HireX AI",
            description: `Purchase ${plan.name} Plan`,
            // In a real app, you would get this from your user object
            prefill: {
                name: "Alex Doe", 
                email: "alex.doe@example.com",
                contact: "9999999999"
            },
            notes: {
                plan_id: plan.id
            },
            theme: {
                color: "#299fff"
            },
            handler: function (response: any) {
                // This function is called on successful payment
                onPaymentSuccess(response);
            },
            modal: {
                ondismiss: function() {
                    // This function is called when the user closes the modal
                    onPaymentFailure();
                }
            }
        };

        // A mock check for the placeholder key. In a real app, you'd check if the key is loaded from env.
        if (options.key === 'rzp_test_XXXXXXXXXXXXXX') {
            setError('Razorpay is not configured. Please replace the placeholder API key.');
            setIsLoading(false);
            return;
        }

        try {
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response: any){
                console.error(response.error);
                onPaymentFailure();
            });
            rzp.open();
            setIsLoading(false);
        } catch(e) {
            console.error("Razorpay initialization error:", e);
            setError("Could not initiate the payment process. Please try again later.");
            setIsLoading(false);
        }

    }, [plan, onPaymentSuccess, onPaymentFailure]);

    return (
        <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 text-center mt-16 animate-fade-in">
             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
                {isLoading && (
                     <>
                        <svg className="animate-spin mx-auto h-8 w-8 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Initializing Secure Payment...</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we redirect you to the payment gateway.</p>
                     </>
                )}
                 {error && (
                     <>
                        <h1 className="text-xl font-bold text-red-600 dark:text-red-400">Payment Error</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{error}</p>
                        <button onClick={onPaymentFailure} className="mt-6 bg-primary-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700">
                           Go Back
                        </button>
                    </>
                 )}
            </div>
        </div>
    );
};