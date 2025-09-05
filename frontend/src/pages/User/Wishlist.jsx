import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWishlist();
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  const moveToCart = async (productId, wishlistId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await handleRemove(wishlistId);
    } catch (err) {
      console.error("Error moving to cart:", err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
     <h1 className="text-2xl font-bold text-green-800 mb-6">
  💚 My Wishlist ({wishlist.length} items)
</h1>


      {wishlist.length === 0 ? (
        <p className="text-green-800">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const discountedPrice =
              item.product?.discount > 0
                ? (
                    item.product.price -
                    (item.product.price * item.product.discount) / 100
                  ).toFixed(2)
                : item.product?.price;

            return (
              <div key={item._id} className="bg-white shadow-md rounded-xl p-4">
                {/* Product Image */}
                <img
                  src={
                    item.product?.image
                      ? `http://localhost:5000${item.product.image}`
                      : "/images/plant-placeholder.png"
                  }
                  alt={item.product?.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />

                {/* Product Details */}
                <h3 className="text-lg font-bold text-green-700">
                  {item.product?.name}
                </h3>
                <p className="text-gray-600">{item.product?.description}</p>

                {/* ✅ Price Section */}
                {item.product?.discount > 0 ? (
                  <div className="mt-2">
                    <p className="text-gray-500 line-through">
                      ₹{item.product?.price}
                    </p>
                    <p className="text-green-700 font-bold text-lg">
                      ₹{discountedPrice}
                    </p>
                    <p className="text-red-500 text-sm">
                      Save {item.product?.discount}%
                    </p>
                  </div>
                ) : (
                  <p className="text-green-800 font-semibold">
                    ₹{item.product?.price}
                  </p>
                )}

                <p className="text-sm text-gray-500">
                  Category: {item.product?.category}
                </p>
                <p
                  className={`text-sm font-medium ${
                    item.product?.stock === 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {item.product?.stock > 0
                    ? `Stock: ${item.product?.stock}`
                    : "Out of Stock"}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <FaTrash /> Remove
                  </button>
                  <button
                    onClick={() => moveToCart(item.product._id, item._id)}
                    className="flex items-center gap-2 px-3 py-1 bg-green-800 text-white rounded-lg hover:bg-green-700"
                  >
                    <FaShoppingCart /> Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
