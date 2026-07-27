'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { dummyProducts } from '@/data/products';
import styles from './Product.module.css';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const product = dummyProducts.find(p => p.id.toString() === unwrappedParams.id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [addName, setAddName] = useState(false);
  const { addToCart } = useCart();

  if (!product) {
    return notFound();
  }

  const finalPrice = product.id === 3 && addName ? product.price + 4 : product.price;

  const handleAddToCart = () => {
    const sizesSelected = { [selectedSize]: quantity };

    addToCart({
      type: 'product',
      productId: product.id,
      name: `${product.name} (Size: ${selectedSize})${addName ? ' + Name on Back' : ''}`,
      price: finalPrice,
      totalQuantity: quantity,
      image: product.image,
      checkoutData: {
        shirtColor: 'White', // Default
        quantities: sizesSelected,
        totalPrice: (finalPrice * quantity).toFixed(2),
        frontImage: product.image,
        designColors: [],
        frontColors: [],
        backColors: [],
        pricingBreakdown: {
          basePrice: finalPrice * quantity,
          textPrice: 0,
          patchPrice: 0,
          colorPrice: 0
        }
      }
    });

    alert(`${quantity} ${product.name} (Size: ${selectedSize}) added to cart!`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> / <Link href="/products">{product.category}</Link> / {product.name}
      </div>
      
      <div className={styles.productWrapper}>
        <div className={styles.imageSection} style={{ overflow: 'hidden' }}>
          <Image 
            src={product.image} 
            alt={product.name} 
            width={500} 
            height={500} 
            style={{ 
              objectFit: 'contain', 
              mixBlendMode: 'multiply',
              transform: 'scale(1.3)',
              transformOrigin: 'center center'
            }}
            priority
          />
        </div>
        
        <div className={styles.detailsSection}>
          <div className={styles.category}>{product.category}</div>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>${product.price.toFixed(2)}</div>
          
          <hr className={styles.divider} />
          
          <p className={styles.description}>
            {product.description}
          </p>
          
          <hr className={styles.divider} />
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#333' }}>SELECT SIZE</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: selectedSize === size ? '2px solid #000' : '1px solid #ccc',
                    backgroundColor: selectedSize === size ? '#000' : '#fff',
                    color: selectedSize === size ? '#fff' : '#000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    borderRadius: '4px'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.actionRow}>
            <input 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className={styles.quantityInput}
            />
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
