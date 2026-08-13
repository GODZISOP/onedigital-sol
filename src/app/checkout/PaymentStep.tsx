import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from './Checkout.module.css';
import { CheckoutData } from './types';
import Sidebar from './Sidebar';

interface PaymentStepProps {
  data: CheckoutData | null;
  onNext: (data?: Partial<CheckoutData>) => void;
  onBack?: () => void;
}

export default function PaymentStep({ data, onNext, onBack }: PaymentStepProps) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
    currency: "USD",
    intent: "capture",
  };

  let rawPrice = parseFloat(String(data?.finalPrice || data?.totalPrice || 0)) || 0;

  if (rawPrice <= 0 && data?.items && data.items.length > 0) {
    data.items.forEach((item: any) => {
      rawPrice += (item.price * item.totalQuantity) || 0;
    });
  }

  const totalPrice = Math.max(0.01, rawPrice).toFixed(2);

  return (
    <div className={styles.mainContent}>
      <div className={styles.leftColumn}>
        <h2 className={styles.pageTitle}>Payment</h2>

        <div style={{ maxWidth: '400px' }}>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          <div className={styles.termsWarning}>
            Please agree to our printing agreement before paying.
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
            <label className={styles.radioLabel} style={{ display: 'inline-flex', color: '#666' }}>
              <input type="checkbox" checked={agreed} disabled={isProcessing} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} />
              I have read and agree to terms of use
            </label>
          </div>

          {rawPrice <= 0 ? (
            <div style={{ color: 'red', fontWeight: 'bold' }}>
              Error: Your cart total is $0. Please go back and add items to your cart.
            </div>
          ) : !agreed ? (
            <button
              className={styles.primaryButton}
              onClick={() => setError('You must agree to the terms of use before placing an order.')}
              style={{ marginLeft: 0, opacity: 0.5, cursor: 'not-allowed' }}
            >
              Please agree to terms to pay
            </button>
          ) : isProcessing ? (
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>Processing Order...</p>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Please do not close this window.</p>
            </div>
          ) : (
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(paypalData, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: totalPrice,
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (paypalData, actions) => {
                  setIsProcessing(true);
                  let details: any = null;
                  if (actions && actions.order) {
                    try {
                      details = await actions.order.capture();
                      console.log("PayPal capture result:", details);
                    } catch (err) {
                      console.warn("PayPal capture fallback:", err);
                    }
                  }

                  const paymentDetails = { 
                    method: 'PayPal', 
                    id: details?.id || paypalData?.orderID || 'PAYPAL-SUCCESS-ID', 
                    status: details?.status || 'COMPLETED' 
                  };
                  const orderPayload = { ...data, paymentDetails, totalPrice };
                  
                  try {
                    await fetch('/api/place-order', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(orderPayload)
                    });
                  } catch (e) {
                    console.error("Email API error:", e);
                  }

                  onNext({ paymentDetails });
                }}
                onError={async (err: any) => {
                  console.error("PayPal event error:", err);
                  setError("Payment was not completed. Please try again.");
                  setIsProcessing(false);
                }}
                onCancel={() => {
                  setError("Payment was cancelled.");
                  setIsProcessing(false);
                }}
              />

            </PayPalScriptProvider>
          )}

          <div className={styles.finePrint} style={{ marginTop: '0.5rem' }}>
            Secure checkout provided by PayPal.
          </div>
        </div>
      </div>

      <Sidebar data={data} />
    </div>
  );
}
