import React from 'react';
import { useCart } from '@/context/CartContext';
import styles from './Checkout.module.css';
import { CheckoutData } from './types';

interface SidebarProps {
  data: CheckoutData | null;
}

export default function Sidebar({ data }: SidebarProps) {
  const { items: cartItems } = useCart();
  if (!data) return null;

  const items = cartItems && cartItems.length > 0 ? cartItems : (data.items || []);
  let totalQuantity = 0;
  let baseShirtsPrice = 0;
  const finalPrice = typeof data.finalPrice === 'string' ? parseFloat(data.finalPrice) : (data.finalPrice || 0);

  if (items && items.length > 0) {
    items.forEach((item: any) => {
      totalQuantity += item.totalQuantity || 0;
    });
  }

  if (data.quantities) {
    totalQuantity += Object.values(data.quantities || {}).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0) as number;
  }

  if (data.pricingBreakdown) {
    baseShirtsPrice = data.pricingBreakdown.basePrice || 0;
  } else {
    if (items && items.length > 0) {
      items.forEach((item: any) => {
        baseShirtsPrice += (item.price * item.totalQuantity) || 0;
      });
    }
  }

  const isBase64Image = (str?: string) => typeof str === 'string' && str.startsWith('data:image');
  const customQty: number = data.customQuantities 
    ? (Object.values(data.customQuantities).reduce((a: number, b: any) => a + (parseInt(b as string) || 0), 0) as number)
    : 0;

  const hasCustomDesign = !!(
    isBase64Image(data.frontImage) || 
    isBase64Image(data.backImage) || 
    isBase64Image(data.leftImage) || 
    isBase64Image(data.rightImage) || 
    (customQty > 0 && (isBase64Image(data.frontImage) || data.shirtColor))
  );

  const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <aside className={styles.rightColumn}>
      <h3 className={styles.sidebarTitle}>Order Overview</h3>
      <div className={styles.sidebarMockups} style={{ flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '400px', paddingRight: '0.5rem' }}>
        {hasCustomDesign && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
            {data.frontImage && isBase64Image(data.frontImage) ? (
              <img src={data.frontImage} alt="Front View" style={{ width: '100%', objectFit: 'contain', border: '1px solid #eee', background: '#fcfcfc', borderRadius: '4px' }} />
            ) : null}
            
            {data.backImage && isBase64Image(data.backImage) ? (
              <img src={data.backImage} alt="Back View" style={{ width: '100%', objectFit: 'contain', border: '1px solid #eee', background: '#fcfcfc', borderRadius: '4px' }} />
            ) : null}
            
            {data.leftImage && isBase64Image(data.leftImage) && (
              <img src={data.leftImage} alt="Left View" style={{ width: '100%', objectFit: 'contain', border: '1px solid #eee', background: '#fcfcfc', borderRadius: '4px' }} />
            )}
            {data.rightImage && isBase64Image(data.rightImage) && (
              <img src={data.rightImage} alt="Right View" style={{ width: '100%', objectFit: 'contain', border: '1px solid #eee', background: '#fcfcfc', borderRadius: '4px' }} />
            )}
          </div>
        )}
        
        {items && items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            {items.map((item: any) => (
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
          <span>Order Date</span>
          <span>{currentDate}</span>
        </div>
        <div className={styles.sidebarRow}>
          <span>Quantity</span>
          <span>{totalQuantity}</span>
        </div>
        
        {hasCustomDesign && (
          <div className={styles.sidebarRow}>
            <span>Print Colors</span>
            <span>
              {data.frontColors?.length || 0} front, {data.backColors?.length || 0} back
              {((data.leftColors?.length || 0) > 0 || (data.rightColors?.length || 0) > 0) && (
                <>, {data.leftColors?.length || 0} left, {data.rightColors?.length || 0} right</>
              )}
            </span>
          </div>
        )}

        <div className={styles.sidebarRow}>
          <span>Fulfillment</span>
          <span>In-Store Pickup</span>
        </div>

        <div className={styles.sidebarRow} style={{ borderTop: '1px solid #eaeaea', marginTop: '1rem', paddingTop: '1rem' }}>
          <span>{hasCustomDesign ? 'Base Shirts' : 'Items Total'}</span>
          <span>${baseShirtsPrice.toFixed(2)}</span>
        </div>
        
        {hasCustomDesign && (
          <div className={styles.sidebarRow}>
            <span>Custom Decorations</span>
            <span>${data.pricingBreakdown?.decorationPrice?.toFixed(2) || '0.00'}</span>
          </div>
        )}

        <div className={styles.sidebarRow} style={{ fontWeight: 700, color: '#333', borderTop: '1px solid #eaeaea', marginTop: '0.5rem', paddingTop: '1rem' }}>
          <span>Total Price</span>
          <span>${finalPrice.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
}
