import React, { useState, useEffect } from "react";
import "./Payment.css";
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from "./reducer";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
function Payment() {
  const [{ basket }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.users);

  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/payment/create?total=${
          getBasketTotal(basket) * 100
        }`,
        {
          method: "POST", // Specify the method as POST
          headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
          },
          body: JSON.stringify({}), // Provide an empty body since all the required data is in the URL query parameters
        }
        // `/payment/create?total=${getBasketTotal(basket)}`,
      );
      const data = await response.json();
      setClientSecret(data.clientSecret);
    };
    getClientSecret();
  }, [basket]);
  console.log("The Secret key is >>>", clientSecret);

  const handleSubmit = async (event) => {
    console.log("handleSubmit function called");
    console.log("Phone:", userData.number);
    console.log("Email:", userData.email);
    console.log("name:", userData.name);
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);

      // Store order details in MongoDB
      try {
        // Create a Stripe customer with address information
        const stripeAddress = {
          line1: "Sample Street 1", // Example street address
          city: "Sample City",
          country: "IN", // India
          postal_code: "123456", // Example postal code
          state: "Sample State",
        };

        const stripeCustomer = await stripe.customers.create({
          name: userData.name,
          description: `Customer for ${userData.email}`, // Provide a description for the customer
          email: userData.email,
          phone: userData.number,
          address: stripeAddress,
        });

        const response = await fetch(
          `${process.env.REACT_APP_SERVER_DOMAIN}/orders/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userData?.id,
              basket: basket,
              amount: getBasketTotal(basket),
              created: new Date().toISOString(),
              customerId: stripeCustomer.id,
              customerName: userData.name,
              customerEmail: userData.email,
              customerPhone: userData.number,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error storing order");
        }

        // Clear the basket after successful order
        dispatch({ type: "EMPTY_BASKET" });
        navigate("/orders");
      } catch (error) {
        console.error("Error storing order:", error);
        setError("Error processing order. Please try again later.");
      }
    }
  };

  const handleChange = (e) => {
    //
  };
  return (
    <div className="Payment">
      <div className="Payment-cont">
        <h1>
          Checkout(
          <Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        <div className="Payment-section">
          <div className="Payment-title">
            <h3>Delivery Address</h3>
          </div>
          <div className="Payment-Address">
            {userData.city ? <p>{userData.city}</p> : <p>your address</p>}
            {userData.city ? <p>{userData.pincode}</p> : <p>your pin</p>}
          </div>
        </div>
        <div className="Payment-section">
          <div className="Payment-title">
            <h3>Review items and Delivery</h3>
          </div>
          <div className="Payment-items">
            {basket.map((item) => (
              <CheckoutProduct
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        <div className="Payment-section">
          <div className="Payment-title">
            <h3>Payment Method</h3>
          </div>
          <div className="Payment-details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="Payment-priceCont">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total: {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeperator={true}
                  prefix={"₹"}
                />
                {/* <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button> */}
                <button onClick={handleSubmit}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
