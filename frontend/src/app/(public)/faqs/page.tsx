export default function FAQPrivacyPage() {
  return (
    <div className="bg-[#EEF2FF] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 md:px-8 bg-white p-8 md:p-12 border border-[#E5E7EB] space-y-12">
        
        {/* FAQs */}
        <section>
          <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-[#E5E7EB]">FAQ's</h1>
          <div className="w-full space-y-4">
            <details className="group border-b border-gray-200 pb-4">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between">
                Are the products pre-cooked or raw?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="text-gray-600 leading-relaxed mt-4">
                Most of our frozen vegetable and meat products are raw and flash-frozen to retain nutritional value. Processed foods, however, may be partially or completely cooked. Please check the individual product packaging for cooking instructions.
              </div>
            </details>
            <details className="group border-b border-gray-200 pb-4">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between">
                How long can I store items in my freezer?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="text-gray-600 leading-relaxed mt-4">
                Standard freezer lifespans are up to 12 months for vegetables and raw meats, and 6 months for cooked/processed foods. Maintain -18°C below for best quality.
              </div>
            </details>
            <details className="group border-b border-gray-200 pb-4">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between">
                How do you ensure frozen temperatures during delivery?
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="text-gray-600 leading-relaxed mt-4">
                All packages utilize EPS foam cooler boxing combined with calculated dry ice to keep contents fully frozen during standard 24-48h shipment cycles.
              </div>
            </details>
          </div>
        </section>

        {/* Privacy Policy */}
        <section>
          <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-[#E5E7EB]">Privacy Policy</h1>
          <div className="prose prose-blue max-w-none text-gray-600 space-y-4">
            <p>
              Your privacy is extremely important to us. This policy outlines how we collect, use, and protect your personal data when you interact with our e-commerce platform.
            </p>
            <h3 className="font-bold text-gray-900 mt-6">Data Collection</h3>
            <p>
              We collect information provided directly by you, such as name, email address, payment details, and shipping address during checkout. We may also automatically collect analytical data related to your browsing patterns.
            </p>
            <h3 className="font-bold text-gray-900 mt-6">Data Usage</h3>
            <p>
              The data we collect is utilized strictly to fulfill your orders, provide competent customer service, and send periodic promotional material (which you can opt out of at any time).
            </p>
            <h3 className="font-bold text-gray-900 mt-6">Protection</h3>
            <p>
              All payment transactions are AES encrypted and securely executed via compliant gateways. We do not store full credit card strings on internal servers.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
