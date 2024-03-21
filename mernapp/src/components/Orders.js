import React, { useEffect, useState } from 'react'
import "./Orders.css"
import { useStateValue } from './StateProvider';
import { useSelector } from "react-redux";

import Order from "./Order"
function Orders() {
  const [orders, setOrders] = useState([]);
  const [{ basket, user}, dispatch]= useStateValue();
  const userData = useSelector((state) => state.users);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userData) return; // Return if user is not available

      try {
        // Make a GET request to fetch orders from MongoDB
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/orders/${userData.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data); // Update orders state with fetched data
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders(); // Call fetchOrders to fetch orders when component mounts
  }, [userData]);

  return (
    <div className='Orders'>
        <h1>Your Orders</h1>

        <div className='Orders-order'>
          {orders?.map(order => (
            <Order order={order} />
          ))}
        </div>
    </div>
  )
}

export default Orders