import { useCartModal } from "../../../hooks/market/useCartModal";

import { CartItemList } from "../CartItemList";

import styles from "./CartModal.module.css";

const CartModal = () => {
    const {
        isCartModalOpen,
        cart,
        totalPrice,
        closeModal,
        increaseQuantity,
        decreaseQuantity,
        handleRemoveItem,
        handleQuantityChange,
        handleCheckout,
        handleBackdropClick,
        isLoading,
    } = useCartModal();

    if (!isCartModalOpen) return null;

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <button className={styles.close} onClick={closeModal}>
                    ×
                </button>

                <h2 className={styles.title}>Cart</h2>

                {cart.length === 0 ? (
                    <div className={styles.emptyCart}>Your cart is empty</div>
                ) : (
                    <>
                        <CartItemList
                            cart={cart}
                            onIncrease={increaseQuantity}
                            onDecrease={decreaseQuantity}
                            onRemove={handleRemoveItem}
                            onChangeQuantity={handleQuantityChange}
                            isLoading={isLoading}
                        />

                        <div className={styles.totalSection}>
                            <div className={styles.totalPrice}>
                                Total: {totalPrice} 🪙
                            </div>
                        </div>
                    </>
                )}

                <div className={styles.actions}>
                    {cart.length > 0 && (
                        <button
                            className={styles.btnCheckout}
                            onClick={handleCheckout}
                        >
                            Buy all
                        </button>
                    )}
                    <button className={styles.btnClose} onClick={closeModal}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export { CartModal };
