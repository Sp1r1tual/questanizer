import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addToCart,
    checkoutCart,
    fetchCart,
    removeFromCart,
} from "@/store/market/marketThunks";
import { closeCartModal } from "@/store/market/marketSlice";

const useCartModal = () => {
    const dispatch = useDispatch();

    const { isCartModalOpen, cart, isLoading } = useSelector(
        (state) => state.market
    );

    useEffect(() => {
        if (isCartModalOpen) {
            dispatch(fetchCart());
        }
    }, [isCartModalOpen, dispatch]);

    const handleQuantityChange = async (itemId, newQuantity) => {
        const quantity = parseInt(newQuantity);

        try {
            await dispatch(addToCart({ itemId, quantity })).unwrap();
            dispatch(fetchCart());
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const increaseQuantity = async (itemId) => {
        try {
            await dispatch(addToCart({ itemId, quantity: 1 })).unwrap();
            dispatch(fetchCart());
        } catch (error) {
            console.error("Failed to increase quantity:", error);
        }
    };

    const decreaseQuantity = async (itemId, currentQuantity) => {
        try {
            if (currentQuantity > 1) {
                await dispatch(
                    removeFromCart({ itemId, quantity: 1 })
                ).unwrap();
                dispatch(fetchCart());
                return;
            }

            await dispatch(removeFromCart({ itemId, quantity: null })).unwrap();
            dispatch(fetchCart());
        } catch (error) {
            console.error("Failed to decrease quantity:", error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await dispatch(removeFromCart({ itemId, quantity: null })).unwrap();
            dispatch(fetchCart());
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const handleCheckout = () => {
        dispatch(checkoutCart());
        dispatch(closeCartModal());
    };

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            dispatch(closeCartModal());
        }
    };

    const closeModal = () => dispatch(closeCartModal());

    const totalPrice = cart.reduce((sum, item) => {
        return sum + (item?.item?.price || 0) * (item?.quantity || 0);
    }, 0);

    return {
        isCartModalOpen,
        cart,
        totalPrice,
        handleQuantityChange,
        increaseQuantity,
        decreaseQuantity,
        handleRemoveItem,
        handleCheckout,
        handleBackdropClick,
        closeModal,
        isLoading,
    };
};

export { useCartModal };
