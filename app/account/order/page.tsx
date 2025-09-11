export const metadata = {
  title: 'Orders • Better Being',
  description: 'Your orders overview.'
};

export default function OrdersPage() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-white">
      <div className="text-center px-6 py-16">
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'League Spartan, sans-serif' }}>Orders</h1>
        <p className="text-gray-600">This is a placeholder orders page. We can flesh this out later.</p>
      </div>
    </div>
  );
}
