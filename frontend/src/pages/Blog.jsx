export default function Blog() {
  const posts = [
    { title: "5 Tips for Indoor Plant Care", date: "Aug 2024", excerpt: "Learn how to keep indoor plants thriving..." },
    { title: "Best Outdoor Plants for Summer", date: "Jul 2024", excerpt: "Plants that love sunlight and grow fast..." },
  ];
  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Gardening Tips</h1>
      {posts.map((p, i) => (
        <div key={i} className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <p className="text-sm text-gray-500">{p.date}</p>
          <p className="mt-2">{p.excerpt}</p>
          <button className="mt-3 text-green-700 font-semibold hover:underline">Read More →</button>
        </div>
      ))}
    </section>
  );
}
