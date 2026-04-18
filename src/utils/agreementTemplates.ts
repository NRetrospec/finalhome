export interface AgreementData {
  clientName: string;
  agreementType: "standard" | "discounted";
  price: string;
  timeline: string;
  hourlyRate?: string;
  customNotes?: string;
  createdAt: number;
}

export interface AgreementSection {
  type: "header" | "intro" | "section";
  title?: string;
  body?: string;
  bullets?: string[];
  note?: string;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getAgreementSections(data: AgreementData): AgreementSection[] {
  const date = formatDate(data.createdAt);
  const customNotesSection: AgreementSection[] = data.customNotes
    ? [{ type: "section", title: "Additional Notes", body: data.customNotes }]
    : [];

  if (data.agreementType === "discounted") {
    return [
      { type: "header", title: "SERVICE AGREEMENT (DISCOUNTED PROJECT)" },
      {
        type: "intro",
        body: `This Agreement is made between N Retrospec ("Developer") and ${data.clientName} ("Client") on ${date}.`,
      },
      {
        type: "section",
        title: "1. Scope of Work",
        body: "Developer agrees to create a basic website/web application. The project may include:",
        bullets: [
          "Frontend design and development",
          "Basic backend functionality (if applicable)",
          "Deployment of the website",
        ],
        note: "Any features not specifically discussed are not included.",
      },
      {
        type: "section",
        title: "2. Discounted Rate",
        body: `Client acknowledges this project is being completed at a heavily discounted rate of ${data.price}, which is below standard pricing.`,
      },
      {
        type: "section",
        title: "3. Payment Terms",
        bullets: [`Full payment of ${data.price} is due upfront before work begins.`],
      },
      {
        type: "section",
        title: "4. Revisions",
        bullets: [
          "Includes up to 2 minor revisions",
          "Additional changes or new features may require extra payment",
        ],
      },
      {
        type: "section",
        title: "5. Timeline",
        bullets: [
          `Estimated completion: ${data.timeline}`,
          "Timeline depends on client providing timely feedback and content",
        ],
      },
      {
        type: "section",
        title: "6. Scope Changes",
        body: "Any work outside the original scope may:",
        bullets: ["Be declined, or", "Require additional charges and timeline adjustments"],
      },
      {
        type: "section",
        title: "7. Ownership",
        bullets: [
          "Client receives full rights to the final product after full payment",
          "Developer retains the right to reuse general, non-proprietary code and display the project in a portfolio",
        ],
      },
      {
        type: "section",
        title: "8. Support",
        bullets: ["Includes 7 days of bug fixes after delivery", "Ongoing maintenance is not included"],
      },
      {
        type: "section",
        title: "9. Termination",
        bullets: [
          "Either party may terminate this agreement",
          "Payment is non-refundable once work has started",
        ],
      },
      {
        type: "section",
        title: "10. Liability",
        body: "Developer is not responsible for:",
        bullets: [
          "Third-party issues (hosting, APIs, platforms)",
          "Any indirect or business-related losses",
        ],
      },
      ...customNotesSection,
      {
        type: "section",
        title: "11. Agreement",
        body: "By signing below, both parties agree to the terms of this agreement.",
      },
    ];
  }

  // Standard agreement
  return [
    { type: "header", title: "SERVICE AGREEMENT (STANDARD PROJECT)" },
    {
      type: "intro",
      body: `This Agreement is made between N Retrospec ("Developer") and ${data.clientName} ("Client") on ${date}.`,
    },
    {
      type: "section",
      title: "1. Scope of Work",
      body: "Developer agrees to design and develop a custom full-stack website/web application, which may include:",
      bullets: [
        "Frontend UI/UX development",
        "Backend development and database setup",
        "API integrations (if applicable)",
        "Deployment",
      ],
      note: "Specific features will be outlined and agreed upon before development begins.",
    },
    {
      type: "section",
      title: "2. Project Fee",
      body: `Total project cost: ${data.price}`,
    },
    {
      type: "section",
      title: "3. Payment Terms",
      bullets: ["50% upfront before work begins", "50% due before final delivery"],
      note: "Failure to complete payment may result in immediate work stoppage and withholding of final files, code, and deployment.",
    },
    {
      type: "section",
      title: "4. Timeline",
      bullets: [
        `Estimated completion: ${data.timeline}`,
        "Client feedback required within 3 business days",
        "Timely delivery of required content and assets",
      ],
      note: "Client delays may extend the project timeline.",
    },
    {
      type: "section",
      title: "5. Revisions",
      bullets: [
        "Includes 3 rounds of revisions",
        data.hourlyRate
          ? `Additional revisions or new features will be billed at ${data.hourlyRate}/hour`
          : "Additional revisions or new features will be billed at an agreed hourly rate",
      ],
    },
    {
      type: "section",
      title: "6. Scope Changes",
      body: "Any requests outside the agreed scope will:",
      bullets: ["Require additional charges", "Extend the project timeline"],
      note: "No extra work will begin without client approval.",
    },
    {
      type: "section",
      title: "7. Client Responsibilities",
      body: "Client agrees to:",
      bullets: [
        "Provide all necessary content, images, and information",
        "Respond to requests in a timely manner",
        "Supply access to any required accounts or services",
      ],
    },
    {
      type: "section",
      title: "8. Ownership",
      bullets: [
        "Full ownership is transferred to the Client only after full payment is received",
        "Developer retains the right to reuse general code and showcase the project in a portfolio",
      ],
    },
    {
      type: "section",
      title: "9. Support & Maintenance",
      bullets: [
        "Includes 14 days of post-launch bug fixes",
        "Ongoing support or maintenance is not included unless agreed separately",
      ],
    },
    {
      type: "section",
      title: "10. Termination",
      bullets: [
        "Either party may terminate this agreement",
        "Deposit is non-refundable",
        "Client is responsible for payment of all work completed up to termination",
      ],
    },
    {
      type: "section",
      title: "11. Liability",
      body: "Developer is not liable for:",
      bullets: [
        "Third-party failures (hosting providers, APIs, etc.)",
        "Loss of revenue, data, or business opportunities",
      ],
    },
    {
      type: "section",
      title: "12. Governing Law",
      body: "This Agreement shall be governed by the laws of the State of Florida.",
    },
    ...customNotesSection,
    {
      type: "section",
      title: "13. Agreement",
      body: "By signing below, both parties agree to the terms of this agreement.",
    },
  ];
}
