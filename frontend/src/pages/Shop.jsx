import { ShoppingCart } from "lucide-react";

export default function Shop() {
  const plants = [
    { id: 1, name: "Areca Palm", price: "₹499", type: "Indoor", img: "https://via.placeholder.com/200" },
    { id: 2, name: "Snake Plant", price: "₹399", type: "Indoor", img: "https://via.placeholder.com/200" },
    { id: 3, name: "Rose Plant", price: "₹299", type: "Outdoor", img: "https://via.placeholder.com/200" },
  ];

  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Our Plants</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plants.map((p) => (
          <div key={p.id} className="bg-white shadow-md rounded-xl overflow-hidden">
            <img src={p.img} alt={p.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-500">{p.type}</p>
              <p className="text-green-700 font-bold mt-2">{p.price}</p>
              <button className="mt-4 flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800">
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
