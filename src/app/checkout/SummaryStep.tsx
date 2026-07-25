import React, { useState, useEffect } from 'react';
import styles from './Checkout.module.css';
import { CheckoutData } from './types';

interface SummaryStepProps {
  data: CheckoutData | null;
  onNext: (updatedData: Partial<CheckoutData>) => void;
}

export default function SummaryStep({ data, onNext }: SummaryStepProps) {
  const [shippingOption, setShippingOption] = useState<'normal' | 'rush' | 'super-rush'>('normal');
  const [error, setError] = useState('');
  
  const hasCartItems = data?.items && data.items.length > 0;
  const hasCustomDesign = !!data?.frontImage;
  
  // Custom design data is always stored directly on 'data' now
  const legacyData = data;
  
  const [localQuantities, setLocalQuantities] = useState(legacyData?.quantities || { S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 });

  useEffect(() => {
    if (data?.shippingOption) {
      setShippingOption(data.shippingOption);
    }
  }, [data]);

  if (!data) return <div>Loading...</div>;

  const handleQuantityChange = (size: string, value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) && value !== '') return; // numeric validation
    setLocalQuantities(prev => ({
      ...prev,
      [size]: value === '' ? 0 : numericValue
    }));
    setError('');
  };

  // Combine quantities and prices from both Cart items AND Custom Design
  let totalQuantity = 0;
  let basePrice = 0;
  let textCount = 0;
  let patchCount = 0;
  let colorCount = 0;

  if (hasCartItems) {
    totalQuantity += data.items.reduce((sum: number, item: any) => sum + item.totalQuantity, 0);
    basePrice += data.items.reduce((sum: number, item: any) => sum + (item.price * item.totalQuantity), 0);
    textCount += data.items.reduce((sum: number, item: any) => sum + ((item.checkoutData?.pricingBreakdown?.textPrice || 0) / 2.0), 0);
    patchCount += data.items.reduce((sum: number, item: any) => sum + ((item.checkoutData?.pricingBreakdown?.patchPrice || 0) / 3.0), 0);
    colorCount += data.items.reduce((sum: number, item: any) => sum + ((item.checkoutData?.pricingBreakdown?.colorPrice || 0) / 1.5), 0);
  }
  
  if (hasCustomDesign) {
    const customQty = Object.values(localQuantities).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0);
    totalQuantity += customQty;
    basePrice += customQty * 6.99;
    textCount += data?.pricingBreakdown?.textPrice ? (data.pricingBreakdown.textPrice / 2.00) : 0;
    patchCount += data?.pricingBreakdown?.patchPrice ? (data.pricingBreakdown.patchPrice / 3.00) : 0;
    colorCount += data?.pricingBreakdown?.colorPrice ? (data.pricingBreakdown.colorPrice / 1.50) : 0;
  }
  
  const totalItemsPrice = basePrice + (textCount * 2.0) + (patchCount * 3.0) + (colorCount * 1.5);
  
  let finalPrice = totalItemsPrice;
  if (shippingOption === 'rush') finalPrice *= 1.25;
  if (shippingOption === 'super-rush') finalPrice *= 1.50;

  const handleProceed = () => {
    if (totalQuantity <= 0) {
      setError('You must select at least 1 shirt to proceed.');
      return;
    }
    
    const outputData: any = {
      totalPrice: totalItemsPrice.toFixed(2),
      shippingOption,
      finalPrice
    };
    
    const combinedQuantities: any = {};

    if (hasCartItems) {
      outputData.items = data.items;
      data.items.forEach((item: any) => {
        if (item.checkoutData?.quantities) {
           Object.entries(item.checkoutData.quantities).forEach(([size, qty]) => {
             combinedQuantities[size] = (combinedQuantities[size] || 0) + (qty as number);
           });
        }
      });
    }

    if (hasCustomDesign) {
      Object.entries(localQuantities).forEach(([size, qty]) => {
        const numQty = typeof qty === 'string' ? parseInt(qty) : qty;
        if (numQty > 0) {
          combinedQuantities[size] = (combinedQuantities[size] || 0) + numQty;
        }
      });
      // Important to save the explicitly changed localQuantities back to the data structure
      // so the next steps (like Completion) have the custom design sizes
      outputData.customQuantities = localQuantities; 
    } 

    outputData.quantities = Object.keys(combinedQuantities).length > 0 ? combinedQuantities : { M: totalQuantity };

    outputData.pricingBreakdown = { 
      basePrice, 
      textPrice: textCount * 2, 
      patchPrice: patchCount * 3, 
      colorPrice: colorCount * 1.5 
    };
    
    onNext(outputData);
  };

  return (
    <div style={{ width: '100%' }}>
      <h2 className={styles.pageTitle}>Order Summary</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      {hasCustomDesign && (
        <>
          <h3 className={styles.sectionTitle}>Quantity Breakdown</h3>
          <div className={styles.quantityText}>
            Custom T-Shirt — {Object.values(localQuantities).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0)} total
          </div>
          <div className={styles.sizeInputs}>
            {['S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
              <div key={size} className={styles.sizeBox}>
                <label>{size}</label>
                <input 
                  type="number"
                  min="0"
                  value={localQuantities[size as keyof typeof localQuantities] || ''} 
                  onChange={(e) => handleQuantityChange(size, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className={styles.finePrint}>
            The order quantities entered above are final: please double check they are correct before proceeding.
          </div>
        </>
      )}

      <div className={styles.flexRow} style={{ marginTop: '2rem' }}>
        <div className={styles.flexHalf}>
          <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>Review Order</h3>
          
          {hasCartItems && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {data.items.map((item: any) => {
                const sizeEntries = item.checkoutData?.quantities 
                  ? Object.entries(item.checkoutData.quantities).filter(([_, qty]) => (qty as number) > 0) 
                  : [];
                const sizeString = sizeEntries.length > 0 ? sizeEntries.map(([s, q]) => `${s} (Qty: ${q})`).join(', ') : 'Default';

                return (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Size: {sizeString}</p>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Quantity: {item.totalQuantity}</p>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>${(item.price * item.totalQuantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {hasCustomDesign && (
            <>
              {(() => {
                const customQty = Object.values(localQuantities).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0);
                const sizeString = Object.entries(localQuantities)
                  .filter(([_, q]) => (q as number) > 0)
                  .map(([s, q]) => `${s} (Qty: ${q})`)
                  .join(', ');
                const customPrice = (customQty * 6.99) 
                  + (data?.pricingBreakdown?.textPrice || 0) 
                  + (data?.pricingBreakdown?.patchPrice || 0) 
                  + (data?.pricingBreakdown?.colorPrice || 0);

                return (
                  <div style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <img src={data.frontImage} alt="Custom Shirt Design" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>Custom T-Shirt Design</h4>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Size: {sizeString}</p>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Quantity: {customQty}</p>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>${customPrice.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })()}
              <div className={styles.flexRow} style={{ marginTop: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <div className={styles.mockupLabel}>Front: {legacyData?.frontColors?.length || legacyData?.designColors?.length || 0} colors</div>
                  <div style={{ position: 'relative', width: '100%', border: '1px solid #eee', background: '#fcfcfc', aspectRatio: '500/600', overflow: 'hidden' }}>
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      backgroundColor: legacyData?.shirtColor || '#fff',
                      WebkitMaskImage: 'url(/image.png)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      maskImage: 'url(/image.png)',
                      maskSize: 'contain',
                      maskPosition: 'center',
                      maskRepeat: 'no-repeat'
                    }}></div>
                    <img src="/image.png" alt="Front Mockup" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    {legacyData?.frontImage && (
                      <img src={legacyData.frontImage} alt="Custom Design" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'contain', zIndex: 2 }} />
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.mockupLabel}>Back Print Colors: {legacyData?.backColors?.length || 0}</div>
                  <div style={{ position: 'relative', width: '100%', border: '1px solid #eee', background: '#fcfcfc', aspectRatio: '500/600', overflow: 'hidden' }}>
                    <div style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      backgroundColor: legacyData?.shirtColor || '#fff',
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
              </div>
            </>
          )}
        </div>
        
        <div className={styles.flexHalf}>
          <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>Delivery Options</h3>
          
          <label className={styles.radioLabel}>
            <input 
              type="radio" 
              name="delivery" 
              value="normal" 
              checked={shippingOption === 'normal'}
              onChange={() => setShippingOption('normal')} 
            />
            Normal Shipping (Free!)
          </label>
          <div className={styles.deliveryDate}>Guaranteed: August 11</div>
          
          <label className={styles.radioLabel}>
            <input 
              type="radio" 
              name="delivery" 
              value="rush" 
              checked={shippingOption === 'rush'}
              onChange={() => setShippingOption('rush')} 
            />
            Rush Shipping (+25%)
          </label>
          <div className={styles.deliveryDate}>Guaranteed: August 4</div>
          
          <label className={styles.radioLabel}>
            <input 
              type="radio" 
              name="delivery" 
              value="super-rush" 
              checked={shippingOption === 'super-rush'}
              onChange={() => setShippingOption('super-rush')} 
            />
            Super-rush Shipping (+50%)
          </label>
          <div className={styles.deliveryDate}>Guaranteed: July 31</div>
          
          <h3 className={styles.sectionTitle} style={{ marginTop: '3rem' }}>Pricing Breakdown</h3>
          <div style={{ maxWidth: '400px', backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eaeaea' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Base Custom T-Shirts (Qty: {totalQuantity})</span>
              <span>${basePrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Text Elements</span>
              <span>${(textCount * 2.0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Clipart / Patches</span>
              <span>${(patchCount * 3.0).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
              <span>Ink Colors</span>
              <span>${(colorCount * 1.5).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem', color: '#333' }}>
              <span>Total Price</span>
              <span>${totalItemsPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button className={styles.primaryButton} onClick={handleProceed} style={{ marginTop: '2rem' }}>
            Proceed with Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
