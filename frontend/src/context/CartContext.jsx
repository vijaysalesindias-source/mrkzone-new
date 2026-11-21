import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartApi, metaApi } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mrkzone_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryPincode, setDeliveryPincode] = useState(() => localStorage.getItem('mrkzone_pincode') || '400072');
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  // Persist guest cart
  useEffect(() => {
    localStorage.setItem('mrkzone_cart', JSON.stringify(items));
  }, [items]);

  // Check delivery for selected pincode
  useEffect(() => {
    if (deliveryPincode && deliveryPincode.length === 6) {
      metaApi.checkDelivery(deliveryPincode, 0)
        .then(res => setDeliveryInfo(res.data))
        .catch(() => {});
    }
  }, [deliveryPincode]);

  const addToCart = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (product.stockQuantity && newQty > product.stockQuantity) {
          error(`Only ${product.stockQuantity} items in stock`);
          return prev;
        }
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, { product, quantity, unitPrice: product.price }];
    });

    success(`Added "${product.title.slice(0, 30)}..." to your cart!`);

    // If authenticated, sync with server
    if (isAuthenticated) {
      cartApi.addToCart(product.id, quantity).catch(() => {});
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id === productId) {
          if (i.product.stockQuantity && quantity > i.product.stockQuantity) {
            error(`Maximum available stock is ${i.product.stockQuantity}`);
            return i;
          }
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    info('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('mrkzone_cart');
    if (isAuthenticated) {
      cartApi.clearCart().catch(() => {});
    }
  };

  const applyCoupon = async (code) => {
    if (!code || !code.trim()) return;
    try {
      const res = await metaApi.validateCoupon(code.trim(), subtotal);
      if (res.data) {
        setAppliedCoupon(res.data);
        success(`Coupon "${res.data.code}" applied! You save ₹${res.data.discountAmount}`);
      }
    } catch (err) {
      error(err.message || 'Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    info('Coupon removed');
  };

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const originalTotal = items.reduce((acc, item) => acc + ((item.product.mrp || item.product.price) * item.quantity), 0);
  const totalSavings = Math.max(0, originalTotal - subtotal);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const isFreeDelivery = subtotal >= 499 || subtotal === 0;
  const shippingFee = isFreeDelivery ? 0 : 40;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        originalTotal,
        totalSavings,
        discountAmount,
        shippingFee,
        isFreeDelivery,
        finalTotal,
        appliedCoupon,
        deliveryPincode,
        deliveryInfo,
        setDeliveryPincode,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
