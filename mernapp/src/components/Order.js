import React from 'react'
import "./Order.css"
import CurrencyFormat from "react-currency-format";
import { useStateValue } from './StateProvider';


import moment from "moment";
import CheckoutProduct from './CheckoutProduct';
import { getBasketTotal } from "./reducer";
function Order({order}) {
  const [{ basket} ]= useStateValue();

  return (
    <div className='Order'>
        <h2>Order</h2>
        <p>{moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")}</p>
        <p className='Order-id'>
            <small>{order.id}</small>
        </p>
        {order.data.basket?.map(item => (
            <CheckoutProduct 
            id={item.id}
            title={item.title}
            image={item.image}
            price={item.price}
            rating={item.rating}
            hideButton
            />
        ))}
        <CurrencyFormat
                  renderText={(value) => (<h3 className='Order-total'>Order Total: {value}</h3>)}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeperator={true}
                  prefix={"₹"}
                />
    </div>
  )
}

export default Order