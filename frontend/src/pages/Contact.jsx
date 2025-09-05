export default function Contact() {
  return (
    <section className="px-6 py-12">
      <h1 className="text-3xl font-bold text-green-700 mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="mb-4">📍 123 Green Street, Plant City, India</p>
          <p className="mb-4">📞 +91 98765 43210</p>
          <p className="mb-4">✉️ nursery@example.com</p>
          <iframe
            title="map"
            className="w-full h-64 rounded-xl"
            src="https://maps.google.com/maps?q=delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
          ></iframe>
        </div>
        <form className="bg-white shadow-md rounded-xl p-6">
          <input type="text" placeholder="Your Name" className="w-full border rounded-lg p-3 mb-4" />
          <input type="email" placeholder="Your Email" className="w-full border rounded-lg p-3 mb-4" />
          <textarea placeholder="Message" className="w-full border rounded-lg p-3 mb-4" rows="4"></textarea>
          <button className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
