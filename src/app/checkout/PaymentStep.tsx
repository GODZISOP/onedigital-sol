import React, { useState } from 'react';
import styles from './Checkout.module.css';
import { CheckoutData } from './types';
import Sidebar from './Sidebar';

interface PaymentStepProps {
  data: CheckoutData | null;
  onNext: (data?: Partial<CheckoutData>) => void;
  onBack?: () => void;
}

export default function PaymentStep({ data, onNext, onBack }: PaymentStepProps) {
  const [formData, setFormData] = useState(data?.paymentDetails || {
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleProceed = () => {
    if (!formData.cardNumber || !formData.expiry || !formData.cvc) {
      setError('Please fill in all your payment details.');
      return;
    }

    const cardDigits = formData.cardNumber.replace(/\D/g, '');
    if (cardDigits.length !== 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(formData.expiry)) {
      setError('Please enter a valid expiration date (MM/YY).');
      return;
    }

    const cvcDigits = formData.cvc.replace(/\D/g, '');
    if (cvcDigits.length !== 3 && cvcDigits.length !== 4) {
      setError('Please enter a valid 3 or 4 digit security code.');
      return;
    }

    if (!agreed) {
      setError('You must agree to the terms of use before placing an order.');
      return;
    }
    onNext({ paymentDetails: formData });
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.leftColumn}>
        <h2 className={styles.pageTitle}>Payment</h2>
        
        <div style={{ maxWidth: '400px' }}>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Card number *</label>
            <div className={styles.cardInputWrapper}>
              <input type="text" name="cardNumber" placeholder="1234 1234 1234 1234" value={formData.cardNumber} onChange={handleChange} />
              <div className={styles.cardIcons}>
                <div className={styles.cardIcon} style={{ background: '#ff5f00' }}></div>
                <div className={styles.cardIcon} style={{ background: '#1a1f71' }}></div>
                <div className={styles.cardIcon} style={{ background: '#006fc4' }}></div>
                <div className={styles.cardIcon} style={{ background: '#ff9900' }}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Expiration date *</label>
              <input type="text" name="expiry" className={styles.formInput} placeholder="MM / YY" value={formData.expiry} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Security code *</label>
              <div className={styles.cardInputWrapper}>
                <input type="text" name="cvc" placeholder="CVC" value={formData.cvc} onChange={handleChange} />
                <div style={{ fontSize: '0.8rem', color: '#999', border: '1px solid #ccc', padding: '0 2px', borderRadius: '2px' }}>123</div>
              </div>
            </div>
          </div>

          <div className={styles.termsWarning}>
            Please agree to our printing agreement.
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
            <label className={styles.radioLabel} style={{ display: 'inline-flex', color: '#666' }}>
              <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} /> 
              I have read and agree to terms of use
            </label>
          </div>

          <button className={styles.primaryButton} onClick={handleProceed} style={{ marginLeft: 0 }}>
            Place Order
          </button>
          
          <div className={styles.finePrint} style={{ marginTop: '0.5rem' }}>
            Please allow up to a minute for your order to be processed.
          </div>
        </div>
      </div>

      <Sidebar data={data} />
    </div>
  );
}
