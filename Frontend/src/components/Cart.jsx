// import React, { useState, useEffect } from "react";
// import { useAuth } from "../store/auth"; // Import useAuth

// const Cart = () => {
//   const [cart, setCart] = useState([]);
//   const [total, setTotal] = useState(0);
//   const { updateCartCount } = useAuth(); // Get updateCartCount from context

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(storedCart);
//     calculateTotal(storedCart);
//   }, []);

//   // Calculate total price
//   const calculateTotal = (cartItems) => {
//     const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotal(totalPrice);
//   };

//   // Handle delete item from cart
//   const handleDeleteItem = (index) => {
//     const updatedCart = cart.filter((_, i) => i !== index); // Remove the item at the specified index
//     setCart(updatedCart); // Update state
//     localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update localStorage
//     calculateTotal(updatedCart); // Recalculate total

//     // Update cart count in global state
//     updateCartCount(updatedCart.length);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-4xl font-bold mb-6">Shopping Cart</h1>
//       {cart.length === 0 ? (
//         <p className="text-lg text-gray-500">Your cart is empty.</p>
//       ) : (
//         <div className="space-y-4">
//           {cart.map((item, index) => (
//             <div key={index} className="flex items-center gap-6 border p-4 rounded-lg shadow-md">
//               <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg border" />
//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold">{item.name}</h2>
//                 <p className="text-gray-600">Size: <span className="font-medium">{item.size}</span></p>
//                 <p className="text-gray-600">Quantity: <span className="font-medium">{item.quantity}</span></p>
//                 <p className="text-gray-800 font-semibold">Price: ₹{item.price}</p>
//               </div>
//               <button
//   onClick={() => handleDeleteItem(index)}
//   className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
// >
//   Delete
// </button>

//             </div>
//           ))}
//           <div className="text-2xl font-bold text-right mt-6 border-t pt-4">
//             Total: ₹{total.toFixed(2)}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React, { useEffect } from "react";
import { useCart } from "../context/CartContext"; // Import useCart instead of useAuth
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    cartCount,
    updateCartCount, // Make sure this is provided in your CartContext
  } = useCart();

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
  };

  const total = calculateTotal();

  // Handle delete item from cart
  const handleDeleteItem = (productId) => {
    removeFromCart(productId); // This will update both context and localStorage
  };

  const handleClearCart = () => {
    clearCart(); // This will empty the cart
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Shopping Cart ({cartCount} items)
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-4">Your cart is empty.</p>
          <Link
            to="/shop"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex items-center gap-6 border p-4 rounded-lg shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                {item.size && (
                  <p className="text-gray-600">
                    Size: <span className="font-medium">{item.size}</span>
                  </p>
                )}
                <p className="text-gray-600">
                  Quantity:{" "}
                  <span className="font-medium">{item.quantity || 1}</span>
                </p>
                <p className="text-gray-800 font-semibold">
                  Price: ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-8 border-t pt-6">
            <button
              onClick={handleClearCart}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              Clear Cart
            </button>

            <div className="text-right">
              <p className="text-2xl font-bold">Total: ₹{total.toFixed(2)}</p>
              <Link
                to="/checkout"
                className="mt-4 inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
