import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51REZsKQCWR8hVDB5GMIjhxmEBTNQoTajifWlgKpNzteYvpRRFsAWxe4xI5YdwbOt5CZtCsWNEdjUDlL7exSY2dJ000LICovpqw');

const BuyerDashboard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [buyerDetails, setBuyerDetails] = useState({ name: '', address: '', phone: '' });

  const defaultProducts = [
    {
      _id: 'default1',
      name: 'Organic Tomatoes',
      type: 'crop',
      price: 50,
      quantity: '1000 kg',
      image: '/images/products/tomatoes.jpg',
      description: 'Freshly harvested organic tomatoes, perfect for cooking and salads',
      farmer: 'Ravi Kumar',
      location: 'Coimbatore'
    },
    {
      _id: 'default2',
      name: 'Fresh Cow Milk',
      type: 'dairy',
      price: 45,
      quantity: '500 Litres',
      image: '/images/products/milk.jpg',
      description: 'Fresh cow milk from local dairy farm',
      farmer: 'Suresh',
      location: 'Coimbatore'
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/products');
        setProducts([...defaultProducts, ...res.data]);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const exists = cartItems.find(item => item._id === product._id);
    if (exists) {
      setCartItems(
        cartItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item._id !== productId));
  };

  const handlePlaceOrder = () => {
    setShowOrderForm(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const stripe = await stripePromise;

    try {
      const { data } = await axios.post('http://localhost:5001/api/payment/create-checkout-session', {
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        buyerDetails
      });

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      if (result.error) console.error('Stripe Checkout Error:', result.error.message);
    } catch (err) {
      console.error('Error creating checkout session:', err);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="dashboard-container">
      <div className="container">
        <h2>Buyer Dashboard</h2>

        {/* Product Listing */}
        <div className="products-section">
          <h3>Available Products</h3>
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? <img src={product.image} alt={product.name} /> : <div>No Image</div>}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>₹{product.price}</p>
                  <p>{product.quantity}</p>
                  <p>{product.description}</p>
                  <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
                    <FontAwesomeIcon icon={faCartPlus} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section mt-4">
          <h3>Shopping Cart</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <div>{item.name}</div>
                  <div>₹{item.price}</div>
                  <div>Qty: {item.quantity}</div>
                  <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item._id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              ))}
              <div className="mt-3">
                <button className="btn btn-success" onClick={handlePlaceOrder}>
                  <FontAwesomeIcon icon={faCheck} /> Place Order
                </button>
              </div>
            </>
          )}
        </div>

        {/* Order Form & Stripe Checkout */}
        {showOrderForm && (
          <form className="order-form mt-4" onSubmit={handleOrderSubmit}>
            <h4>Complete Your Order</h4>
            <p>Total Price: ₹{totalPrice}</p>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={buyerDetails.name}
              onChange={e => setBuyerDetails({ ...buyerDetails, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              required
              value={buyerDetails.address}
              onChange={e => setBuyerDetails({ ...buyerDetails, address: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={buyerDetails.phone}
              onChange={e => setBuyerDetails({ ...buyerDetails, phone: e.target.value })}
            />
            <button type="submit" className="btn btn-primary">Proceed to Payment</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
