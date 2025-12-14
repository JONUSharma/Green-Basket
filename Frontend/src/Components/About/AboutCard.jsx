export default function AboutCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center border border-green-100 hover:scale-105 transition-transform">
      <div className="flex justify-center text-green-600 mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-green-700">{title}</h3>
      <p className="text-gray-600 mt-2 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
