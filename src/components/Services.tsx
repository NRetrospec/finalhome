import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { StripeCheckoutForm } from "./StripeCheckoutForm";

export function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "", projectIdea: "" });
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [consultationSubmitted, setConsultationSubmitted] = useState(false);
  const [submittedServiceData, setSubmittedServiceData] = useState<any>(null);
  
  const selectService = useMutation(api.services.selectService);
  const submitConsultation = useMutation(api.services.submitConsultation);
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);

  const services = [
    {
      id: "website",
      title: "Website Development",
      price: 1000,
      description: "Full stack development with hosting setup included",
      features: [
        "Responsive design",
        "Modern framework (React/Vue/Svelte)",
        "Database integration",
        "Hosting setup",
        "SSL certificate",
        "Up to 5 Pages   "
      ],
      color: "cyan"
    },
    {
      id: "website-logo",
      title: "Website + Logo Design",
      price: 2000,
      description: "Complete package with custom logo design",
      features: [
        "Everything in Website Development",
        "Custom logo design",
        "Brand color palette",
        "Logo variations (light/dark)",
        "High-resolution files",
        "Brand guidelines"
      ],
      color: "purple"
    }
  ];

  const maintenanceTiers = [
    {
      id: "maintenance",
      title: "Maintenance",
      price: 500,
      description: "Ongoing support, updates, and technical maintenance for your website.",
      features: [
        "Monthly security updates",
        "Performance monitoring",
        "Content updates",
        "Technical support",
        "Backup management",
        "SEO monitoring"
      ],
      color: "green",
      isRecurring: true
    }
  ];

  const handleServiceClick = (service: any, tier?: any) => {
    const serviceData = service ? (tier ? { ...service, tier, combinedPrice: service.price + tier.price } : service) : tier;
    setSubmittedServiceData(serviceData);
    setShowConsultationForm(true);
    setConsultationSubmitted(false);
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email) {
      toast.error("Please enter your name and email");
      return;
    }

    try {
      // Submit consultation
      const serviceName = submittedServiceData.tier ?
        `${submittedServiceData.title} + ${submittedServiceData.tier.title}` :
        submittedServiceData.title;
      const message = `Interested in ${serviceName}. ${customerInfo.email}${customerInfo.projectIdea ? `. Project idea: ${customerInfo.projectIdea}` : ''}`;
      await submitConsultation({
        name: customerInfo.name,
        email: customerInfo.email,
        message,
        service: serviceName,
      });

      // Also record service selection
      await selectService({
        service: submittedServiceData.tier ? 
          `${submittedServiceData.title} + ${submittedServiceData.tier.title}` : 
          submittedServiceData.title,
        tier: submittedServiceData.tier?.id,
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        price: submittedServiceData.combinedPrice || submittedServiceData.price,
      });

      setConsultationSubmitted(true);
      toast.success("Consultation request submitted! We'll contact you soon.");
    } catch (error) {
      toast.error("Failed to submit consultation. Please try again.");
    }
  };

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);

  const handlePurchaseNow = (serviceData: any) => {
    setSubmittedServiceData(serviceData);
    setShowCheckoutForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckoutForm(false);
    setShowConsultationForm(false);
    toast.success("Payment successful! Your service is now active.");
  };

  const handlePaymentCancel = () => {
    setShowCheckoutForm(false);
  };

  if (showConsultationForm) {
    return (
      <section className="min-h-screen px-6 pt-24 pb-12">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Free Consultation
            </h2>
            <p className="text-lg text-gray-300">
              Selected: <span className="text-cyan-400 font-semibold">
                {submittedServiceData.tier ? 
                  `${submittedServiceData.title} + ${submittedServiceData.tier.title}` : 
                  submittedServiceData.title}
              </span>
            </p>
            <p className="text-2xl font-bold text-white mt-2">
              ${submittedServiceData.combinedPrice || submittedServiceData.price}
              {(submittedServiceData.tier?.isRecurring || submittedServiceData.isRecurring) && <span className="text-lg text-gray-400">/month</span>}
            </p>
          </div>

          {!consultationSubmitted ? (
            <div className="cyber-card">
              <h3 className="text-xl font-semibold text-cyan-400 mb-6">
                Let's discuss your project
              </h3>
              
              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <textarea
                  placeholder="Brief summary of your website idea (optional)"
                  value={customerInfo.projectIdea}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, projectIdea: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                />
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowConsultationForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Back to Services
                  </button>
                  <button
                    type="submit"
                    className="flex-1 neon-button neon-button-cyan"
                  >
                    Request Consultation
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="cyber-card text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-400 mb-4">
                  Consultation Requested!
                </h3>
                <p className="text-gray-300 mb-6">
                  We'll contact you within 24 hours to discuss your project and answer any questions.
                </p>

                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Ready to move forward?
                  </h4>
                  <p className="text-gray-400 mb-6 text-sm">
                    While we recommend a consultation first, you can also purchase your selected service now if you're ready to proceed.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setShowConsultationForm(false)}
                      className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Browse More Services
                    </button>
                    <button
                      onClick={() => handlePurchaseNow(submittedServiceData)}
                      className="flex-1 neon-button neon-button-purple"
                    >
                      Purchase Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (showCheckoutForm) {
    return (
      <section className="min-h-screen px-6 pt-24 pb-12">
        <div className="container mx-auto max-w-2xl">
          <StripeCheckoutForm
            serviceData={submittedServiceData}
            customerInfo={customerInfo}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-6 pt-24 pb-12">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose from our comprehensive packages designed to bring your digital vision to life
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <div key={service.id} className="cyber-card">
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-2xl font-bold text-${service.color}-400`}>
                  {service.title}
                </h3>
                <span className="text-3xl font-bold text-white">${service.price}</span>
              </div>
              
              <p className="text-gray-300 mb-6">{service.description}</p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <span className={`text-${service.color}-400 mr-2`}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleServiceClick(service)}
                className={`neon-button neon-button-${service.color} w-full`}
              >
                Get Free Consultation
              </button>
            </div>
          ))}
        </div>

        {/* Get Started Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowGetStartedModal(true)}
            className="neon-button neon-button-cyan"
          >
            Payments
          </button>
        </div>

        {/* Maintenance Tiers */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-white">
            Add Ongoing Maintenance
          </h3>
          <p className="text-gray-300">
            Keep your website running smoothly with our maintenance plans
          </p>
        </div>

        <div className="flex justify-center">
          {maintenanceTiers.map((tier) => (
            <div key={tier.id} className="cyber-card">
              <div className="text-center mb-6">
                <h4 className={`text-xl font-bold text-${tier.color}-400 mb-2`}>
                  {tier.title}
                </h4>
                <div className="text-3xl font-bold text-white mb-2">
                  ${tier.price}<span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="text-gray-300">{tier.description}</p>
              </div>
              
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300 text-sm">
                    <span className={`text-${tier.color}-400 mr-2`}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleServiceClick(null, tier)}
                className={`neon-button neon-button-${tier.color} w-full`}
              >
                Get Free Consultation
              </button>
            </div>
          ))}
        </div>

        {/* Get Started Modal */}
        {showGetStartedModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Get Started</h2>
              <div className="space-y-4">
                <div className="cyber-card p-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Deposit</h3>
                  <p className="text-gray-300 mb-4">Amount: $500</p>
                  <button
                    className="neon-button neon-button-cyan w-full"
                    onClick={() => {
                      setShowGetStartedModal(false);
                      handlePurchaseNow({ title: "Deposit", price: 500, id: "deposit" });
                    }}
                  >
                    Purchase Deposit
                  </button>
                </div>
                <div className="cyber-card p-4">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Final Payment</h3>
                  <p className="text-gray-300 mb-4">Amount: $500</p>
                  <button
                    className="neon-button neon-button-purple w-full"
                    onClick={() => {
                      setShowGetStartedModal(false);
                      handlePurchaseNow({ title: "Final Payment", price: 500, id: "final-payment" });
                    }}
                  >
                    Purchase Final Payment
                  </button>
                </div>
                <div className="cyber-card p-4">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Final Payment (2)</h3>
                  <p className="text-gray-300 mb-4">Amount: $1500</p>
                  <button
                    className="neon-button neon-button-green w-full"
                    onClick={() => {
                      setShowGetStartedModal(false);
                      handlePurchaseNow({ title: "Final Payment (2)", price: 1500, id: "final-payment-2" });
                    }}
                  >
                    Purchase Final Payment (2)
                  </button>
                </div>
              </div>
              <button
                className="mt-6 w-full border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setShowGetStartedModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
