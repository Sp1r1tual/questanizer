import { useTranslation } from "react-i18next";

import { useCart } from "@/hooks/market/useCart";

import { Modal } from "@/components/ui/modals/Modal";
import { CartItemList } from "./CartItemList";

import styles from "./CartView.module.css";

const CartView = () => {
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
  } = useCart();

  const { t } = useTranslation();

  return (
    <Modal isOpen={isCartModalOpen} onClose={closeModal}>
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
    </Modal>
  );
};

export { CartView };
