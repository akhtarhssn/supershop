export default function ShippingReturnsPage() {
  return (
    <div className="bg-[#EEF2FF] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 md:px-8 bg-white p-8 md:p-12 border border-[#E5E7EB]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-[#E5E7EB]">
          Shipping & Returns
        </h1>

        <div className="prose prose-blue max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-[#6366F1] pl-3">
              Shipping Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We employ strict temperature-controlled logistics to ensure all
              frozen foods arrive perfectly preserved. Standard shipping options
              generally clear within 1-2 business days using specialized
              refrigerated fleets.
            </p>
            <ul className="list-disc pl-5 mt-4 text-gray-600 space-y-2">
              <li>
                Free ground temperature shipping on orders over{" "}
                <span className="font-semibold text-gray-900">$10,000</span>.
              </li>
              <li>
                Express overnight dry-ice delivery available for{" "}
                <span className="font-semibold text-gray-900">$2,500</span>.
              </li>
              <li>Deliveries are not processed on Sundays.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 border-l-4 border-[#6366F1] pl-3">
              Returns Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Due to the perishable nature of our frozen products, we generally
              do not accept returns. However, if your order arrives damaged,
              thawed, or incomplete, please contact our support team within 24
              hours of delivery.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Refunds covering the cost of defective items are processed back to
              your original payment method within 3-5 business days. Photographs
              of the damaged goods must be provided upon request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
