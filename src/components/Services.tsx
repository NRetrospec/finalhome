import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { StripeCheckoutForm } from "./StripeCheckoutForm";

export function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: "", email: "" });
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
        "Basic SEO optimization"
      ],
      color: "cyan"
    },
    {
      id: "website-logo",
      title: "Website + Logo Design",
      price: 1500,
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
      id: "basic-maintenance",
      title: "Basic Maintenance",
      price: 100,
      description: "Essential updates and monitoring",
      features: [
        "Monthly security updates",
        "Basic performance monitoring",
        "Content updates (up to 2 hours/month)",
        "Email support",
        "Backup management"
      ],
      color: "green",
      isRecurring: true
    },
    {
      id: "pro-maintenance",
      title: "Pro Maintenance",
      price: 250,
      description: "Enhanced support and optimization",
      features: [
        "Everything in Basic",
        "Weekly performance reports",
        "Content updates (up to 5 hours/month)",
        "Priority support",
        "SEO monitoring",
        "Analytics reporting"
      ],
      color: "blue",
      isRecurring: true
    },
    {
      id: "oncall-maintenance",
      title: "On-Call Support",
      price: 500,
      description: "24/7 support and unlimited updates",
      features: [
        "Everything in Pro",
        "24/7 emergency support",
        "Unlimited content updates",
        "Custom feature development",
        "Advanced analytics",
        "Dedicated account manager"
      ],
      color: "pink",
      isRecurring: true
    }
  ];

  const handleServiceClick = (service: any, tier?: any) => {
    const serviceData = tier ? { ...service, tier, combinedPrice: service.price + tier.price } : service;
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
      await submitConsultation({
        name: customerInfo.name,
        email: customerInfo.email,
        message: `Interested in ${submittedServiceData.tier ? 
          `${submittedServiceData.title} + ${submittedServiceData.tier.title}` : 
          submittedServiceData.title}. ${customerInfo.email}`,
        service: submittedServiceData.tier ? 
          `${submittedServiceData.title} + ${submittedServiceData.tier.title}` : 
          submittedServiceData.title,
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

  const handlePurchaseNow = (serviceData: any) => {
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
              {submittedServiceData.tier?.isRecurring && <span className="text-lg text-gray-400">/month</span>}
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
          ) : showCheckoutForm ? (
            <StripeCheckoutForm
              serviceData={submittedServiceData}
              customerInfo={customerInfo}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
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

        {/* Maintenance Tiers */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 text-white">
            Add Ongoing Maintenance
          </h3>
          <p className="text-gray-300">
            Keep your website running smoothly with our maintenance plans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                onClick={() => {
                  const baseService = services[0];
                  handleServiceClick(baseService, tier);
                }}
                className={`neon-button neon-button-${tier.color} w-full`}
              >
                Get Free Consultation
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
