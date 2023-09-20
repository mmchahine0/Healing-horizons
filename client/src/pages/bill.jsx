import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/BillStyles.css"

const BillPage = () => {
  const [orderData, setOrderData] = useState(null);
  const [items, setItems] = useState([]);  // Assuming you fetch the items separately

  useEffect(() => {
    // Fetch the items separately
    axios
      .get("http://127.0.0.1:3500/products/all-products")
      .then((response) => {
        setItems(response.data);  
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://127.0.0.1:3500/order/get-order")
      .then((response) => {
        setOrderData(response.data.orders); 
        console.log(response.data.orders);   
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  return (
    <>
      <Navbar />
      <div>
        <h2>Your Order Summary :</h2>
        {orderData && orderData.length > 0 ? (
          <div>
            {orderData.map((order, index) => (
              <div key={index} className="order-summary-container">
                <h3>Order {index + 1}</h3>
                <ul>
                  {order.items.map((itemId, itemIndex) => {
                    const item = items.find(item => item._id === itemId);
                    if (item) {
                      return (
                        <li key={item._id + "_" + itemIndex}>
                          <img className="product-imageBill" src={item.productImage} alt={item.productName} /> <br/>
                          Product Name: {item.productName}, Price: ${item.productPrice}
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
                <p>Total Price: ${order.totalPrice}</p>
                <p>Order created at: {order.createdAt}</p>
                <p>Order status: {order.orderStatus}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No order data available.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BillPage;
