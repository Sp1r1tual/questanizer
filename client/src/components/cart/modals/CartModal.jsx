import { useTranslation } from "react-i18next";

import { useCart } from "@/hooks/market/useCart";

import { CartItemList } from "../CartItemList";

import styles from "./CartModal.module.css";

const CartModal = () => {
  const {
    isCartModalOpen,
    cart,
    localCartQuantities,
    totalPrice,
    closeModal,
    increaseQuantity,
    decreaseQuantity,
    handleRemoveItem,
    handleQuantityChange,
    handleCheckout,
    handleBackdropClick,
  } = useCart();

  const { t } = useTranslation();

  if (!isCartModalOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={closeModal}>
          ×
        </button>

        <h2 className={styles.title}>{t("market.cartTitle")}</h2>

        {cart.length === 0 ? (
          <div className={styles.emptyCart}>{t("market.emptyCart")}</div>
        ) : (
          <>
            <CartItemList
              cart={cart}
              localQuantities={localCartQuantities}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={handleRemoveItem}
              onChangeQuantity={handleQuantityChange}
            />

            <div className={styles.totalSection}>
              <div className={styles.totalPrice}>
                {t("shared.total")}: {totalPrice} {t("shared.golds")}
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          {cart.length > 0 && (
            <button className={styles.btnCheckout} onClick={handleCheckout}>
              {t("market.buyAll")}
            </button>
          )}
          <button className={styles.btnClose} onClick={closeModal}>
            {t("shared.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export { CartModal };
