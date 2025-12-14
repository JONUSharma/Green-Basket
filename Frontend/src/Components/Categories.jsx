const categories = [
  { name: "Vegetables", img: "https://media.istockphoto.com/id/2186457342/photo/fresh-raw-vegetables-and-fruits.webp?a=1&b=1&s=612x612&w=0&k=20&c=YrPl5_FIP7FjuUyC6YMisE33fWXDTMoigIaolaXtBnw=" },
  { name: "Fruits", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZydWl0c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600" },
  { name: "Grains", img: "https://images.unsplash.com/photo-1621956838481-f8f616950454?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhaW5zfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" },
  { name: "Seeds", img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170" },
  // { name: "Fertilizers", img: "https://source.unsplash.com/800x600/?fertilizer" },
  // { name: "Others", img: "https://source.unsplash.com/800x600/?farm" },
];


export default function Categories() {
  return (
    <section
      id="categories"
      className="py-16 bg-gradient-to-b from-green-50 via-lime-50 to-green-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-green-800">
          Browse by Category 🌾
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-green-100"
            >
              <div className="relative">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="h-52 w-full object-cover"
                />
                {/* Subtle overlay for natural tone */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="p-3 text-center font-semibold text-green-800 bg-green-50">
                {cat.name}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-green-700 italic">
          Explore fresh and organic produce directly from trusted farmers 🍃
        </p>
      </div>
    </section>
  );
}
