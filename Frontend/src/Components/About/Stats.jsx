export default function StatsCard({ number, label }) {
  return (
    <div className="bg-white border border-green-100 rounded-lg p-6 shadow text-green-700">
      <h3 className="text-2xl md:text-3xl font-bold">{number}</h3>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
}
