import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
//import { Product } from 'src/pages/Cart/styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const storageProducts = await AsyncStorage.getItem('CartItem')
      if(storageProducts){
        console.log(storageProducts);
        return setProducts(JSON.parse(storageProducts));

      }

    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {

    const existentProduct = products.findIndex(indexProduct => indexProduct.id === product.id);
    console.log(product.id);
    if(existentProduct >= 0){
      products[existentProduct].quantity += 1;
    }
    else{
      products.push({... product, quantity: 1})
    }

    setProducts([...products]);
    await AsyncStorage.setItem('CartItem', JSON.stringify([...products]))


  }, []);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
    const existentProduct = products.findIndex(product => product.id === id)
    if(existentProduct >= 0){
      products[existentProduct].quantity += 1;
    }

    setProducts([...products]);
    await AsyncStorage.setItem('CartItem', JSON.stringify([...products]));

  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
    const existentProduct = products.findIndex(product => product.id === id)
    if(existentProduct >= 0){
      const quantityProduct = products[existentProduct].quantity;

      if(quantityProduct > 1){
        products[existentProduct].quantity -= 1;
      }else{
        products.splice(existentProduct);
      }

    }
    setProducts([...products]);
    await AsyncStorage.setItem('CartItem', JSON.stringify([...products]));

  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
