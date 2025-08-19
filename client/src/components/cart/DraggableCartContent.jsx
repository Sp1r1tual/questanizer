import { useDraggable } from "@dnd-kit/core";

import { CartCounter } from "./CartCounter";

import cartImg from "@/assets/cart-questanizer.png";

import styles from "./DraggableCartContent.module.css";

const DraggableCartContent = ({ x, y, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "basket",
  });

  const translateX = (transform?.x ?? 0) + x;
  const translateY = (transform?.y ?? 0) + y;

  const style = {
    position: "fixed",
    left: 0,
    top: 0,
    transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
    zIndex: 999,
    pointerEvents: "auto",
  };

  return (
    <div
      role="button"
      ref={setNodeRef}
      className={styles.basket}
      style={style}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      {...listeners}
      {...attributes}
    >
      <img src={cartImg} alt="Cart" className={styles.cartImage} />
      <CartCounter className={styles.cartCounter} />
    </div>
  );
};

export { DraggableCartContent };
