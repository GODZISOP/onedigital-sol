'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SummaryStep from './SummaryStep';
import InstructionsStep from './InstructionsStep';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import { CheckoutData } from './types';
import styles from './Checkout.module.css';
import { useCart } from '@/context/CartContext';

const STEPS = ['Summary', 'Instructions', 'Shipping', 'Payment'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<any>(null); // State for instructions, shipping, etc.
  const { items } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Only hydrate shipping/instructions state from session storage
    let parsedData: any = {};
    const storedData = sessionStorage.getItem('checkoutState');
    if (storedData) {
      try {
        parsedData = JSON.parse(storedData);
        setData(parsedData);
      } catch (err) {
        console.error('Failed to parse checkout state', err);
      }
    } else {
      setData({});
    }

    const storedStep = sessionStorage.getItem('checkoutStep');
    if (storedStep) {
      let step = parseInt(storedStep, 10) || 0;
      if (step >= 3 && (!parsedData || !parsedData.shippingDetails)) step = 2;
      if (step >= 2 && (!parsedData || typeof parsedData.instructions === 'undefined')) step = 1;
      if (step >= 1 && items.length === 0 && !parsedData?.frontImage) step = 0; // Guard for empty cart
      setCurrentStep(step);
    }
  }, [items.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = (updatedData?: any) => {
    setData((prev: any) => {
      const newData = { ...prev, ...updatedData };
      sessionStorage.setItem('checkoutState', JSON.stringify(newData));
      return newData;
    });
    
    setCurrentStep(prev => {
      const nextStep = Math.min(prev + 1, STEPS.length);
      sessionStorage.setItem('checkoutStep', nextStep.toString());
      return nextStep;
    });
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    sessionStorage.setItem('checkoutStep', index.toString());
  };

  const renderStep = () => {
    // If the cart is empty AND there is no custom design in session storage, block checkout
    if (items.length === 0 && !data?.frontImage && currentStep < 4) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Your cart is empty.</h2>
          <button onClick={() => router.push('/design')} className={styles.primaryButton} style={{ marginTop: '1rem' }}>Start Designing</button>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2>Thank You for Your Order!</h2>
          <p style={{ marginTop: '1rem', color: '#666' }}>Your custom design is being processed.</p>
          <button className={styles.primaryButton} style={{ margin: '2rem auto' }} onClick={() => router.push('/')}>Return Home</button>
        </div>
      );
    }
    
    // We pass both the cart items AND the form data to the steps
    const combinedData = { items, ...data };

    switch (currentStep) {
      case 0:
        return <SummaryStep data={combinedData} onNext={() => handleNext()} />;
      case 1:
        return <InstructionsStep data={combinedData} onNext={(updatedData) => handleNext(updatedData)} />;
      case 2:
        return <ShippingStep data={combinedData} onNext={(updatedData) => handleNext(updatedData)} />;
      case 3:
        return <PaymentStep data={combinedData} onNext={(updatedData) => handleNext(updatedData)} onBack={() => handleStepClick(2)} />;
      default:
        return null;
    }
  };

  if (!data) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading checkout session...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      {currentStep < 4 && (
        <div className={styles.breadcrumb}>
          {STEPS.slice(0, 4).map((step, index) => {
            const isClickable = index < currentStep;
            return (
              <div 
                key={step} 
                className={`${styles.breadcrumbItem} ${index === currentStep ? styles.active : ''} ${isClickable ? styles.clickable : ''}`}
                onClick={() => isClickable && handleStepClick(index)}
              >
                {step}
              </div>
            );
          })}
          <div className={styles.breadcrumbItem}>Completion</div>
        </div>
      )}

      {/* Main Content Area */}
      {renderStep()}
    </div>
  );
}
