'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import styles from './Products.module.css';

// Dummy product data
const dummyProducts = [
  { id: 1, name: 'GILDAN COTTON T-SHIRT', category: 'T-Shirt', sizes: ['S', 'M', 'L', 'XL'], price: 29.00, image: '/featureimage1.png' },
  { id: 2, name: 'HOODED SWEATSHIRT', category: 'Hoodie', sizes: ['M', 'L', 'XL', 'XXL'], price: 39.00, image: '/feature image2.png' },
  { id: 3, name: 'PREMIUM CREWNECK', category: 'T-Shirt', sizes: ['S', 'M', 'L'], price: 25.00, image: '/popularimage1.png' },
  { id: 4, name: 'SPORT PERFORMANCE TEE', category: 'T-Shirt', sizes: ['M', 'L', 'XL', 'XXXL'], price: 35.00, image: '/ppularimage2.png' },
  { id: 5, name: 'CLASSIC ZIP HOODIE', category: 'Hoodie', sizes: ['S', 'L', 'XXL'], price: 45.00, image: '/popularimage3.png' },
  { id: 6, name: 'V-NECK CASUAL', category: 'T-Shirt', sizes: ['S', 'M', 'L'], price: 22.00, image: '/featureimage1.png' },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState('Sort...');

  // Handlers for checkboxes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = dummyProducts;

    // Search filter
    if (searchQuery.trim() !== '') {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
    }

    // Price range filter
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) {
      result = result.filter(p => p.price >= min);
    }
    if (!isNaN(max)) {
      result = result.filter(p => p.price <= max);
    }

    // Sorting
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Name: A-Z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchQuery, selectedCategories, selectedSizes, minPrice, maxPrice, sortBy]);


  return (
    <>
      <Header />
      <main className={styles.container}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Product..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.searchButton}>Search</button>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>PRODUCTS</h3>
            {['Hoodie', 'T-Shirt'].map(cat => (
              <label key={cat} className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                /> {cat}
              </label>
            ))}
          </div>

          <hr className={styles.divider} />

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>SIZES</h3>
            {['L', 'M', 'S', 'XL', 'XXL', 'XXXL'].map(size => (
              <label key={size} className={styles.checkboxLabel}>
                <input 
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                /> {size}
              </label>
            ))}
          </div>

          <hr className={styles.divider} />

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>PRICE RANGE</h3>
            <div className={styles.priceRangeInputs}>
              <div className={styles.priceInputWrapper}>
                <span className={styles.priceSymbol}>$</span>
                <input 
                  type="number" 
                  className={styles.priceInput} 
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className={styles.priceInputWrapper}>
                <span className={styles.priceSymbol}>$</span>
                <input 
                  type="number" 
                  className={styles.priceInput} 
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className={styles.mainContent}>
          <div className={styles.topBar}>
            <select 
              className={styles.sortSelect} 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Sort...</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Name: A-Z</option>
            </select>
          </div>

          <div className={styles.productGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      style={{ objectFit: 'contain', padding: '1rem' }} 
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <h4 className={styles.productName}>{product.name}</h4>
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                No products found matching your filters.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
