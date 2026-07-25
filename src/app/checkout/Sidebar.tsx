import React from 'react';
import styles from './Checkout.module.css';
import { CheckoutData } from './types';

interface SidebarProps {
  data: CheckoutData | null;
}

export default function Sidebar({ data }: SidebarProps) {
  if (!data) return null;

  const totalQuantity = Object.values(data.quantities).reduce((a, b) => a + b, 0);
  const finalPrice = parseFloat(String(data.finalPrice || data.totalPrice)) || 0;

  return (
    <aside className={styles.rightColumn}>
      <h3 className={styles.sidebarTitle}>Order Overview</h3>
      <div className={styles.sidebarMockups} style={{ flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '400px', paddingRight: '0.5rem' }}>
        {data.frontImage && (
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <img src={data.frontImage} alt="Front" style={{ width: '50%', objectFit: 'contain' }} />
            <div style={{ position: 'relative', width: '50%', border: '1px solid #eee', background: '#fcfcfc', overflow: 'hidden', aspectRatio: '500/600' }}>
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundColor: data.shirtColor || '#fff',
                WebkitMaskImage: 'url(/image.png)',
                WebkitMaskSize: 'contain',
                WebkitMaskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskImage: 'url(/image.png)',
                maskSize: 'contain',
                maskPosition: 'center',
                maskRepeat: 'no-repeat'
              }}></div>
              <img src="/image.png" alt="Back Mockup" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
          </div>
        )}
        
        {data.items && data.items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            {data.items.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #eee', padding: '0.5rem', borderRadius: '4px', backgroundColor: '#fafafa' }}>
                <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: '#666' }}>Qty: {item.totalQuantity} | ${(item.price * item.totalQuantity).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.sidebarStats}>
        <div className={styles.sidebarRow}>
          <span>Quantity</span>
          <span>{totalQuantity}</span>
        </div>
        <div className={styles.sidebarRow}>
          <span>Print Colors</span>
          <span>{data.frontColors?.length || 0} front, {data.backColors?.length || 0} back</span>
        </div>
        <div className={styles.sidebarRow}>
          <span>Delivery</span>
          <span>{data.shippingOption === 'super-rush' ? 'July 31' : data.shippingOption === 'rush' ? 'August 4' : 'August 11'}</span>
        </div>
        <div className={styles.sidebarRow} style={{ borderTop: '1px solid #eaeaea', marginTop: '1rem', paddingTop: '1rem' }}>
          <span>Base Shirts</span>
          <span>${data.pricingBreakdown?.basePrice?.toFixed(2) || '0.00'}</span>
        </div>
        <div className={styles.sidebarRow}>
          <span>Text Elements</span>
          <span>${data.pricingBreakdown?.textPrice?.toFixed(2) || '0.00'}</span>
        </div>
        <div className={styles.sidebarRow}>
          <span>Patches / Art</span>
          <span>${data.pricingBreakdown?.patchPrice?.toFixed(2) || '0.00'}</span>
        </div>
        <div className={styles.sidebarRow}>
          <span>Ink Colors</span>
          <span>${data.pricingBreakdown?.colorPrice?.toFixed(2) || '0.00'}</span>
        </div>
        <div className={styles.sidebarRow} style={{ fontWeight: 700, color: '#333', borderTop: '1px solid #eaeaea', marginTop: '0.5rem', paddingTop: '1rem' }}>
          <span>Total Price</span>
          <span>${finalPrice.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
}
