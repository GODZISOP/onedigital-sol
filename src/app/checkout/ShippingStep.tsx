import React, { useState } from 'react';
import styles from './Checkout.module.css';
import { CheckoutData } from './types';
import Sidebar from './Sidebar';

interface ShippingStepProps {
  data: CheckoutData | null;
  onNext: (data?: Partial<CheckoutData>) => void;
}

export default function ShippingStep({ data, onNext }: ShippingStepProps) {
  const [formData, setFormData] = useState(data?.shippingDetails || {
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    website: '',
    source: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleProceed = () => {
    const required = ['firstName', 'lastName', 'phone', 'email'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        setError('Please fill in all required fields before proceeding.');
        return;
      }
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validation passed
    onNext({ shippingDetails: formData });
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.leftColumn}>
        <h2 className={styles.pageTitle}>Pickup Information</h2>
        
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          color: '#334155'
        }}>
          <strong>📍 Pickup Location:</strong><br />
          781 Tobermory Rd, Fayetteville, NC 28306<br />
          <br />
          <strong>📞 Phone:</strong> +1 910-865-1070<br />
          
          <div style={{ marginTop: '1rem', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
            <iframe 
              src="https://maps.google.com/maps?q=781+Tobermory+Rd,+Fayetteville,+NC+28306&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="200" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <span style={{ fontSize: '0.9rem', color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
            (You will also receive this information in your order confirmation email)
          </span>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>Who is picking up the order?</h3>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label className={styles.formLabel}>First Name *</label>
            <input type="text" name="firstName" className={styles.formInput} value={formData.firstName} onChange={handleChange} />
          </div>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label className={styles.formLabel}>Last Name *</label>
            <input type="text" name="lastName" className={styles.formInput} value={formData.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Company (optional)</label>
          <input type="text" name="company" className={styles.formInput} style={{ maxWidth: '400px' }} value={formData.company} onChange={handleChange} />
        </div>

        <h3 className={styles.sectionTitle}>Contact Details</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Phone Number *</label>
          <input type="text" name="phone" className={styles.formInput} style={{ maxWidth: '300px' }} value={formData.phone} onChange={handleChange} />
          <div style={{ marginTop: '0.5rem' }}>
            <label className={styles.radioLabel} style={{ display: 'inline-flex' }}>
              <input type="checkbox" /> Get text messages (?)
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Email *</label>
          <input type="email" name="email" className={styles.formInput} style={{ maxWidth: '300px' }} value={formData.email} onChange={handleChange} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Your Website (optional)</label>
          <input type="text" name="website" className={styles.formInput} style={{ maxWidth: '300px' }} value={formData.website} onChange={handleChange} />
        </div>

        <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
          <label className={styles.formLabel}>How did you hear about us?</label>
          <select name="source" className={styles.formInput} style={{ maxWidth: '300px' }} value={formData.source} onChange={handleChange}>
            <option value="">Select...</option>
            <option value="social">Facebook/Instagram</option>
            <option value="search">Google Search</option>
            <option value="friend">Friend/Family</option>
          </select>
        </div>

        <button className={styles.primaryButton} onClick={handleProceed} style={{ marginLeft: 0 }}>
          Proceed to Payment
        </button>
      </div>

      <Sidebar data={data} />
    </div>
  );
}
