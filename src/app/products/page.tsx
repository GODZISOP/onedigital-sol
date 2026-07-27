'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Products.module.css';

import { dummyProducts } from '@/data/products';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('search') || '';
    }
    return '';
  });
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

  const categories = useMemo(() => Array.from(new Set(dummyProducts.map(p => p.category))), []);
  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    dummyProducts.forEach(p => p.sizes.forEach(s => sizes.add(s)));
    return Array.from(sizes).sort((a, b) => {
      const order = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, []);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    let result = [...dummyProducts];

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
      <main className={styles.container}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.searchContainer} style={{ display: 'flex', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              className={styles.searchInput}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>PRODUCTS</h3>
            {categories.map(cat => (
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
            {allSizes.map(size => (
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
                <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      style={{ objectFit: 'contain', padding: '1rem' }} 
                    />
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productCategory} style={{fontSize: '0.8rem', color: '#666', textTransform: 'uppercase'}}>{product.category}</div>
                    <h4 className={styles.productName}>{product.name}</h4>
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.noResults}>
                No products found matching your filters.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
