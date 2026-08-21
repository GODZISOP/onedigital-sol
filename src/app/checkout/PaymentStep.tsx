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

function formatPayPalError(err: any): string {
  if (!err) return "Unknown error occurred";
  if (typeof err === 'string') return err;
  
  // Check for PayPal specific details array
  if (err?.data?.details && Array.isArray(err.data.details) && err.data.details.length > 0) {
    const d = err.data.details[0];
    return `${d.issue || ''}: ${d.description || ''}`.trim() || d.issue || err.message;
  }
  if (err?.details && Array.isArray(err.details) && err.details.length > 0) {
    const d = err.details[0];
    return `${d.issue || ''}: ${d.description || ''}`.trim() || d.issue || err.message;
  }
  
  // Specific common PayPal messages
  if (err?.name === "INSTRUMENT_DECLINED" || err?.message?.includes("INSTRUMENT_DECLINED")) {
    return "Card or payment instrument was declined by PayPal / Bank.";
  }
  if (err?.message?.includes("TRANSACTION_REFUSED") || err?.message?.includes("UNPROCESSABLE_ENTITY")) {
    return "Transaction refused by PayPal (Often caused when merchant tries to pay themselves or account has restrictions).";
  }

  return err.message || JSON.stringify(err);
}

export default function PaymentStep({ data, onNext, onBack }: PaymentStepProps) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  const initialOptions = {
    clientId: clientId,
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
          {error && (
            <div style={{ 
              color: '#b91c1c', 
              background: '#fef2f2', 
              border: '1px solid #f87171', 
              padding: '12px 14px', 
              borderRadius: '8px', 
              marginBottom: '1.2rem',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              <strong>⚠️ Payment Error:</strong>
              <div style={{ marginTop: '4px', wordBreak: 'break-word' }}>{error}</div>
            </div>
          )}

          {!clientId && (
            <div style={{ 
              color: '#b45309', 
              background: '#fffbeb', 
              border: '1px solid #fcd34d', 
              padding: '10px 12px', 
              borderRadius: '6px', 
              marginBottom: '1rem',
              fontSize: '0.85rem'
            }}>
              ⚠️ <strong>Warning:</strong> PayPal Client ID is missing. Make sure <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> is configured.
            </div>
          )}

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
          ) : (
            <>
              {isProcessing && (
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>Processing Order...</p>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>Please do not close this window.</p>
                </div>
              )}
              <div style={{ display: isProcessing ? 'none' : 'block' }}>
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(paypalData, actions) => {
                      const payload: any = {
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: totalPrice,
                            },
                          },
                        ],
                      };

                      if (data?.shippingDetails) {
                        const { firstName, lastName, email, address1, address2, city, state, zip } = data.shippingDetails;
                        
                        if (firstName || lastName) {
                          payload.payer = {
                            name: {
                              given_name: firstName || "",
                              surname: lastName || "",
                            }
                          };
                          if (email) {
                            payload.payer.email_address = email;
                          }
                        }

                        if (address1 && city && state && zip) {
                          const addressObj: any = {
                            address_line_1: address1,
                            admin_area_2: city,
                            admin_area_1: state,
                            postal_code: zip,
                            country_code: "US",
                          };
                          if (address2 && address2.trim() !== '') {
                            addressObj.address_line_2 = address2;
                          }

                          payload.purchase_units[0].shipping = {
                            name: {
                              full_name: `${firstName || ''} ${lastName || ''}`.trim(),
                            },
                            address: addressObj,
                          };
                        }
                      }

                      return actions.order.create(payload);
                    }}
                    onApprove={async (paypalData, actions) => {
                      setIsProcessing(true);
                      setError('');
                      try {
                        if (!actions || !actions.order) {
                          throw new Error("PayPal order action unavailable");
                        }

                        const details = await actions.order.capture();
                        console.log("PayPal capture result:", details);

                        if (details.status !== 'COMPLETED') {
                          throw new Error(`Payment not completed. Status: ${details.status}`);
                        }

                        const paymentDetails = { 
                          method: 'PayPal', 
                          id: details.id || paypalData?.orderID, 
                          status: details.status 
                        };
                        const orderPayload = { ...data, paymentDetails, totalPrice };
                        
                        try {
                          await fetch('/api/place-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(orderPayload)
                          });
                        } catch (apiErr) {
                          console.error("Order notification API error (payment already captured):", apiErr);
                        }

                        onNext({ paymentDetails });
                      } catch (err: any) {
                        console.error("PayPal capture error details:", err);
                        const formatted = formatPayPalError(err);
                        setError(`Payment verification failed: ${formatted}`);
                        setIsProcessing(false);
                      }
                    }}
                    onError={async (err: any) => {
                      console.error("PayPal event error details:", err);
                      const formatted = formatPayPalError(err);
                      setError(`PayPal Error: ${formatted}`);
                      setIsProcessing(false);
                    }}
                    onCancel={(cancelData) => {
                      console.log("PayPal payment cancelled:", cancelData);
                      setError("Payment was cancelled.");
                      setIsProcessing(false);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </>
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

