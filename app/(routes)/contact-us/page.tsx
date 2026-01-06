import React from "react";
import { Mail, MessageCircle, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactUsPage() {
  const contactMethods = [
    {
      id: 1,
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat with us instantly",
      value: "+91 98765 43210",
      action: "Message Us",
      link: "https://wa.me/+919990343789",
      color: "from-[#25D366] to-[#128C7E]",
    },
    {
      id: 2,
      icon: Mail,
      title: "Email",
      description: "Send us your queries",
      value: "support@company.com",
      action: "Send Email",
      link: "mailto:support@favobliss.com",
      color: "from-[#ee9320] to-[#d67d0f]",
    },
  ];

  const additionalInfo = [
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Monday - Saturday: 9:00 AM - 6:00 PM", "Sunday: Closed"],
    },
    {
      icon: MapPin,
      title: "Address",
      details: [
        "123 Business Street",
        "Meerut, Uttar Pradesh",
        "India - 250001",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#ee9320] to-[#d67d0f] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Get In Touch</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            We&apos;re here to help! Reach out to us through WhatsApp or Email
            for quick assistance.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <a
                key={method.id}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 group border-2 border-transparent hover:border-[#ee9320]"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-6 rounded-full bg-gradient-to-br ${method.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black mb-2">
                      {method.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{method.description}</p>
                    <p className="text-lg font-semibold text-[#ee9320] mb-4">
                      {method.value}
                    </p>
                    <button className="bg-[#ee9320] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#d67d0f] transition-colors duration-300 flex items-center gap-2 mx-auto group-hover:gap-3">
                      {method.action}
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {additionalInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-full bg-[#ee9320]/10">
                      <Icon className="w-6 h-6 text-[#ee9320]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black mb-3">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 mb-1">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Response Banner */}
      <div className="bg-gradient-to-r from-black to-gray-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Phone className="w-12 h-12 text-[#ee9320] mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">
            Need Immediate Assistance?
          </h2>
          <p className="text-gray-300 mb-6">
            Our team typically responds within 1-2 hours during working hours
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ee9320] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d67d0f] transition-colors duration-300 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Now
            </a>
            <a
              href="mailto:support@company.com"
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </div>

      {/* Why Contact Us Section */}
      {/* <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            Why Choose Our Support?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quick Response",
                description: "Get answers to your queries within hours",
                icon: "⚡",
              },
              {
                title: "Expert Team",
                description: "Knowledgeable staff ready to assist",
                icon: "👥",
              },
              {
                title: "Multiple Channels",
                description: "Contact us via your preferred method",
                icon: "📱",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#ee9320]/5 to-transparent hover:from-[#ee9320]/10 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}
