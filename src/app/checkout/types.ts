export interface CheckoutData {
  items?: any[];
  quantities: {
    S: number;
    M: number;
    L: number;
    XL: number;
    '2XL': number;
    '3XL': number;
  };
  shirtColor: string;
  pricePerShirt: number;
  totalPrice: number;
  frontImage: string;
  backImage?: string;
  leftImage?: string;
  rightImage?: string;
  shippingOption?: 'normal' | 'rush' | 'super-rush';
  shippingCost?: number;
  finalPrice?: number;
  designColors: string[];
  frontColors?: string[];
  backColors?: string[];
  leftColors?: string[];
  rightColors?: string[];
  instructions?: string;
  shippingDetails?: any;
  paymentDetails?: any;
  pricingBreakdown?: {
    basePrice: number;
    decorationPrice: number;
  };
}
