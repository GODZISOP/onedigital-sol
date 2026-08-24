import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Checkout.module.css';
import { CheckoutData } from './types';

interface SummaryStepProps {
  data: CheckoutData | null;
  onNext: (updatedData: Partial<CheckoutData>) => void;
  onUpdate?: (updatedData: any) => void;
}

export default function SummaryStep({ data, onNext, onUpdate }: SummaryStepProps) {
  const { items, removeFromCart } = useCart();
  const [shippingOption, setShippingOption] = useState<'pickup' | 'normal' | 'rush' | 'super-rush'>('pickup');
  const [error, setError] = useState('');
  
  const hasCartItems = items && items.length > 0;
  
  // Custom design data is always stored directly on 'data' now
  const legacyData = data;
  
  const [localQuantities, setLocalQuantities] = useState(legacyData?.quantities || { S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 });

  const customQty = Object.values(localQuantities).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0);
  const hasCustomDesign = (!!(
    data?.frontImage || 
    data?.backImage || 
    data?.leftImage || 
    data?.rightImage
  ) || customQty > 0) && customQty > 0;

  useEffect(() => {
    if (data?.shippingOption) {
      setShippingOption(data.shippingOption);
    }
  }, [data]);

  useEffect(() => {
    if (data?.quantities) {
      setLocalQuantities(data.quantities);
    }
  }, [data?.quantities]);

  const handleRemoveCartItem = (itemId: string) => {
    removeFromCart(itemId);
    const stored = sessionStorage.getItem('checkoutState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        delete parsed.items;
        sessionStorage.setItem('checkoutState', JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRemoveCustomDesign = () => {
    const zeroQuantities = { S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 };
    setLocalQuantities(zeroQuantities);

    // Clear session and local storage for custom design
    sessionStorage.removeItem('designerCanvasStates');
    sessionStorage.removeItem('designerShirtColor');
    sessionStorage.removeItem('designerCanvasData');
    sessionStorage.removeItem('designerCurrentView');
    localStorage.removeItem('customDesignData');

    const stored = sessionStorage.getItem('checkoutState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        delete parsed.frontImage;
        delete parsed.backImage;
        delete parsed.leftImage;
        delete parsed.rightImage;
        delete parsed.quantities;
        delete parsed.customQuantities;
        delete parsed.pricingBreakdown;
        sessionStorage.setItem('checkoutState', JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }
    }

    if (onUpdate) {
      onUpdate({
        frontImage: '',
        backImage: '',
        leftImage: '',
        rightImage: '',
        quantities: zeroQuantities,
        customQuantities: zeroQuantities,
        pricingBreakdown: { basePrice: 0, decorationPrice: 0 }
      });
    }
  };

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

  let decorationTotal = 0;

  if (hasCartItems) {
    totalQuantity += items.reduce((sum: number, item: any) => sum + item.totalQuantity, 0);
    basePrice += items.reduce((sum: number, item: any) => sum + (item.price * item.totalQuantity), 0);
    decorationTotal += items.reduce((sum: number, item: any) => sum + (item.checkoutData?.pricingBreakdown?.decorationPrice || 0), 0);
  }
  
  if (hasCustomDesign) {
    const customQty = Object.values(localQuantities).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0);
    totalQuantity += customQty;
    basePrice += customQty * 6.98;
    
    // Divide total decoration price by original quantity to get per-shirt decoration price, then multiply by new customQty
    const originalQty = data.quantities 
      ? (Object.values(data.quantities).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0) || 1)
      : 1;
    const decorationPricePerShirt = (data.pricingBreakdown?.decorationPrice || 0) / originalQty;
    decorationTotal += decorationPricePerShirt * customQty;
  }
  
  const totalItemsPrice = basePrice + decorationTotal;
  const finalPrice = totalItemsPrice;

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
      outputData.items = items;
      items.forEach((item: any) => {
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
      decorationPrice: decorationTotal,
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
              {items.map((item: any) => {
                const sizeEntries = item.checkoutData?.quantities 
                  ? Object.entries(item.checkoutData.quantities).filter(([_, qty]) => (qty as number) > 0) 
                  : [];
                const sizeString = sizeEntries.length > 0 ? sizeEntries.map(([s, q]) => `${s} (Qty: ${q})`).join(', ') : 'Default';

                return (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h4>
                        <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Size: {sizeString}</p>
                        <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Quantity: {item.totalQuantity}</p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>${(item.price * item.totalQuantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => handleRemoveCartItem(item.id)}
                      title="Remove item"
                      style={{
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '0.6rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        marginLeft: '1rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fca5a5';
                        e.currentTarget.style.color = '#b91c1c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.color = '#dc2626';
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
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
                const customPrice = (customQty * 6.98) 
                  + (data?.pricingBreakdown?.decorationPrice || 0);

                 return (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: '80px', height: '80px', border: '1px solid #ddd', background: '#fcfcfc', overflow: 'hidden', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {legacyData?.frontImage || legacyData?.backImage ? (
                          <img src={legacyData.frontImage || legacyData.backImage} alt="Custom Shirt" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <>
                            <div style={{ position: 'absolute', inset: 0, backgroundColor: legacyData?.shirtColor || '#fff', WebkitMaskImage: 'url(/templates/shirt-front.png)', WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat', maskImage: 'url(/templates/shirt-front.png)', maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat' }}></div>
                            <img src="/templates/shirt-front.png" alt="Custom Shirt" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                          </>
                        )}
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Custom T-Shirt Design</h4>
                        <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Size: {sizeString}</p>
                        <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Quantity: {customQty}</p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>${customPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={handleRemoveCustomDesign}
                      title="Remove custom design"
                      style={{
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '0.6rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        marginLeft: '1rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fca5a5';
                        e.currentTarget.style.color = '#b91c1c';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.color = '#dc2626';
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })()}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                <div>
                  <div className={styles.mockupLabel}>Front Design Preview</div>
                  <div style={{ position: 'relative', width: '100%', border: '1px solid #eee', background: '#fcfcfc', aspectRatio: '500/600', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: legacyData?.shirtColor || '#fff', WebkitMaskImage: "url('/templates/shirt-front.png')", WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat', maskImage: "url('/templates/shirt-front.png')", maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat' }}></div>
                    <img src="/templates/shirt-front.png" alt="Front Mockup" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    {legacyData?.frontImage && (
                      <img src={legacyData.frontImage} alt="Custom Front" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'contain', zIndex: 2 }} />
                    )}
                  </div>
                </div>
                <div>
                  <div className={styles.mockupLabel}>Back Design Preview</div>
                  <div style={{ position: 'relative', width: '100%', border: '1px solid #eee', background: '#fcfcfc', aspectRatio: '500/600', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: legacyData?.shirtColor || '#fff', WebkitMaskImage: "url('/templates/shirt-back.png')", WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat', maskImage: "url('/templates/shirt-back.png')", maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat' }}></div>
                    <img src="/templates/shirt-back.png" alt="Back Mockup" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    {legacyData?.backImage && (
                      <img src={legacyData.backImage} alt="Custom Back" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'contain', zIndex: 2 }} />
                    )}
                  </div>
                </div>
                <div>
                  <div className={styles.mockupLabel}>Left Sleeve Preview</div>
                  <div style={{ position: 'relative', width: '100%', border: '1px solid #eee', background: '#fcfcfc', aspectRatio: '500/600', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: legacyData?.shirtColor || '#fff', WebkitMaskImage: "url('/templates/shirt-left.png')", WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat', maskImage: "url('/templates/shirt-left.png')", maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat' }}></div>
                    <img src="/templates/shirt-left.png" alt="Left Mockup" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    {legacyData?.leftImage && (
                      <img src={legacyData.leftImage} alt="Custom Left" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'contain', zIndex: 2 }} />
                    )}
                  </div>
                </div>
                <div>
                  <div className={styles.mockupLabel}>Right Sleeve Preview</div>
                  <div style={{ position: 'relative', width: '100%', border: '1px solid #eee', background: '#fcfcfc', aspectRatio: '500/600', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: legacyData?.shirtColor || '#fff', WebkitMaskImage: "url('/templates/shirt-right.png')", WebkitMaskSize: 'contain', WebkitMaskPosition: 'center', WebkitMaskRepeat: 'no-repeat', maskImage: "url('/templates/shirt-right.png')", maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat' }}></div>
                    <img src="/templates/shirt-right.png" alt="Right Mockup" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    {legacyData?.rightImage && (
                      <img src={legacyData.rightImage} alt="Custom Right" style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'contain', zIndex: 2 }} />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className={styles.flexHalf}>
          <div className={styles.sidebar}>
            <h3>Order Fulfillment</h3>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                <span>📍 In-Store Pickup</span>
              </div>
              <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>
                781 Tobermory Rd, Fayetteville, NC 28306
              </p>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
                Est. Ready: 3 - 5 business days
              </div>
            </div>

            <h3 style={{ marginTop: '2rem' }}>Pricing Breakdown</h3>
            <div className={styles.pricingBox}>
              <div className={styles.pricingRow}>
                <span>Base Custom T-Shirts (Qty: {totalQuantity})</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              <div className={styles.pricingRow}>
                <span>Custom Decorations</span>
                <span>${decorationTotal.toFixed(2)}</span>
              </div>
              <div className={styles.pricingRow} style={{ borderTop: '1px solid #ddd', marginTop: '1rem', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total Price</span>
                <span>${finalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button className={styles.primaryButton} onClick={handleProceed} style={{ marginTop: '2rem', width: '100%' }}>PROCEED WITH CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
}
