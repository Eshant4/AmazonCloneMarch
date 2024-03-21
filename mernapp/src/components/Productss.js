import React from "react";
import "./product.css";
import { useStateValue } from "./StateProvider";
import { motion } from "framer-motion";
import Snackbar from "@mui/material/Snackbar";

function Productss({ id, title, image, price, rating }) {
  const [{ basket }, dispatch] = useStateValue();
  const [open, setOpen] = React.useState(false);

  console.log("this the cart ", basket);
  const addtoCart = () => {
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
      },
    });
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <motion.div
      className="product-cont"
      whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px 0px rgb(0,0,0)" }}
    >
      <div className="product-info">
        <p>{title}</p>
        <p className="product-price">
          <small>₹</small>
          <strong>{price}</strong>
        </p>
        <div className="product-rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p>🌟</p>
            ))}
        </div>
      </div>
      <img src={image} alt="" />
      <button onClick={addtoCart}>Add to Cart</button>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={title+" Added to the Cart"}
      />
    </motion.div>
  );
}

export default Productss;
