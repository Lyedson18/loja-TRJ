import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from './utils/cartService';
import { logAction, LogActions } from './utils/logger';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // 🔥 Sempre que cartItems mudar, salvar automaticamente no localStorage
  useEffect(() => {
    if (cartItems.length > 0 || useLocalStorage) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, useLocalStorage]);

  // Carregar carrinho do Supabase ou LocalStorage
  useEffect(() => {
    loadCartFromSupabase();
  }, []);

  const loadCartFromSupabase = async () => {
    try {
      setLoading(true);
      
      if (cartService && typeof cartService.getCart === 'function') {
        const { data, error } = await cartService.getCart();
        
        if (error) {
          console.error('Erro ao carregar carrinho do Supabase, usando localStorage:', error);
          loadFromLocalStorage();
        } else if (data) {
          const formattedItems = data.map(item => ({
            id: item.product_2v.id,
            title: item.product_2v.title,
            description: item.product_2v.description,
            price: parseFloat(item.product_2v.price),
            thumbnail: item.product_2v.thumbnail,
            quantity: item.quantity,
            cartItemId: item.id 
          }));
          
          setCartItems(formattedItems);
          setUseLocalStorage(false);
        }
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho, usando localStorage:', error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setUseLocalStorage(true);
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      if (cartService && typeof cartService.addToCart === 'function' && !useLocalStorage) {
        const { data, error } = await cartService.addToCart(product.id, 1);
        
        if (error) {
          console.error('Erro Supabase, usando localStorage:', error);
          setUseLocalStorage(true);
          addToCartLocal(product);
          return;
        }

        setCartItems(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
            return prev.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            return [...prev, { 
              ...product, 
              quantity: 1,
              cartItemId: data.id 
            }];
          }
        });
      } else {
        addToCartLocal(product);
      }

      await logAction(
        LogActions.ADD_TO_CART,
        `Produto adicionado ao carrinho: ${product.title}`,
        product.id,
        'product'
      );

    } catch (error) {
      console.error('Erro ao adicionar, usando localStorage:', error);
      setUseLocalStorage(true);
      addToCartLocal(product);
    }
  };

  const addToCartLocal = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = async (productId) => {
    try {
      const itemToRemove = cartItems.find(item => item.id === productId);
      if (!itemToRemove) return;

      if (cartService && typeof cartService.removeFromCart === 'function' && !useLocalStorage && itemToRemove.cartItemId) {
        const { error } = await cartService.removeFromCart(itemToRemove.cartItemId);
        
        if (error) {
          console.error('Erro Supabase, usando localStorage:', error);
          setUseLocalStorage(true);
        }
      }

      setCartItems(prev => prev.filter(item => item.id !== productId));

      await logAction(
        LogActions.REMOVE_FROM_CART,
        `Produto removido: ${itemToRemove.title}`,
        productId,
        'product'
      );

    } catch (error) {
      console.error('Erro ao remover, usando localStorage:', error);
      setUseLocalStorage(true);
      setCartItems(prev => prev.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const itemToUpdate = cartItems.find(item => item.id === productId);
      if (!itemToUpdate) return;

      if (cartService && typeof cartService.updateQuantity === 'function' && !useLocalStorage && itemToUpdate.cartItemId) {
        const { error } = await cartService.updateQuantity(itemToUpdate.cartItemId, newQuantity);
        
        if (error) {
          console.error('Erro Supabase, usando localStorage:', error);
          setUseLocalStorage(true);
        }
      }

      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );

    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      setUseLocalStorage(true);
      setCartItems(prev =>
        prev.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    try {
      if (cartService && typeof cartService.clearCart === 'function' && !useLocalStorage) {
        const { error } = await cartService.clearCart();
        if (error) {
          console.error('Erro Supabase, usando localStorage:', error);
          setUseLocalStorage(true);
        }
      }

      setCartItems([]);
      localStorage.removeItem('cartItems');

    } catch (error) {
      console.error('Erro ao limpar:', error);
      setUseLocalStorage(true);
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      setCartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      loading,
      refreshCart: loadCartFromSupabase,
      usingLocalStorage: useLocalStorage
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
