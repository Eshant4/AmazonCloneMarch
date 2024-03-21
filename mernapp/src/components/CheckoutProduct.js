import React, { useState } from "react";
import "./CheckoutProduct.css";
import { useStateValue } from "./StateProvider";
import { motion } from "framer-motion";

function CheckoutProduct({ id, image, title, price, rating, hideButton }) {
  const [{ basket }, dispatch] = useStateValue();
  const [isRemoving, setIsRemoving] = useState(false);
  const removeFromCart = () => {
    setIsRemoving(true);
    setTimeout(() => {
      dispatch({
        type: "REMOVE_FROM_CART",
        id: id,
      });
      setIsRemoving(false);
    }, 500);
  };

  return (
    <motion.div
      className="CheckoutProduct"
      initial={{ x: 0 }}
      animate={isRemoving ? { opacity: 0, y: 50 } : { x: "0" }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <img className="CheckoutProduct-img" src={image} alt="" />

      <div className="CheckoutProduct-info">
        <p className="CheckoutProduct-title">{title}</p>
        <p className="CheckoutProduct-price">
          <small>₹</small>
          <strong>{price}</strong>
        </p>
        <div className="CheckoutProduct-rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p>🌟</p>
            ))}
        </div>
        {!hideButton && (
        <button onClick={removeFromCart}>Remove from Cart</button>
        )}
        </div>
    </motion.div>
  );
}

export default CheckoutProduct;
