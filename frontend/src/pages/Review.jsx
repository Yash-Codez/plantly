export default function Reviews() {
  const reviews = [
    { name: "Aditi", review: "Great quality plants and fast delivery!" },
    { name: "Rahul", review: "Customer service was excellent. Highly recommend!" },
  ];
  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Customer Reviews</h1>
      {reviews.map((r, i) => (
        <div key={i} className="bg-white shadow-md rounded-xl p-6 mb-4">
          <p className="text-gray-700 italic">"{r.review}"</p>
          <p className="mt-2 font-semibold text-green-700">- {r.name}</p>
        </div>
      ))}
    </section>
  );
}
