export default function FAQ() {
  const faqs = [
    { q: "Do you deliver plants?", a: "Yes, we deliver across India with safe packaging." },
    { q: "How do I take care of my plant?", a: "Each product page includes detailed care instructions." },
  ];
  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">FAQs</h1>
      {faqs.map((f, i) => (
        <div key={i} className="bg-white shadow-md rounded-xl p-6 mb-4">
          <h2 className="font-semibold">{f.q}</h2>
          <p className="text-gray-600">{f.a}</p>
        </div>
      ))}
    </section>
  );
}
