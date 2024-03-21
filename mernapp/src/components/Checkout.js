import React from 'react'
import './Checkout.css'
import Computer from "../images/Computer.jpg"
import Subtotal from './Subtotal'
import { useStateValue } from './StateProvider'
import { useSelector } from "react-redux";
import CheckoutProduct from './CheckoutProduct'
import { motion } from "framer-motion";
import Lottie from 'lottie-react';
import animate from '../assets/cart-empty.json'

function Checkout() {
  const [{ basket }, dispatch] = useStateValue();
  const userData = useSelector((state) => state.users);
  console.log(userData);
  return (

   
    <div className='Checkout'>
        <div className='Checkout-left'>
            <img className='checkout-ad' src={Computer} alt=""/>
            <div>
            <div className='checkout-title'>
              {userData.name ? (
                <h4>{" Dear, "+userData.name+"."}</h4>
              ) : (
                <h4>Dear, User.</h4>
              )}
                <h4>Your Shopping Cart</h4>
            </div>
            <motion.div>
            {basket.length ? (
              basket.map(item => (
                <CheckoutProduct
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                />
              ))
            ) : (
              <Lottie className='json-data' animationData={animate}/>
            )}
          </motion.div>

        </div>
        </div>
        <div className='Checkout-right'>
            <Subtotal />
            
        </div>
        

    </div>
  )
}

export default Checkout