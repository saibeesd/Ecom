import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  const userId = localStorage.getItem("userId")

  useEffect(() => {
    if (userId) {
      fetchCart()
    }
  }, [])

  function fetchCart() {
    axios.get("https://ecom-1-zyik.onrender.com/api/cart", {
      params: { userId }
    })
    .then(res => {
      setCartItems(res.data.items)
      setLoading(false)
    })
    .catch(err => {
      console.log("Error fetching cart:", err)
      setLoading(false)
    })
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) return

    axios.put(
      "https://ecom-1-zyik.onrender.com/api/cart/update",
      { productId, quantity },
      { params: { userId } }
    )
    .then(() => fetchCart())
    .catch(err => console.log("Error updating quantity:", err))
  }

  function removeFromCart(productId) {
    axios.delete(
      "https://ecom-1-zyik.onrender.com/api/cart/remove",
      { params: { userId, productId } }
    )
    .then(() => fetchCart())
    .catch(err => console.log("Error removing item:", err))
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  if (!userId) {
    return <h4 className="text-center mt-4">Please login to view cart</h4>
  }

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>

      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="row">
            {cartItems.map(item => (
              <div className="col-md-4 mb-3" key={item.product._id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5>{item.product.name}</h5>
                    <p><b>Price:</b> ₹{item.product.price}</p>
                    <p><b>Category:</b> {item.product.category}</p>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="btn btn-danger btn-sm mt-3"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr />
          <h4>Total: ₹{totalPrice}</h4>
          <button className="btn btn-success mt-2">
            Checkout
          </button>
        </>
      )}
    </div>
  )
}
