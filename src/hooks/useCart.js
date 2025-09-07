import { useContext } from "react";
import { CartContext } from "../context/CartContext";

// Custom hook to simplify CartContext usage
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return {
    cart: context.cart,
    addItem: context.addItem,
    removeItem: context.removeItem,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    totalItems: context.totalItems,
    totalPrice: context.totalPrice,
  };
};
