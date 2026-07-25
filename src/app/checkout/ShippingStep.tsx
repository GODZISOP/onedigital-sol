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
    const required = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'phone', 'email'];
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
        <h2 className={styles.pageTitle}>Shipping Information</h2>
        
        <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>Shipping Address</h3>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

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

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Shipping Address *</label>
          <input type="text" name="address1" className={styles.formInput} style={{ maxWidth: '400px', marginBottom: '0.5rem' }} value={formData.address1} onChange={handleChange} placeholder="Line 1" />
          <input type="text" name="address2" className={styles.formInput} style={{ maxWidth: '400px' }} value={formData.address2} onChange={handleChange} placeholder="Line 2 (optional)" />
        </div>

        <div className={styles.formRow} style={{ maxWidth: '400px' }}>
          <div className={styles.formGroup} style={{ flex: 2 }}>
            <label className={styles.formLabel}>City *</label>
            <input type="text" name="city" className={styles.formInput} value={formData.city} onChange={handleChange} />
          </div>
          <div className={styles.formGroup} style={{ flex: 2 }}>
            <label className={styles.formLabel}>State *</label>
            <select name="state" className={styles.formInput} value={formData.state} onChange={handleChange}>
              <option value="">Select...</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
          </div>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label className={styles.formLabel}>Zip Code *</label>
            <input type="text" name="zip" className={styles.formInput} value={formData.zip} onChange={handleChange} />
          </div>
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
