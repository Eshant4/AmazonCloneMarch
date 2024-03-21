import React from "react";
import "./Subtotal.css";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from "./reducer";
import { useNavigate } from 'react-router-dom';
function Subtotal() {
  const [{ basket }] = useStateValue();
  const navigate = useNavigate();

  return (
    <div className="Subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal({basket.length} items): <strong>{value}</strong>
            </p>
            <small className="subtotal-gift">
              <input type="checkbox" />
              This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={"text"}
        thousandSeperator={true}
        prefix={"₹"}
      />
      <button className="proceed-btn" onClick= {e => navigate('/payment')}>Proceed to Checkout</button>
    </div>
  );
}

export default Subtotal;
