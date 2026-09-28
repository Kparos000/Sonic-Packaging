// Seed script — creates the 8 fixed roles, one Super Admin login, the
// default site settings, and the CONFIRMED content from the build brief
// (never invented facts — see src/lib/placeholder.ts). Run with:
//   npx prisma db seed
// (wired up in prisma.config.ts -> migrations.seed).
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ROLE_KEYS, ROLE_LABELS, ROLE_DESCRIPTIONS } from "../src/lib/roles";
import { SITE_SETTINGS } from "../src/lib/constants";
import { containsPlaceholder, CEO_PLACEHOLDER } from "../src/lib/placeholder";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helper: publish a page section in one call — creates the ContentVersion,
// then points PageSection.publishedVersionId at it. Mirrors exactly what
// the admin "Publish" action will do later (see task #109).
// ---------------------------------------------------------------------------
async function publishSection(
  pageId: string,
  key: string,
  order: number,
  data: Prisma.InputJsonValue,
  editorId: string
) {
  const section = await prisma.pageSection.upsert({
    where: { pageId_key: { pageId, key } },
    update: { order },
    create: { pageId, key, order },
  });

  const version = await prisma.contentVersion.create({
    data: {
      sectionId: section.id,
      status: "PUBLISHED",
      data,
      // Computed the same way on every real save (see the field's comment
      // in schema.prisma) — the seed script isn't a special case.
      needsConfirmation: containsPlaceholder(data),
      editorId,
    },
  });

  await prisma.pageSection.update({
    where: { id: section.id },
    data: { publishedVersionId: version.id },
  });
}

async function main() {
  console.log("Seeding roles...");
  const roles = new Map<string, string>();
  for (const key of ROLE_KEYS) {
    const role = await prisma.role.upsert({
      where: { key },
      update: { name: ROLE_LABELS[key], description: ROLE_DESCRIPTIONS[key] },
      create: { key, name: ROLE_LABELS[key], description: ROLE_DESCRIPTIONS[key] },
    });
    roles.set(key, role.id);
  }

  console.log("Seeding first Super Admin user...");
  const seedName = process.env.SEED_SUPER_ADMIN_NAME ?? "Sonic Admin";
  const seedEmail = process.env.SEED_SUPER_ADMIN_EMAIL;
  const seedPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;
  if (!seedEmail || !seedPassword) {
    throw new Error(
      "SEED_SUPER_ADMIN_EMAIL and SEED_SUPER_ADMIN_PASSWORD must be set (see .env.example) before seeding."
    );
  }
  const passwordHash = await bcrypt.hash(seedPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: seedEmail },
    update: {},
    create: {
      name: seedName,
      email: seedEmail,
      passwordHash,
      roleId: roles.get("SUPER_ADMIN")!,
    },
  });

  console.log("Seeding default site settings...");
  await prisma.siteSetting.upsert({
    where: { key: SITE_SETTINGS.PRODUCTION_MODE },
    update: {},
    // Safe default: OFF, so [CEO CONFIRMATION REQUIRED] placeholders stay
    // visible to editors until someone deliberately flips this on.
    create: { key: SITE_SETTINGS.PRODUCTION_MODE, value: false, updatedById: admin.id },
  });

  // ---------------------------------------------------------------------
  // Pages + sections + published content — verbatim from the build brief
  // (sections 13-15), with "Sonic Plastics"/"Sonic Cartons" written as the
  // plain category labels "Plastics"/"Cartons" per the Brand Guidelines'
  // naming rule (no category is ever given its own brand identity).
  // ---------------------------------------------------------------------
  console.log("Seeding Home page content...");
  const home = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: { slug: "home", title: "Home" },
  });

  await publishSection(
    home.id,
    "hero",
    1,
    {
      eyebrow: "Sonic Packaging",
      heading: "Engineering the packaging that moves African industry.",
      body: "From our manufacturing base in Benin City, Sonic Packaging produces plastic packaging for industry today while building the capabilities, technology and operating systems for a broader African packaging platform.",
      ctaLabel: "Explore Our Capabilities",
      ctaHref: "/capabilities",
      secondaryCtaLabel: "Request a Quote",
      secondaryCtaHref: "/request-a-quote",
    },
    admin.id
  );

  await publishSection(
    home.id,
    "who-we-are",
    2,
    {
      eyebrow: "Who We Are",
      heading: "Built on manufacturing. Built for what comes next.",
      body: "Sonic Packaging is a Nigerian packaging manufacturer built on the foundation of our existing plastics manufacturing operations in Benin City.\n\nToday, we manufacture rigid plastic packaging serving the paint and coatings industry. We are expanding our plastics capabilities into food and beverage packaging, including PET bottles and caps for packaged water, while developing the foundations for future corrugated packaging.\n\nOur ambition is bigger than adding production lines. We are building a diversified, technology-enabled packaging company designed to serve customers across products, industries and, over time, African markets.",
      ctaLabel: "Our Story",
      ctaHref: "/about#our-story",
    },
    admin.id
  );

  await publishSection(
    home.id,
    "capabilities-teaser",
    3,
    {
      heading: "Packaging built around industry.",
      items: [
        {
          status: "CURRENT",
          heading: "Paint & Coatings Packaging",
          body: "Rigid plastic packaging manufactured from our existing Benin City operations for customers in the paint and coatings industry.",
        },
        {
          status: "IN_DEVELOPMENT",
          heading: "PET Bottles & Closures",
          body: "We are expanding our plastics manufacturing capability into PET bottles and caps/closures for packaged water.",
        },
        {
          status: "IN_DEVELOPMENT",
          heading: "Food Packaging Solutions",
          body: "Our expansion into food packaging is designed to extend Sonic's manufacturing capabilities into a broader range of food-grade packaging applications.",
        },
        {
          status: "FUTURE",
          heading: "Corrugated Packaging",
          body: "Through a planned cartons business, we intend to add corrugated and paper-based packaging alongside our plastics operations.",
        },
      ],
    },
    admin.id
  );

  await publishSection(
    home.id,
    "manufacturing",
    4,
    {
      heading: "Where strategy becomes product.",
      body: "Manufacturing is the foundation of Sonic Packaging.\n\nFrom raw material through production, inspection, storage and dispatch, we are building our operating system around safety, quality, repeatability, efficiency and continuous improvement.\n\nAs Sonic expands into new packaging categories, the same operating discipline will follow every new line and facility.",
      ctaLabel: "How We Operate",
      ctaHref: "/operations",
    },
    admin.id
  );

  await publishSection(
    home.id,
    "technology",
    5,
    {
      heading: "Better manufacturing starts with better information.",
      body: "For Sonic Packaging, technology is not separate from manufacturing. It is how we intend to make manufacturing more visible, measurable and increasingly intelligent.\n\nOur transformation begins with the fundamentals: digitising operational processes, improving how production and commercial data are captured, connecting information across the business and giving decision-makers clearer visibility into performance.\n\nAs our data foundation matures, we intend to progressively introduce automation, connected manufacturing systems, advanced analytics, machine learning for areas such as demand forecasting and predictive maintenance, and AI-assisted decision intelligence.\n\nThe objective is simple: better information, better decisions and better manufacturing.",
      ctaLabel: "Technology at Sonic",
      ctaHref: "/operations",
    },
    admin.id
  );

  await publishSection(
    home.id,
    "quality-safety",
    6,
    {
      heading: "Quality at source. Safety before output.",
      body: "At Sonic Packaging, quality and safety are operating disciplines.\n\nOur principle is that quality should be created during production, not inspected into the product afterwards — and that no production target justifies an unsafe action.\n\nAs our manufacturing platform grows, we are building the processes, controls, testing practices and operating standards required to deliver consistent packaging and protect our people, customers and products.",
    },
    admin.id
  );

  await publishSection(
    home.id,
    "facilities",
    7,
    {
      eyebrow: "Facilities",
      heading: "Built in Benin City.",
      body: "Sonic Packaging currently operates from two locations in Benin City, Edo State — our Corporate Office & Utesi Manufacturing Complex and our Ikpoba Hill Production Facility.\n\nThese operations provide the manufacturing foundation from which Sonic is expanding into new products, technologies and markets.",
      items: [
        { heading: "Corporate Office & Utesi Manufacturing Complex" },
        { heading: "Ikpoba Hill Production Facility" },
      ],
    },
    admin.id
  );

  await publishSection(
    home.id,
    "customers",
    8,
    {
      heading: "Packaging is part of our customers' product.",
      body: "We manufacture primarily for other businesses. That means understanding customer requirements, protecting their brands and delivering packaging they can confidently build their own operations around.",
    },
    admin.id
  );

  await publishSection(
    home.id,
    "responsibility",
    9,
    {
      heading: "Growth must be built responsibly.",
      body: "As Sonic Packaging grows, we believe the way we manufacture matters alongside what we manufacture.\n\nWe are developing our approach around responsible material use, waste reduction, safe workplaces, accountable governance and measurable environmental performance.\n\nOur objective is not to make claims ahead of the evidence, but to progressively measure, improve and report the impact of our operations.",
    },
    admin.id
  );

  await publishSection(
    home.id,
    "people",
    10,
    {
      heading: "Behind every machine are people.",
      body: "Manufacturing is ultimately a human system.\n\nMeet some of the people who operate our machines, maintain our facilities, manage quality, serve our customers and build Sonic Packaging every day.",
      ctaLabel: "Meet Our People",
      ctaHref: "/about#leadership",
    },
    admin.id
  );

  await publishSection(
    home.id,
    "final-cta",
    11,
    {
      heading: "What can we manufacture for you?",
      body: "Whether you are looking for an existing packaging solution or want to discuss a future requirement, talk to our team.",
      ctaLabel: "Request a Quote",
      ctaHref: "/request-a-quote",
      secondaryCtaLabel: "Contact Sonic Packaging",
      secondaryCtaHref: "/contact",
    },
    admin.id
  );

  console.log("Seeding About page content...");
  const about = await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: { slug: "about", title: "About" },
  });

  await publishSection(
    about.id,
    "hero",
    1,
    {
      heading: "From a plastics manufacturer to a packaging platform.",
      body: "Sonic Packaging is the evolution of an existing Nigerian manufacturing business into a diversified packaging company built around quality manufacturing, intelligent technology and sustainable growth.",
    },
    admin.id
  );

  await publishSection(
    about.id,
    "our-company",
    2,
    {
      eyebrow: "Our Company",
      heading: "Sonic Packaging Industries Limited",
      body: "Sonic Packaging Industries Limited is a packaging manufacturing company based in Benin City, Edo State, Nigeria.\n\nOur manufacturing foundation is our existing plastics operation, from which the wider Sonic Packaging platform is being built.\n\nToday, our core production serves the paint and coatings industry. Our next phase extends our plastics capabilities into PET bottles and closures for packaged water and food packaging, followed by planned diversification into corrugated and paper-based packaging as a future cartons category.\n\nWe are building one company capable of serving customers across multiple packaging categories without losing the manufacturing discipline on which the business was founded.",
    },
    admin.id
  );

  await publishSection(
    about.id,
    "our-story",
    3,
    {
      eyebrow: "Our Story",
      heading: "We didn't walk away from our roots. We're building on them.",
      body: "Sonic Packaging begins with our plastics manufacturing roots.\n\nThe existing plastics operation in Benin City created the manufacturing foundation, customer relationships, operational knowledge and commercial base on which the wider company is being built.\n\nBut the future of the business extends beyond one material, one product category or one facility.\n\nSonic Packaging was created to bring plastics, cartons and future packaging categories together under one company — with shared standards for quality, safety, technology, customer service and operational discipline.\n\nFrom Benin City, we are building outward.",
    },
    admin.id
  );

  await publishSection(
    about.id,
    "mission",
    4,
    {
      heading: "Mission & Vision",
      items: [
        {
          heading: "Vision",
          body: "To become Africa's most trusted and innovative packaging company.",
        },
        {
          heading: "Mission",
          body: "To transform African packaging through quality manufacturing, intelligent technology and sustainable solutions built around our customers.",
        },
      ],
    },
    admin.id
  );

  await publishSection(
    about.id,
    "values",
    5,
    {
      eyebrow: "S.O.N.I.C.",
      heading: "Our Values",
      items: [
        { heading: "S — Safety First", body: "We protect our people, customers, products and environment before everything else." },
        { heading: "O — Ownership", body: "We take responsibility for our work, our decisions and our results." },
        { heading: "N — Never Compromise on Quality", body: "Every product carrying the Sonic Packaging name must meet the standards we promise." },
        { heading: "I — Innovate Relentlessly", body: "We continuously improve how we manufacture, serve customers and use technology." },
        { heading: "C — Customer Obsessed", body: "We succeed when our customers succeed." },
      ],
    },
    admin.id
  );

  await publishSection(
    about.id,
    "tenets",
    6,
    {
      heading: "Eight Operating Tenets",
      items: [
        { heading: "1. Safety Before Output", body: "No production target justifies an unsafe action." },
        { heading: "2. Quality at Source", body: "Quality is created during production, not inspected into the product afterwards." },
        { heading: "3. The Customer Defines Value", body: "Operations ultimately exist to solve customer problems." },
        { heading: "4. Standardize Before Automating", body: "Broken processes should never simply be digitized." },
        { heading: "5. If It Matters, Measure It", body: "Important decisions progressively move from opinion to evidence." },
        { heading: "6. Fix Root Causes, Not Symptoms", body: "Recurring problems require permanent corrective action." },
        { heading: "7. Every Naira Must Create Value", body: "Capital, inventory, labour and technology must earn their place." },
        { heading: "8. Improve Every Day", body: "Every employee is empowered to identify waste and suggest improvements." },
      ],
    },
    admin.id
  );

  console.log("Seeding Capabilities page + Capability/Product records...");
  const capabilitiesPage = await prisma.page.upsert({
    where: { slug: "capabilities" },
    update: {},
    create: { slug: "capabilities", title: "Capabilities" },
  });

  await publishSection(
    capabilitiesPage.id,
    "hero",
    1,
    {
      heading: "One manufacturing foundation. A growing packaging platform.",
      body: "Sonic Packaging is expanding from its established rigid plastics manufacturing base into additional plastic and paper-based packaging categories.\n\nWe distinguish clearly between what we manufacture today, what is currently being developed and what forms part of our future expansion.",
    },
    admin.id
  );

  const plastics = await prisma.capability.upsert({
    where: { slug: "plastics" },
    update: {},
    create: {
      slug: "plastics",
      name: "Plastics",
      status: "CURRENT",
      summary:
        "Paint and coatings packaging forms the foundation of Sonic Packaging's manufacturing operations.",
      description:
        "Through our plastics manufacturing operations, we manufacture rigid plastic packaging for customers in the paint and coatings industry from our operations in Benin City.\n\nOur focus is consistent manufacturing, product quality, dependable supply and continuous improvement.",
      isPublished: true,
      order: 1,
    },
  });

  await prisma.product.upsert({
    where: { slug: "pet-bottles-closures" },
    update: {},
    create: {
      capabilityId: plastics.id,
      name: "PET Bottles & Closures",
      slug: "pet-bottles-closures",
      division: "Plastics",
      status: "IN_DEVELOPMENT",
      summary:
        "Sonic Packaging is expanding its plastics manufacturing platform into PET packaging for the packaged-water industry.",
      description:
        "The planned capability will include PET bottles and matching caps/closures, extending our existing plastics manufacturing experience into food and beverage packaging. The expansion is part of a broader strategy to serve customers across more of their packaging requirements while applying the same operating principles of safety, quality, efficiency and customer focus.\n\nBottle sizes, neck finishes, manufacturing process, production capacity and food-contact certification are not yet confirmed.",
      isPublished: true,
      order: 1,
    },
  });

  await prisma.capability.upsert({
    where: { slug: "food-packaging" },
    update: {},
    create: {
      slug: "food-packaging",
      name: "Food Packaging",
      status: "IN_DEVELOPMENT",
      summary:
        "Sonic Packaging intends to expand into packaging solutions for Nigeria's food industry as part of the next stage of its manufacturing growth.",
      description:
        "The objective is to build packaging capabilities that combine product protection, manufacturing consistency, food-safety requirements and dependable supply.",
      isPublished: true,
      order: 2,
    },
  });

  await prisma.capability.upsert({
    where: { slug: "cartons" },
    update: {},
    create: {
      slug: "cartons",
      name: "Cartons",
      status: "FUTURE",
      summary:
        "Cartons represents Sonic Packaging's planned expansion into corrugated and paper-based packaging.",
      description:
        "The business is intended to operate alongside our plastics operations rather than replace them — allowing Sonic Packaging over time to serve customers across both primary and secondary packaging requirements.\n\nThe new operation will be commissioned to the same quality and safety discipline as the existing manufacturing business.",
      isPublished: true,
      order: 3,
    },
  });

  console.log("Seeding Facilities...");
  await prisma.facility.upsert({
    where: { slug: "corporate-office-utesi" },
    update: {},
    create: {
      slug: "corporate-office-utesi",
      name: "Corporate Office & Utesi Manufacturing Complex",
      location: "Benin City, Edo State",
      address: "Sonic Packaging\nKm 2 Utesi Road\nOff Benin Bypass\nBenin City, Edo State\nNigeria",
      phone: "+234 913 307 3297",
      email: "contact@sonicpackaging.com",
      isHeadquarters: true,
      isPublished: true,
      order: 1,
    },
  });
  await prisma.facility.upsert({
    where: { slug: "ikpoba-hill-production" },
    update: {},
    create: {
      slug: "ikpoba-hill-production",
      name: "Ikpoba Hill Production Facility",
      location: "Benin City, Edo State",
      address: "10 Omougowe Street\nIkpoba Hill\nBenin City, Edo State\nNigeria",
      isHeadquarters: false,
      isPublished: true,
      order: 2,
    },
  });

  console.log("Seeding Contact page content...");
  const contactPage = await prisma.page.upsert({
    where: { slug: "contact" },
    update: {},
    create: { slug: "contact", title: "Contact" },
  });

  await publishSection(
    contactPage.id,
    "hero",
    1,
    {
      heading: "Let's talk packaging.",
      body: "Whether you want to discuss a packaging requirement, request a quote, explore a supplier relationship, contact our corporate team or simply learn more about Sonic Packaging, we'd like to hear from you.",
    },
    admin.id
  );

  console.log("Seeding Request a Quote page content...");
  const quotePage = await prisma.page.upsert({
    where: { slug: "request-a-quote" },
    update: {},
    create: { slug: "request-a-quote", title: "Request a Quote" },
  });

  await publishSection(
    quotePage.id,
    "hero",
    1,
    {
      heading: "Request a Quote",
      body: "Tell us about your packaging requirement and our commercial team will follow up with a formal quote.",
    },
    admin.id
  );

  console.log("Seeding Operations page content...");
  const operationsPage = await prisma.page.upsert({
    where: { slug: "operations" },
    update: {},
    create: { slug: "operations", title: "Operations" },
  });

  await publishSection(
    operationsPage.id,
    "hero",
    1,
    {
      eyebrow: "Operations",
      heading: "Manufacturing is our foundation.",
      body: "We manufacture packaging.\n\nToday, our production is centred on rigid plastic packaging for the paint and coatings industry.\n\nWe are expanding that manufacturing base into PET bottles and closures for packaged water and into food packaging, with corrugated packaging planned as a future diversification.\n\nAcross every expansion, our principle remains the same: new capacity must strengthen the operating system rather than outgrow it.",
    },
    admin.id
  );

  await publishSection(
    operationsPage.id,
    "technology",
    2,
    {
      eyebrow: "Technology",
      heading: "From digitised operations to intelligent manufacturing.",
      body: "Sonic Packaging's technology strategy starts with a simple principle: standardize before automating.\n\nWe are progressively building a digital operating foundation across the company.",
      items: [
        {
          heading: "1. Digitise",
          body: "Digitise critical operational processes including production, inventory, sales, quality, maintenance, procurement, finance and people operations.",
        },
        {
          heading: "2. Connect",
          body: "Progressively connect ERP/MRP, CRM, warehouse, manufacturing, quality and maintenance systems.",
        },
        {
          heading: "3. Measure",
          body: "Build visibility around OEE, scrap, downtime, quality, OTIF, lead time, energy per unit, labour productivity, inventory and working capital.",
        },
        {
          heading: "4. Predict",
          body: "As reliable data becomes available, explore machine learning for demand forecasting, inventory planning, predictive maintenance, quality trends and production planning.",
        },
        {
          heading: "5. Assist Decisions",
          body: "Progressively introduce AI-assisted decision intelligence that helps management interpret operational information, identify exceptions and make better-informed decisions.",
        },
      ],
    },
    admin.id
  );

  await publishSection(
    operationsPage.id,
    "technology-principle",
    3,
    { heading: "Technology does not replace manufacturing discipline. It strengthens it." },
    admin.id
  );

  await publishSection(
    operationsPage.id,
    "supply-chain",
    4,
    {
      eyebrow: "Supply Chain",
      heading: "From materials to customer.",
      body: "Our supply chain connects raw materials, production planning, inventory, warehousing and delivery.\n\nAs Sonic Packaging expands, we are strengthening this system around visibility, supplier reliability, inventory discipline, customer requirements and continuity of supply.\n\nOur objective is to build a supply chain customers can confidently plan around.",
    },
    admin.id
  );

  // Kept as its own section (rather than appended to "supply-chain" above)
  // so the confirmed copy above always renders even once PRODUCTION_MODE
  // is on — only this section, which is nothing but the placeholder, gets
  // hidden then. See src/lib/content/get-page-content.ts.
  await publishSection(
    operationsPage.id,
    "supply-chain-notes",
    5,
    { heading: "Additional Detail", body: CEO_PLACEHOLDER },
    admin.id
  );

  await publishSection(
    operationsPage.id,
    "facilities-notes",
    6,
    { heading: "Detailed Facility Information", body: CEO_PLACEHOLDER },
    admin.id
  );

  console.log("Seeding Quality & Safety page content...");
  const qualitySafetyPage = await prisma.page.upsert({
    where: { slug: "quality-safety" },
    update: {},
    create: { slug: "quality-safety", title: "Quality & Safety" },
  });

  await publishSection(
    qualitySafetyPage.id,
    "hero",
    1,
    {
      heading: "Quality at source. Safety before output.",
      body: "At Sonic Packaging, quality and safety are operating disciplines.\n\nOur principle is that quality should be created during production, not inspected into the product afterwards — and that no production target justifies an unsafe action.\n\nAs our manufacturing platform grows, we are building the processes, controls, testing practices and operating standards required to deliver consistent packaging and protect our people, customers and products.",
    },
    admin.id
  );

  await publishSection(
    qualitySafetyPage.id,
    "pillars",
    2,
    {
      heading: "How we approach it.",
      items: [
        {
          heading: "Quality Assurance",
          body: "Consistent, repeatable checks built into each stage of production, not applied only at the end of the line.",
        },
        {
          heading: "Manufacturing Standards",
          body: "Defined operating standards for how each process should run, so quality depends on the process rather than on any one individual.",
        },
        {
          heading: "Testing",
          body: "Product testing practices designed to confirm packaging performs as intended before it reaches a customer.",
        },
        {
          heading: "Safety",
          body: "A safety-first culture where no production target justifies an unsafe action.",
        },
      ],
    },
    admin.id
  );

  // No Certification rows are seeded — "Do not invent certifications" (brief
  // section 17). This section is nothing but the placeholder, so it's
  // visible on the review site and automatically hidden once
  // PRODUCTION_MODE is on. Replace it with a real certifications list
  // (query the Certification table, brief fields: name/issuer/
  // certificate_number/issue_date/expiry_date/document/status/
  // public_visibility) once the first certification is confirmed and
  // entered through Admin.
  await publishSection(
    qualitySafetyPage.id,
    "certifications-notes",
    3,
    { heading: "Certifications", body: CEO_PLACEHOLDER },
    admin.id
  );

  console.log("Seeding ESG page content...");
  const esgPage = await prisma.page.upsert({
    where: { slug: "esg" },
    update: {},
    create: { slug: "esg", title: "ESG" },
  });

  await publishSection(
    esgPage.id,
    "hero",
    1,
    {
      heading: "Environment, Sustainability & Governance",
      body: "Growth must be responsible to endure.\n\nSonic Packaging's ESG approach is being built around measurable environmental performance, responsibility to people and communities, and disciplined corporate governance.\n\nWe will report progress based on evidence rather than broad sustainability claims.",
    },
    admin.id
  );

  // Flat topic lists per the brief — deliberately no invented metrics or
  // percentages ("Do not create fake ESG metrics", brief section 18).
  await publishSection(
    esgPage.id,
    "environment",
    2,
    {
      eyebrow: "Environment",
      heading: "Where we are focused.",
      items: [
        { heading: "Material Efficiency" },
        { heading: "Scrap Reduction" },
        { heading: "Reprocessing / Recycling" },
        { heading: "Energy Efficiency" },
        { heading: "Waste Management" },
        { heading: "Responsible Sourcing" },
      ],
    },
    admin.id
  );

  await publishSection(
    esgPage.id,
    "social",
    3,
    {
      eyebrow: "Social",
      heading: "Our people and communities.",
      items: [
        { heading: "Safe Work" },
        { heading: "Skills Development" },
        { heading: "Employee Development" },
        { heading: "Host Communities" },
      ],
    },
    admin.id
  );

  await publishSection(
    esgPage.id,
    "governance",
    4,
    {
      eyebrow: "Governance",
      heading: "How we intend to govern this growth.",
      items: [
        { heading: "Accountability" },
        { heading: "Defined Authority" },
        { heading: "Financial Discipline" },
        { heading: "Compliance" },
        { heading: "Risk Management" },
        { heading: "Ethical Conduct" },
        { heading: "Measurement" },
        { heading: "Reporting" },
      ],
    },
    admin.id
  );

  console.log("Seeding CSR page content...");
  const csrPage = await prisma.page.upsert({
    where: { slug: "csr" },
    update: {},
    create: { slug: "csr", title: "CSR" },
  });

  await publishSection(
    csrPage.id,
    "hero",
    1,
    {
      eyebrow: "CSR",
      heading: "Three pillars of community impact.",
      body: "As Sonic Packaging grows, we intend to build our social impact around three connected pillars: skills, community and environment.",
    },
    admin.id
  );

  await publishSection(
    csrPage.id,
    "pillars",
    2,
    {
      heading: "Skills. Community. Environment.",
      items: [
        {
          heading: "Skills for Industry",
          body: "Sonic Packaging intends to support technical apprenticeships and practical skills development that prepare young people for careers in manufacturing and industry.",
        },
        {
          heading: "Community",
          body: "Our factories exist within communities. We intend to develop targeted initiatives around the needs of the communities surrounding our operations rather than pursue disconnected one-off interventions.",
        },
        {
          heading: "Environment",
          body: "Sonic Packaging intends to explore partnerships around plastic collection, recycling and responsible material recovery as part of a broader approach to packaging sustainability.",
        },
      ],
    },
    admin.id
  );

  await publishSection(
    csrPage.id,
    "programme-notes",
    3,
    { heading: "Programme Details", body: CEO_PLACEHOLDER },
    admin.id
  );

  console.log("Seeding Careers page content...");
  const careersPage = await prisma.page.upsert({
    where: { slug: "careers" },
    update: {},
    create: { slug: "careers", title: "Careers" },
  });

  await publishSection(
    careersPage.id,
    "hero",
    1,
    {
      heading: "Build your career with Sonic.",
      body: "Behind every machine, process and customer relationship are people.\n\nAs Sonic Packaging grows, we are building a team capable of manufacturing at greater scale, adopting new technology and serving customers across a wider packaging platform.",
    },
    admin.id
  );
  // No Job rows are seeded — none are confirmed open yet, so the Careers
  // page correctly falls back to the brief's exact "no open positions"
  // copy (see src/app/(public)/careers/page.tsx) until real openings are
  // entered through Admin.

  console.log("Seeding Insights page content + categories...");
  const insightsPage = await prisma.page.upsert({
    where: { slug: "insights" },
    update: {},
    create: { slug: "insights", title: "Insights" },
  });

  await publishSection(
    insightsPage.id,
    "hero",
    1,
    {
      heading: "Insights",
      body: "News, updates and stories from Sonic Packaging.",
    },
    admin.id
  );

  // Taxonomy only (brief section 20) — no Article rows are seeded, since
  // there is no real, confirmed article content to publish yet. The
  // Insights index page shows an honest empty state until the first
  // article is written and published through Admin.
  for (const category of ["Company News", "Manufacturing Insights", "Our People"]) {
    await prisma.articleCategory.upsert({
      where: { slug: category.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: { name: category, slug: category.toLowerCase().replace(/\s+/g, "-") },
    });
  }

  console.log("Seed complete.");
  console.log(`Log in to /admin with: ${seedEmail}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
