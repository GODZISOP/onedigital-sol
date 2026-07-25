import React, { useState } from 'react';
import styles from './Checkout.module.css';
import { CheckoutData } from './types';
import Sidebar from './Sidebar';

interface InstructionsStepProps {
  data: CheckoutData | null;
  onNext: (data?: Partial<CheckoutData>) => void;
}

export default function InstructionsStep({ data, onNext }: InstructionsStepProps) {
  const [instructions, setInstructions] = useState(data?.instructions || '');
  const [dimensionsOption, setDimensionsOption] = useState<'default' | 'specify'>('default');
  const [error, setError] = useState('');
  
  const hasCartItems = data?.items && data.items.length > 0;
  const hasCustomDesign = !!data?.frontImage;
  const legacyData = hasCustomDesign ? data : (data?.items?.[0]?.checkoutData || {});
  
  const frontColors = legacyData?.frontColors || legacyData?.designColors || [];
  const backColors = legacyData?.backColors || [];

  const handleProceed = () => {
    if (dimensionsOption === 'specify' && !instructions.trim()) {
      setError('Please provide your specific dimensions in the instructions box below.');
      return;
    }
    onNext({ instructions });
  };

  return (
    <div className={styles.mainContent}>
      <div className={styles.leftColumn}>
        <h2 className={styles.pageTitle}>Design Instructions</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        <h3 className={styles.sectionTitle}>Selected Colors</h3>
        <div className={styles.flexRow}>
          <div className={styles.flexHalf}>
            <div className={styles.mockupLabel}>Front Shirt Color</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: legacyData?.shirtColor || '#fff', border: '1px solid #ddd' }}></div>
              <span style={{ textTransform: 'capitalize' }}>{legacyData?.shirtColor || 'White'}</span>
            </div>
            
            <div className={styles.mockupLabel}>Front Print Colors ({frontColors.length})</div>
            {frontColors.length > 0 ? frontColors.map((color, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: color, border: '1px solid #ddd' }}></div>
                <span>{color}</span>
              </div>
            )) : (
              <div style={{ color: '#666', fontSize: '0.9rem' }}>None</div>
            )}
          </div>
          <div className={styles.flexHalf}>
            <div className={styles.mockupLabel}>Back Shirt Color</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: legacyData?.shirtColor || '#fff', border: '1px solid #ddd' }}></div>
              <span style={{ textTransform: 'capitalize' }}>{legacyData?.shirtColor || 'White'}</span>
            </div>

            <div className={styles.mockupLabel}>Back Print Colors ({backColors.length})</div>
            {backColors.length > 0 ? backColors.map((color, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: color, border: '1px solid #ddd' }}></div>
                <span>{color}</span>
              </div>
            )) : (
              <div style={{ color: '#666', fontSize: '0.9rem' }}>None</div>
            )}
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Design Dimensions</h3>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className={styles.radioLabel}>
            <input type="radio" name="dimensions" checked={dimensionsOption === 'default'} onChange={() => { setDimensionsOption('default'); setError(''); }} />
            Let us decide for you based on standard printing dimensions (?)
          </label>
          <label className={styles.radioLabel}>
            <input type="radio" name="dimensions" checked={dimensionsOption === 'specify'} onChange={() => setDimensionsOption('specify')} />
            Specify dimensions
          </label>
        </div>

        <h3 className={styles.sectionTitle}>Other Instructions</h3>
        <div style={{ marginBottom: '2rem' }}>
          <textarea 
            className={styles.formInput} 
            rows={3} 
            placeholder="Add any additional printing instructions here..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        <button className={styles.primaryButton} onClick={handleProceed} style={{ marginLeft: 0 }}>
          Proceed to Shipping Info
        </button>
      </div>

      <Sidebar data={data} />
    </div>
  );
}
