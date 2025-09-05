export default function Gallery() {
  const images = [
    "https://via.placeholder.com/300x200",
    "https://via.placeholder.com/300x200",
    "https://via.placeholder.com/300x200",
    "https://via.placeholder.com/300x200",
  ];
  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Our Gallery</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <img key={i} src={img} alt="Gallery" className="rounded-xl shadow-md hover:scale-105 transition" />
        ))}
      </div>
    </section>
  );
}
