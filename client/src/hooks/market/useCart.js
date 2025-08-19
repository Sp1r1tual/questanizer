import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  closeCartModal,
  setLocalCartQuantity,
  removeLocalCartQuantity,
} from "@/store/market/marketSlice";

import { fetchCart, syncCart, checkoutCart } from "@/store/market/marketThunks";

const useCart = () => {
  const dispatch = useDispatch();

  const { isCartModalOpen, localCartQuantities, cart } = useSelector((state) => state.market);

  useEffect(() => {
    if (isCartModalOpen) {
      dispatch(fetchCart()).then((action) => {
        if (action.payload?.items) {
          const quantities = {};
          action.payload.items.forEach((i) => {
            quantities[i.item._id] = i.quantity;
          });
          action.payload.items.forEach((i) => {
            dispatch(setLocalCartQuantity({ itemId: i.item._id, quantity: i.quantity }));
          });
        }
      });
    }
  }, [isCartModalOpen, dispatch]);

  const handleQuantityChange = (itemId, value) => {
    const parsed = Math.max(1, Math.min(100, parseInt(value, 10) || 1));
    dispatch(setLocalCartQuantity({ itemId, quantity: parsed }));
  };

  const increaseQuantity = (itemId) => {
    const currentQty = localCartQuantities[itemId] || 1;
    dispatch(setLocalCartQuantity({ itemId, quantity: currentQty + 1 }));
  };

  const decreaseQuantity = (itemId) => {
    const currentQty = localCartQuantities[itemId] || 1;
    const newQty = Math.max(1, currentQty - 1);
    dispatch(setLocalCartQuantity({ itemId, quantity: newQty }));
  };

  const handleRemoveItem = async (itemId) => {
    dispatch(removeLocalCartQuantity(itemId));
    await dispatch(syncCart([{ itemId, quantity: 0 }])).unwrap();
  };

  const handleCheckout = () => {
    dispatch(fetchCart());
    dispatch(checkoutCart());
    dispatch(closeCartModal());
  };

  const closeModal = async () => {
    const itemsToSync = [];

    cart.forEach((item) => {
      const serverQty = item.quantity;
      const localQty = localCartQuantities[item.item._id] || 0;

      if (localQty !== serverQty) {
        itemsToSync.push({ itemId: item.item._id, quantity: localQty });
      }
    });

    if (itemsToSync.length > 0) {
      await dispatch(syncCart(itemsToSync)).unwrap();
    }

    dispatch(closeCartModal());
  };

  const totalPrice = cart.reduce((sum, item) => {
    const qty = localCartQuantities[item.item._id] || item.quantity;

    return sum + (item?.item?.price || 0) * qty;
  }, 0);

  return {
    isCartModalOpen,
    cart,
    localCartQuantities,
    totalPrice,
    handleQuantityChange,
    increaseQuantity,
    decreaseQuantity,
    handleRemoveItem,
    handleCheckout,
    closeModal,
  };
};

export { useCart };
