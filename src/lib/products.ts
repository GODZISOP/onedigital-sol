import { supabase } from './supabase';
import { dummyProducts } from '@/data/products';

export interface Product {
  id: number | string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  is_featured?: boolean;
  is_popular?: boolean;
  created_at?: string;
  updated_at?: string;
}

function formatSupabaseError(error: any): string {
  if (!error) return 'Unknown error occurred';
  const msg = error.message || String(error);
  if (msg.includes('Could not find the table') || msg.includes('schema cache') || error.code === '42P01' || error.code === 'PGRST205') {
    return "Supabase Table Missing: The 'products' table does not exist in Supabase yet. Click 'SQL Setup' to run the script.";
  }
  if (msg.includes('permission denied') || error.code === '42501') {
    return "Permission Denied: Run 'GRANT ALL ON TABLE public.products TO anon, authenticated;' in Supabase SQL Editor.";
  }
  if (msg.includes('JSON object requested') || msg.includes('Cannot coerce')) {
    return "Data format notice: Product created or updated successfully.";
  }
  return msg;
}

export async function checkTableExists(): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error && (error.message.includes('Could not find the table') || error.message.includes('schema cache') || error.code === 'PGRST205')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('updated_at', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false }); // Fallback to newest added products first

    if (error || !data) {
      console.warn('Supabase fetch notice:', formatSupabaseError(error));
      return dummyProducts.map(p => ({ ...p, id: `dummy_${p.id}`, is_featured: false, is_popular: false }));
    }

    const supabaseProducts: Product[] = data.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      category: item.category,
      price: Number(item.price),
      image: item.image,
      description: item.description || '',
      sizes: Array.isArray(item.sizes) ? item.sizes : (typeof item.sizes === 'string' ? JSON.parse(item.sizes) : ['S', 'M', 'L', 'XL']),
      is_featured: Boolean(item.is_featured),
      is_popular: Boolean(item.is_popular),
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at
    }));

    // Filter dummy products whose name isn't in Supabase, and assign explicit 'dummy_' prefix
    const existingNames = new Set(supabaseProducts.map(p => p.name.toLowerCase()));
    const remainingDummyProducts: Product[] = dummyProducts
      .filter(dp => !existingNames.has(dp.name.toLowerCase()))
      .map(dp => ({
        ...dp,
        id: `dummy_${dp.id}`,
        is_featured: false,
        is_popular: false
      }));

    return [...supabaseProducts, ...remainingDummyProducts];
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return dummyProducts.map(p => ({ ...p, id: `dummy_${p.id}`, is_featured: false, is_popular: false }));
  }
}

export async function fetchProductById(id: string | number): Promise<Product | null> {
  const targetIdStr = String(id).replace('dummy_', '');
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', targetIdStr);

    const item = Array.isArray(data) ? data[0] : data;

    if (item && !error) {
      return {
        id: String(item.id),
        name: item.name,
        category: item.category,
        price: Number(item.price),
        image: item.image,
        description: item.description || '',
        sizes: Array.isArray(item.sizes) ? item.sizes : ['S', 'M', 'L', 'XL'],
        is_featured: Boolean(item.is_featured),
        is_popular: Boolean(item.is_popular),
        updated_at: item.updated_at
      };
    }
  } catch (err) {
    console.error('Supabase fetchProductById error:', err);
  }

  // Fallback to dummy data
  const fallback = dummyProducts.find(p => String(p.id) === targetIdStr);
  if (fallback) {
    return { ...fallback, id: `dummy_${fallback.id}`, is_featured: false, is_popular: false };
  }
  return null;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          description: product.description,
          sizes: product.sizes,
          is_featured: product.is_featured ?? false,
          is_popular: product.is_popular ?? false,
          updated_at: nowIso
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting product into Supabase:', error);
      return { success: false, error: formatSupabaseError(error) };
    }

    const item = Array.isArray(data) ? data[0] : data;
    if (!item) {
      return { success: false, error: 'Product inserted but no data returned' };
    }

    return {
      success: true,
      data: {
        id: String(item.id),
        name: item.name,
        category: item.category,
        price: Number(item.price),
        image: item.image,
        description: item.description || '',
        sizes: Array.isArray(item.sizes) ? item.sizes : ['S', 'M', 'L', 'XL'],
        is_featured: Boolean(item.is_featured),
        is_popular: Boolean(item.is_popular),
        updated_at: item.updated_at || nowIso
      }
    };
  } catch (err: any) {
    console.error('addProduct exception:', err);
    return { success: false, error: formatSupabaseError(err) };
  }
}

export async function updateProduct(id: string | number, product: Partial<Product>): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    const isDummy = String(id).startsWith('dummy_');
    const targetId = String(id).replace('dummy_', '');
    const nowIso = new Date().toISOString();
    
    // If it's a dummy product that doesn't exist in Supabase yet, insert it as a new product in Supabase!
    if (isDummy) {
      const dummyRef = dummyProducts.find(dp => String(dp.id) === targetId);
      return addProduct({
        name: product.name || dummyRef?.name || 'Product',
        category: product.category || dummyRef?.category || 'T-Shirt',
        price: product.price ?? dummyRef?.price ?? 10,
        image: product.image || dummyRef?.image || '',
        description: product.description || dummyRef?.description || '',
        sizes: product.sizes || dummyRef?.sizes || ['S', 'M', 'L', 'XL'],
        is_featured: product.is_featured ?? false,
        is_popular: product.is_popular ?? false
      });
    }

    const updateData: any = {
      updated_at: nowIso
    };
    if (product.name !== undefined) updateData.name = product.name;
    if (product.category !== undefined) updateData.category = product.category;
    if (product.price !== undefined) updateData.price = product.price;
    if (product.image !== undefined) updateData.image = product.image;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.sizes !== undefined) updateData.sizes = product.sizes;
    if (product.is_featured !== undefined) updateData.is_featured = product.is_featured;
    if (product.is_popular !== undefined) updateData.is_popular = product.is_popular;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', targetId)
      .select();

    if (error) {
      console.error('Error updating product in Supabase:', error);
      return { success: false, error: formatSupabaseError(error) };
    }

    const item = Array.isArray(data) ? data[0] : data;
    if (!item) {
      return { success: false, error: 'Product not found to update' };
    }

    return {
      success: true,
      data: {
        id: String(item.id),
        name: item.name,
        category: item.category,
        price: Number(item.price),
        image: item.image,
        description: item.description || '',
        sizes: Array.isArray(item.sizes) ? item.sizes : ['S', 'M', 'L', 'XL'],
        is_featured: Boolean(item.is_featured),
        is_popular: Boolean(item.is_popular),
        updated_at: item.updated_at || nowIso
      }
    };
  } catch (err: any) {
    console.error('updateProduct exception:', err);
    return { success: false, error: formatSupabaseError(err) };
  }
}

export async function toggleFeaturedProduct(id: string | number, is_featured: boolean): Promise<{ success: boolean; data?: Product; error?: string }> {
  return updateProduct(id, { is_featured });
}

export async function togglePopularProduct(id: string | number, is_popular: boolean): Promise<{ success: boolean; data?: Product; error?: string }> {
  return updateProduct(id, { is_popular });
}

export async function deleteProduct(id: string | number): Promise<{ success: boolean; error?: string }> {
  try {
    const targetId = String(id).replace('dummy_', '');
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', targetId);

    if (error) {
      console.error('Error deleting product from Supabase:', error);
      return { success: false, error: formatSupabaseError(error) };
    }

    return { success: true };
  } catch (err: any) {
    console.error('deleteProduct exception:', err);
    return { success: false, error: formatSupabaseError(err) };
  }
}

export async function seedDummyProductsToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const nowIso = new Date().toISOString();
    const prepared = dummyProducts.map((p, idx) => ({
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image,
      description: p.description,
      sizes: p.sizes,
      is_featured: idx < 3,
      is_popular: idx >= 3 && idx < 9,
      updated_at: nowIso
    }));

    const { data, error } = await supabase
      .from('products')
      .insert(prepared)
      .select();

    if (error) {
      return { success: false, count: 0, error: formatSupabaseError(error) };
    }

    return { success: true, count: data ? data.length : 0 };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message };
  }
}

export async function uploadProductImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.warn('Storage upload error (bucket might not exist), using base64 fallback:', uploadError.message);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.error('uploadProductImage error, using base64 fallback:', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
