// Single source of content for the whole site.
export const site = {
  name: "SublimeHR",
  url: "https://sublimehr.com",
  appUrl: "app.sublimehr.com",
  tagline: "The HR platform your team will actually enjoy using.",
  description:
    "SublimeHR is a cloud-based HR & workforce management platform that unifies attendance, leave, payroll, shift scheduling and employee self-service — with 70+ feature areas, 13 built-in reports and English & Arabic support.",
  phone: "+91-7976117684",
  phoneHref: "tel:+917976117684",
  whatsapp:
    "https://wa.me/917976117684?text=" +
    encodeURIComponent("Hi SublimeHR, I'd like to know more about your workforce management platform."),
  // Contact form backend: paste your Google Apps Script web-app URL here (see backend/README.md).
  // Leave empty to fall back to WhatsApp hand-off.
  formEndpoint: "",
  logo: "/assets/img/sublimehr-logo.png",
  ogImage: "/assets/img/og-image.png"
};

export const modules = [
  {
    slug: "employee-management",
    name: "Employee Management",
    short: "Core HR & employee records",
    icon: "users",
    tone: "",
    tagline: "One source of truth for your entire workforce",
    summary:
      "Centralize every employee record — from onboarding through separation — with deep profiles, documents, letters and a full employment timeline.",
    problem:
      "Employee data scattered across spreadsheets, emails, and legacy systems creates costly errors, compliance risk, and slow HR response times.",
    solution:
      "Centralize every employee record — from personal details and family relations to job history, salary, documents and access cards — in a secure, audit-ready workspace.",
    benefits: [
      "Eliminate data silos with a unified employee database",
      "Onboard 3x faster with multi-section digital forms",
      "Stay audit-ready with automatic change history",
      "Personalize offer letters with dynamic tokens"
    ],
    features: [
      "Active & separated employee lists",
      "Multi-section employee profiles",
      "Employment type configuration",
      "Personal details & family relations",
      "Job role & position history",
      "Documents with dynamic fields",
      "Education, assets & access cards",
      "Salary details & employee notes",
      "Warning letters & disciplinary tracking",
      "Employment timeline (journey) visualization",
      "Employee status & policy assignment",
      "Shift assignment & monthly roster",
      "Biometric / device registration",
      "Drag-and-drop offer letter builder",
      "Custom letter template library",
      "Dynamic token insertion from employee data"
    ],
    useCases: [
      "Growing companies replacing spreadsheets with one searchable employee database",
      "HR teams generating offer, experience and warning letters in seconds from templates",
      "Multi-branch businesses tracking transfers, role changes and assets per employee"
    ],
    faqs: [
      ["Can we import our existing employee data?", "Yes. Our team migrates your existing employee records from spreadsheets or your current HR system as part of onboarding, at no extra cost on standard plans."],
      ["Can we add custom fields to employee profiles?", "Yes. Documents and profile sections support dynamic fields, so you can capture the data your business needs without custom development."],
      ["Does it keep a history of changes?", "Yes. Position history, status changes and policy assignments are tracked automatically with an audit trail."]
    ]
  },
  {
    slug: "attendance-management",
    name: "Attendance Management",
    short: "Biometric, web & mobile punch",
    icon: "clock",
    tone: "teal",
    tagline: "Accurate time capture for every work model",
    summary:
      "Capture attendance from biometric devices, web punch with camera + GPS, and mobile beacons — then automate exceptions and approvals end-to-end.",
    problem:
      "Manual attendance, buddy punching, and gaps between biometric devices and payroll cost businesses up to 4% of gross payroll each year.",
    solution:
      "Capture attendance from biometric devices, web punch with camera + GPS, and mobile beacons — then automate exception handling and approvals end-to-end.",
    benefits: [
      "Cut attendance disputes by up to 90%",
      "Support office, remote, hybrid, and field teams from one system",
      "Auto-flag late arrivals with configurable tolerance",
      "Bridge attendance to payroll with zero re-keying"
    ],
    features: [
      "Biometric device integration & management",
      "Web punch with camera and location",
      "Beacon-based mobile punch authorization",
      "Punch approval workflows",
      "Attendance types configuration",
      "Late & missed clock-in tolerance rules",
      "Attendance round-off settings",
      "Exception regularization (CI/CO pairs)",
      "Real-time 'Who is here' dashboard",
      "Attendance comparison reports"
    ],
    useCases: [
      "Retail chains tracking multi-store shift attendance in real time",
      "Construction firms verifying field crews with GPS-anchored punches",
      "BPOs enforcing shift discipline with tolerance-based auto-alerts"
    ],
    faqs: [
      ["Which biometric devices are supported?", "SublimeHR integrates with fingerprint, RFID card and facial-recognition attendance devices. Share your device make and model and we'll confirm compatibility before you sign up."],
      ["Can employees punch in from mobile?", "Yes. Employees can clock in from the web or mobile app with camera and GPS verification, and beacon-based punch authorization for on-site validation."],
      ["How are attendance exceptions handled?", "Missing or mismatched clock-in/clock-out pairs are flagged as exceptions. Employees raise regularization requests and managers approve them in one click."]
    ]
  },
  {
    slug: "leave-management",
    name: "Leave Management",
    short: "Policies, accruals & calendars",
    icon: "calendar",
    tone: "coral",
    tagline: "Automated leave policies that scale with your business",
    summary:
      "Design any leave policy — accruals, holidays, weekends, tolerance — and let the rules engine handle balances and approvals for you.",
    problem:
      "Manual leave tracking creates balance disputes, missed accruals, and last-minute staffing crises that hit customer service and productivity.",
    solution:
      "Design any leave policy visually — accruals, tenure-based rules, holiday policies, weekend logic — and let the rules engine handle the rest.",
    benefits: [
      "Reduce HR queries about balances by 70%+",
      "Prevent understaffing with visual team leave calendars",
      "Automate monthly, annual and attendance-based accruals",
      "Configure region-specific holiday policies in minutes"
    ],
    features: [
      "Apply leave on behalf of employees",
      "Multi-level leave approval workflows",
      "Individual & org-wide leave balances",
      "Configurable leave accrual policies",
      "Attendance-based accrual rules",
      "Per-employee accrual overrides",
      "Leave granter (manual grants)",
      "Holiday list & holiday policies",
      "Weekend policy configuration",
      "Holiday & leave calendars",
      "Tolerance policies per leave type"
    ],
    useCases: [
      "Schools aligning staff leave with the academic calendar",
      "Multi-country teams running region-specific holiday lists per branch",
      "Factories granting attendance-based leave accruals to shop-floor workers"
    ],
    faqs: [
      ["Can I configure our custom leave policies?", "Yes. Accrual frequency, carry-forward, tenure rules, attendance-based accrual and per-employee overrides are all configurable without code."],
      ["Can HR apply leave on behalf of employees?", "Yes. HR and authorized managers can apply leave on behalf of any employee, with the same approval and balance checks."],
      ["How do multi-level approvals work?", "You define the approval chain — for example reporting manager, then department head, then HR — and requests route automatically with notifications at each step."]
    ]
  },
  {
    slug: "payroll",
    name: "Payroll",
    short: "Attendance-linked salary processing",
    icon: "wallet",
    tone: "",
    tagline: "Zero-error payroll, every single cycle",
    summary:
      "Run payroll from a single dashboard with configurable heads, allowances, deductions and attendance-linked calculations — plus a branded payslip designer.",
    problem:
      "Payroll errors erode trust, invite legal risk, and consume days of finance and HR bandwidth every month.",
    solution:
      "Run payroll from a single dashboard with configurable heads, allowances, deductions, and attendance-linked calculations — with a branded payslip designer.",
    benefits: [
      "Close payroll in hours instead of days",
      "Cut payroll disputes with self-service payslips",
      "Stay compliant with configurable statutory heads",
      "Give finance a clean daily view of payroll costs"
    ],
    features: [
      "Payroll dashboard & processing",
      "Employee payroll center",
      "Salary structure management",
      "Advance salary requests & approvals",
      "Configurable deductions & penalties",
      "Custom allowance settings",
      "Payroll head configuration",
      "Salary slip template designer",
      "PDF payslip generation & download",
      "Daily salary and payroll reports",
      "Attendance & salary system settings"
    ],
    useCases: [
      "Manufacturers calculating overtime and penalties straight from attendance",
      "Hospitality groups managing allowances across multiple properties",
      "Finance teams tracking daily labour cost with the daily salary report"
    ],
    faqs: [
      ["Is payroll integrated with attendance?", "Yes. Attendance, late-coming, penalties and leave flow directly into payroll, so there is no manual re-keying between systems."],
      ["Can I customize salary structures?", "Yes. Define your own payroll heads, allowances and deductions, and design salary slips with your branding."],
      ["Can we handle advance salary requests?", "Yes. Employees request advances, managers approve them, and repayments are scheduled against future payroll automatically."]
    ]
  },
  {
    slug: "reports-analytics",
    name: "Reports & Analytics",
    short: "13 built-in, audit-ready reports",
    icon: "chart",
    tone: "teal",
    tagline: "Turn workforce data into board-ready decisions",
    summary:
      "13 pre-built HR reports, customizable dashboards and audit-ready timesheets that surface answers in seconds, not weeks.",
    problem:
      "HR leaders spend weeks compiling spreadsheets — and still cannot answer basic questions about attendance, cost, or attrition on demand.",
    solution:
      "Access 13 pre-built HR reports, customizable dashboards, and audit-ready timesheets that surface answers in seconds, not weeks.",
    benefits: [
      "Answer executive questions with real-time dashboards",
      "Simplify audits with tamper-evident event history",
      "Spot attendance risks before they become payroll issues",
      "Give department heads their own live analytics view"
    ],
    features: [
      "Event Sheet Report (historical audit log)",
      "Timesheet report with audit trail",
      "Attendance overview & corrections",
      "Attendance comparison across sources",
      "Exception & penalty reports",
      "Punch approval report",
      "Real-time 'Who is here' report",
      "Daily clock in/out summary",
      "Daily salary & payroll reports",
      "Late coming analytics",
      "Visitor timesheet report",
      "Biometrics / registration status"
    ],
    useCases: [
      "Plant heads checking who is on the floor right now with 'Who is here'",
      "Auditors reviewing tamper-evident event logs and timesheets",
      "CFOs monitoring daily salary cost by branch"
    ],
    faqs: [
      ["What reports come out of the box?", "13 report types including Event Sheet, Timesheet, Attendance, Attendance Comparison, Exception, Punch Approval, Who Is Here, Daily Clock In/Out, Penalty, Daily Salary, Visitor Timesheet, Biometrics/Registration and Late Coming."],
      ["Can data be exported?", "Yes. Reports can be exported for use in spreadsheets, finance and audit tools."],
      ["Can department heads see their own analytics?", "Yes. Role-based access ensures every leader sees exactly the data they need — and nothing more."]
    ]
  },
  {
    slug: "employee-self-service",
    name: "Employee Self Service",
    short: "Portal for every employee",
    icon: "user-check",
    tone: "coral",
    tagline: "Empower employees. Free your HR team.",
    summary:
      "A self-service portal where employees punch in, apply for leave, download payslips and raise regularization requests — from any device.",
    problem:
      "HR teams drown in repetitive queries — leave balances, payslip requests, attendance corrections — leaving no time for strategic work.",
    solution:
      "Give every employee a self-service portal to punch in, apply for leave, download payslips, and raise regularization requests — from any device.",
    benefits: [
      "Reduce HR ticket volume by up to 60%",
      "Improve employee experience with instant answers",
      "Cut paper-based document requests to zero",
      "Boost adoption with a mobile-first experience"
    ],
    features: [
      "Web clock in/out with camera & GPS",
      "Apply leave & view real-time balance",
      "Download monthly payslips",
      "Personal document center",
      "Holiday & leave calendars",
      "Exception regularization requests",
      "Work-from-home requests",
      "Profile & password management",
      "Personalized dashboard widgets",
      "Real-time notifications"
    ],
    useCases: [
      "Employees downloading payslips themselves instead of emailing HR",
      "Remote staff clocking in with camera + GPS verification",
      "Managers approving leave and regularizations from one inbox"
    ],
    faqs: [
      ["Do employees get self-service payslips?", "Yes. Employees can view and download monthly payslips as PDFs from the web portal or mobile app."],
      ["Can employees see their leave balance?", "Yes. Balances update in real time as leave is applied, approved or accrued."],
      ["Does it work on mobile?", "Yes. The portal is fully responsive and also available through the SublimeHR mobile app."]
    ]
  },
  {
    slug: "mobile-workforce",
    name: "Mobile Workforce",
    short: "Native mobile app & beacons",
    icon: "phone",
    tone: "",
    tagline: "HR in your team's pocket — on their terms",
    summary:
      "A native mobile app with beacon-based punch, remote-work requests, mobile approvals and full permission control from the web admin.",
    problem:
      "Desk-less workers, field crews, and remote staff are left out of legacy HR systems built only for the office.",
    solution:
      "A native mobile app with beacon-based punch, remote work requests, mobile approvals, and full permission control from the web admin.",
    benefits: [
      "Give every worker a modern HR experience",
      "Approve leaves and punches on the go",
      "Secure field attendance with beacons & GPS",
      "Centrally control mobile permissions per role"
    ],
    features: [
      "Native mobile punch (camera + GPS)",
      "Beacon-based punch authorization",
      "Apply leave from mobile",
      "Leave balance & mobile approvals",
      "Work-from-home apply & tracking",
      "Mobile 'Who is here' view",
      "Manual attendance report on mobile",
      "Admin access via mobile app",
      "Full permission layer from web admin",
      "Offline punch queue with auto-sync"
    ],
    useCases: [
      "Logistics firms capturing GPS-verified attendance at every hub",
      "Sales teams applying for leave and WFH from the field",
      "Supervisors approving punches and leave while on the move"
    ],
    faqs: [
      ["Is there a mobile app?", "Yes. SublimeHR offers a native mobile app for employees and admins, with permissions controlled from the web admin panel."],
      ["Does the mobile app support offline mode?", "The mobile app queues punches when offline and syncs automatically once the device reconnects."],
      ["What is beacon-based punch authorization?", "Bluetooth beacons placed at your site confirm the employee is physically present before a mobile punch is accepted."]
    ]
  },
  {
    slug: "security-access",
    name: "Security & Access Control",
    short: "Roles, MFA & audit trails",
    icon: "shield",
    tone: "teal",
    tagline: "Enterprise-grade security, without the enterprise complexity",
    summary:
      "Role-based access, feature-level permissions, MFA, tenant isolation and full audit trails — configured in minutes, not months.",
    problem:
      "HR data is among the most sensitive in any organization — and yet often lives in shared drives with no meaningful access controls.",
    solution:
      "Role-based access, feature-level permissions, MFA, tenant isolation, and full audit trails — configured in minutes, not months.",
    benefits: [
      "Meet enterprise security requirements out of the box",
      "Isolate data per tenant, branch and department",
      "Track every policy and status change automatically",
      "Support dual-panel access for HR admins"
    ],
    features: [
      "Role-based permissions (View / Add / Edit / Delete)",
      "Feature-level access control",
      "User-level permission overrides",
      "MFA / OTP authentication",
      "Login by email, username or employee code",
      "Tenant & subdomain isolation",
      "Dual-panel access for HR staff",
      "Profile & password policies",
      "Audit trail on policy & status changes",
      "Branch-level settings",
      "Custom company branding & themes",
      "English & Arabic language support"
    ],
    useCases: [
      "Enterprises restricting salary data to finance and HR leadership",
      "Groups running several companies with fully isolated tenants",
      "Compliance teams reviewing audit trails on policy changes"
    ],
    faqs: [
      ["Is my data secure?", "Yes. SublimeHR runs on secure cloud infrastructure with encrypted connections, MFA, role-based access and tenant isolation."],
      ["Do you support multi-factor authentication?", "Yes. MFA / OTP authentication can be enforced for users."],
      ["How are permissions managed?", "Roles carry View / Add / Edit / Delete rights per feature, with user-level overrides when someone needs an exception."]
    ]
  },
  {
    slug: "shift-scheduling",
    name: "Shift Scheduling",
    short: "Rosters, rotations & night shifts",
    icon: "repeat",
    tone: "coral",
    tagline: "Rosters that plan themselves",
    summary:
      "Assign shifts, publish monthly rosters and let attendance rules flow straight into payroll — for every shop, plant, ward or store.",
    problem:
      "Manual shift planning across teams, sites, and time zones is the single biggest source of last-minute HR chaos — and understaffing.",
    solution:
      "Assign shifts, publish monthly rosters, and let attendance rules flow automatically into payroll — for every shop, plant, hospital ward, or store.",
    benefits: [
      "Publish rosters in minutes, not days",
      "Prevent understaffing with visual coverage views",
      "Auto-link shifts to attendance and pay",
      "Handle rotating, split, and overnight shifts"
    ],
    features: [
      "Shift assignment per employee",
      "Monthly roster generation",
      "Rotating & split shift support",
      "Overnight and cross-day shifts",
      "Weekend and holiday-aware rosters",
      "Roster-based attendance validation",
      "Branch- and department-level shifts",
      "Bulk shift updates",
      "Shift-based payroll calculation",
      "Roster export and print"
    ],
    useCases: [
      "Hospitals rotating 24/7 nursing shifts across wards",
      "Factories running three-shift operations with overnight crossover",
      "Hotels managing split shifts across multiple properties"
    ],
    faqs: [
      ["Do you support night and overnight shifts?", "Yes. Overnight and cross-day shifts are handled natively, including correct attendance pairing and pay calculation."],
      ["Can we update many shifts at once?", "Yes. Bulk shift updates let you reassign teams or departments in a single action."],
      ["Are rosters linked to attendance?", "Yes. Punches are validated against the assigned roster, so late-coming and exceptions are calculated automatically."]
    ]
  },
  {
    slug: "visitor-management",
    name: "Visitor Management",
    short: "Digital front desk & logs",
    icon: "badge",
    tone: "",
    tagline: "A modern front desk for a modern workplace",
    summary:
      "Register, track and report on every visitor entering your premises, with digital logs your security and audit teams can actually use.",
    problem:
      "Paper visitor logs are unreadable, unsearchable, and useless the moment an auditor — or an incident — arrives.",
    solution:
      "Register, track, and report on every visitor entering your premises, with digital logs your security and audit teams can actually use.",
    benefits: [
      "Digitize the front desk in minutes",
      "Improve premises security and accountability",
      "Provide auditors with searchable visitor logs",
      "Track visitor traffic for facilities planning"
    ],
    features: [
      "Visitor registration & check-in",
      "Host and purpose tracking",
      "Visitor duration & timesheet",
      "Visitor timesheet reporting",
      "Digital, audit-ready visitor logs",
      "Branch-level visitor policies",
      "Photo capture at check-in",
      "Bulk visitor exports",
      "Security team notifications",
      "Integration with access cards"
    ],
    useCases: [
      "Corporate offices replacing paper visitor registers",
      "Factories tracking contractor time on site",
      "Schools logging every visitor for campus safety"
    ],
    faqs: [
      ["Can we capture a visitor's photo?", "Yes. Photo capture at check-in is supported, along with host and purpose details."],
      ["Can we report on contractor hours?", "Yes. The Visitor Timesheet report shows time spent on site per visitor."],
      ["Does it work across branches?", "Yes. Visitor policies and logs can be configured per branch."]
    ]
  }
];

export const reports = [
  ["Event Sheet Report", "Legacy timesheet / event log view"],
  ["Timesheet Report", "Modern timesheet with audit support"],
  ["Attendance Report", "Attendance overview & corrections"],
  ["Attendance Comparison", "Compare attendance data sources"],
  ["Exception Report", "Flag and resolve attendance exceptions"],
  ["Punch Approval", "Review pending punch requests"],
  ["Who Is Here", "Real-time clocked-in employees"],
  ["Daily Clock In/Out", "Daily punch summary"],
  ["Penalty Report", "Deductions and penalty tracking"],
  ["Daily Salary Report", "Daily salary breakdown"],
  ["Visitor Timesheet", "Visitor attendance records"],
  ["Biometrics / Registration", "Device enrollment status"],
  ["Late Coming Report", "Late arrival analysis"]
];

export const glance = [
  {
    id: "admin",
    title: "Admin / HR Panel",
    sub: "Run the whole organization",
    icon: "dashboard",
    items: [
      "Customizable dashboard with widgets",
      "Employee lifecycle management",
      "Attendance, leave & payroll operations",
      "13 analytics & compliance reports",
      "System settings & role management",
      "Quick links & favorites search"
    ]
  },
  {
    id: "ess",
    title: "Employee Self-Service",
    sub: "Everything employees need",
    icon: "user-check",
    items: [
      "Web clock in / out with camera & GPS",
      "Apply leave & view balance",
      "Download monthly payslips",
      "Document center",
      "Holiday & leave calendars",
      "Exception regularization requests"
    ]
  },
  {
    id: "security",
    title: "Security & Access",
    sub: "Enterprise-grade protection",
    icon: "shield",
    items: [
      "Role-based permissions (View / Add / Edit / Delete)",
      "MFA / OTP authentication",
      "Email, username or employee-code login",
      "Dual-panel access for HR staff",
      "Audit trails on critical modules",
      "Tenant / subdomain isolation"
    ]
  },
  {
    id: "experience",
    title: "Experience",
    sub: "Made to feel like yours",
    icon: "sparkles",
    items: [
      "English & Arabic language support",
      "Light / dark theme customization",
      "Responsive design (desktop & mobile)",
      "Configurable Site / Job terminology",
      "Company branding & logo",
      "Mobile app permission layer"
    ]
  }
];

export const why = [
  ["globe", "Built for every workforce", "Office, remote, hybrid, shift-based and field teams — one platform for all."],
  ["sliders", "Configuration over customization", "A powerful rules engine handles most business logic without a single line of code."],
  ["heart", "Employee-first experience", "Modern web and native mobile apps that employees actually adopt."],
  ["shield", "Enterprise-grade security", "MFA, tenant isolation, feature-level access control and full audit trails."],
  ["rocket", "Rapid implementation", "Go live in days — not months — with white-glove data migration."],
  ["code", "Custom development, built in", "Have a unique workflow? We build to fit — and it scales with you."]
];

export const highlights = [
  ["globe", "English & Arabic", "Full RTL/LTR interface for teams across MENA and beyond."],
  ["layers", "Multi-tenant SaaS", "Isolated data per company, subdomain and branch."],
  ["building", "Multi-branch ready", "Branch-level policies, holidays and reporting out of the box."],
  ["palette", "Your branding", "Custom themes, logos and dashboards per tenant."]
];

export const industries = [
  {
    id: "manufacturing", name: "Manufacturing", icon: "factory",
    blurb: "Shift-based operations, thousands of shop-floor workers, biometric complexity, and strict compliance rules.",
    how: ["Biometric attendance across plants with device management", "Three-shift and overnight rosters linked to payroll", "Penalty, late-coming and overtime calculated automatically"],
    modules: ["attendance-management", "shift-scheduling", "payroll"]
  },
  {
    id: "healthcare", name: "Healthcare", icon: "health",
    blurb: "24/7 rotating shifts, credential compliance, and rapid onboarding of nurses, doctors, and support staff.",
    how: ["Rotating ward rosters with coverage visibility", "Document center for licences and credentials", "Fast digital onboarding with multi-section forms"],
    modules: ["shift-scheduling", "employee-management", "leave-management"]
  },
  {
    id: "it-software", name: "IT & Software", icon: "laptop",
    blurb: "Distributed teams, hybrid work, region-specific leave policies, and rapid hiring cycles.",
    how: ["Web punch with camera + GPS for remote and hybrid staff", "Work-from-home requests and approvals", "Region-specific holiday lists per branch"],
    modules: ["employee-self-service", "leave-management", "attendance-management"]
  },
  {
    id: "education", name: "Schools & Education", icon: "school",
    blurb: "Academic-calendar-driven leave, staff credentials, and multi-campus HR administration.",
    how: ["Leave policies aligned to term and vacation calendars", "Multi-campus branch settings under one tenant", "Visitor logs for campus safety"],
    modules: ["leave-management", "visitor-management", "employee-management"]
  },
  {
    id: "hospitality", name: "Hotels & Hospitality", icon: "hotel",
    blurb: "Seasonal hiring, split shifts, tip and allowance management, and multi-property operations.",
    how: ["Split and rotating shifts per property", "Custom allowances and deductions in payroll", "Quick onboarding and separation for seasonal staff"],
    modules: ["shift-scheduling", "payroll", "employee-management"]
  },
  {
    id: "retail", name: "Retail", icon: "retail",
    blurb: "High attrition, part-time staff, and store-level attendance tracking with tight labor cost controls.",
    how: ["Store-level attendance with real-time 'Who is here'", "Daily salary report to watch labour cost", "Mobile self-service for part-time staff"],
    modules: ["attendance-management", "reports-analytics", "mobile-workforce"]
  },
  {
    id: "logistics", name: "Logistics", icon: "truck",
    blurb: "Field workforce across geographies, GPS-verified attendance, and multi-hub operations.",
    how: ["GPS and beacon-verified mobile punches at every hub", "Offline punch queue for low-connectivity areas", "Hub-level reporting and approvals"],
    modules: ["mobile-workforce", "attendance-management", "reports-analytics"]
  },
  {
    id: "professional-services", name: "Professional Services", icon: "briefcase",
    blurb: "Client-driven schedules, timesheet accuracy, and utilization reporting for billable staff.",
    how: ["Audit-ready timesheets for client billing", "Self-service leave and WFH for consultants", "Role-based dashboards for partners and managers"],
    modules: ["reports-analytics", "employee-self-service", "security-access"]
  },
  {
    id: "construction", name: "Construction", icon: "hardhat",
    blurb: "Site-based workforce, safety compliance, and multi-project attendance tracking.",
    how: ["GPS-anchored punches for every site crew", "Contractor and visitor tracking on site", "Site-wise attendance and payroll reports"],
    modules: ["mobile-workforce", "visitor-management", "payroll"]
  }
];

export const integrations = [
  { group: "Productivity", items: [["G", "Google Workspace", "Sync users, calendars, and single sign-on."], ["M", "Microsoft 365", "Sync Azure AD identities and Outlook calendars."]] },
  { group: "Communication", items: [["S", "Slack", "Approvals, alerts, and DM notifications in Slack."], ["T", "Microsoft Teams", "Bring HR workflows into your Teams channels."], ["Z", "Zoom", "Schedule interviews and 1-on-1s directly."]] },
  { group: "Hardware", items: [["B", "Biometric Devices", "Fingerprint, RFID, and facial-recognition devices."]] },
  { group: "Developer", items: [["</>", "REST APIs", "Fully documented API for custom integrations."]] },
  { group: "Accounting", items: [["Q", "QuickBooks", "Sync payroll journals to your books."], ["T", "Tally", "Push payroll data into Tally with a click."]] },
  { group: "ERP", items: [["S", "SAP ERP", "Bidirectional sync with your enterprise systems."], ["O", "Oracle ERP", "Employee and payroll sync into Oracle."]] },
  { group: "Security", items: [["O", "Okta / SAML SSO", "Enterprise-grade single sign-on."]] }
];

export const plans = [
  {
    name: "Starter", price: "$4", unit: "per user / month",
    desc: "For small teams getting HR right from day one.",
    cta: ["Start Free Trial", "/book-demo/?plan=starter"], ctaStyle: "btn-secondary",
    includes: null,
    items: ["Up to 50 employees", "Core HR & employee database", "Attendance & leave management", "Mobile app access", "Self-service portal", "5 built-in reports", "Email support"]
  },
  {
    name: "Professional", price: "$8", unit: "per user / month", featured: true,
    desc: "For growing companies that need automation and analytics.",
    cta: ["Book a Demo", "/book-demo/?plan=professional"], ctaStyle: "btn-accent",
    includes: "Everything in Starter, plus:",
    items: ["Unlimited employees", "Full payroll module", "All 13 built-in reports", "Advanced approval workflows", "Biometric device integrations", "Custom letter templates", "Priority support"]
  },
  {
    name: "Enterprise", price: "Custom", unit: "tailored to you",
    desc: "For large teams with unique workflows and integrations.",
    cta: ["Contact Sales", "/contact/?plan=enterprise"], ctaStyle: "btn-primary",
    includes: "Everything in Professional, plus:",
    items: ["Unlimited users & branches", "Custom development", "SSO / SAML authentication", "Custom integrations & APIs", "Advanced reporting & analytics", "Dedicated success manager", "24/7 premium support"]
  }
];

export const compare = [
  ["Employees", "Up to 50", "Unlimited", "Unlimited"],
  ["Core HR & employee database", 1, 1, 1],
  ["Attendance & leave management", 1, 1, 1],
  ["Employee self-service portal", 1, 1, 1],
  ["Mobile app access", 1, 1, 1],
  ["Built-in reports", "5", "All 13", "All 13 + advanced"],
  ["Full payroll module", 0, 1, 1],
  ["Advanced approval workflows", 0, 1, 1],
  ["Biometric device integrations", 0, 1, 1],
  ["Custom letter templates", 0, 1, 1],
  ["Multiple branches", 0, 1, "Unlimited"],
  ["SSO / SAML authentication", 0, 0, 1],
  ["Custom integrations & APIs", 0, 0, 1],
  ["Custom development", 0, 0, 1],
  ["Support", "Email", "Priority", "24/7 premium + success manager"]
];

export const customAreas = [
  ["workflow", "Custom Approval Workflows", "Multi-level, delegated, conditional or matrix approvals — mirror your org chart exactly."],
  ["form", "Bespoke Forms", "Dynamic forms for anything from field surveys to grievance intake."],
  ["dollar", "Payroll Rules", "State-specific taxation, custom shift premiums, industry-specific pay heads."],
  ["clock", "Attendance Policies", "Overnight shifts, split shifts, compensatory offs — configured to your reality."],
  ["repeat", "Employee Lifecycle Automation", "Trigger onboarding, transfers or offboarding based on your unique triggers."],
  ["plug", "Integrations", "Connect legacy ERPs, accounting systems, LMS, and internal tools securely."],
  ["dashboard", "Custom Dashboards", "Role-specific dashboards for CEOs, plant heads, HR ops, and finance."],
  ["split", "Department Logic", "Different rules per department, plant, brand, or subsidiary — all in one system."],
  ["cpu", "AI & Automation", "Automated regularization, anomaly detection, predictive attrition alerts."]
];

export const process = [
  ["Discovery", "We understand your workflows and constraints in depth."],
  ["Design & Estimate", "Detailed solution design with timeline and fixed pricing."],
  ["Build & Test", "Iterative build with sprint demos every 2 weeks."],
  ["Launch & Support", "Go live with training, docs, and ongoing support."]
];

export const faqs = [
  {
    id: "getting-started", title: "Getting Started", icon: "rocket",
    items: [
      ["What is SublimeHR?", "SublimeHR is a cloud-based HR and workforce management platform. It brings employee records, attendance, leave, shift scheduling, payroll, reports and employee self-service into one system, with separate Admin and Employee panels and a native mobile app."],
      ["Who is SublimeHR built for?", "Growing businesses and enterprises across manufacturing, healthcare, IT, education, hospitality, retail, logistics, professional services and construction — anywhere you manage office, remote, hybrid, shift-based or field teams."],
      ["How quickly can we go live?", "Most customers go live in days, not months. Our team handles setup and data migration, then trains your admins and employees."],
      ["Do you offer a free trial or demo?", "Yes. You can start a free trial on the Starter plan or book a personalized 30-minute demo with our team. No credit card is required."],
      ["Is training included?", "Yes. Every plan includes onboarding training. Enterprise plans include dedicated success managers and role-based training programs."]
    ]
  },
  {
    id: "attendance", title: "Attendance", icon: "clock",
    items: [
      ["Which biometric devices are supported?", "SublimeHR integrates with fingerprint, RFID card and facial-recognition attendance devices. Share your device make and model and we'll confirm compatibility."],
      ["Can employees punch in from mobile?", "Yes. Employees can punch in from the web or mobile app with camera and GPS verification, and beacon-based authorization for on-site validation."],
      ["How are attendance exceptions handled?", "Missing or mismatched clock-in/out pairs are flagged automatically. Employees raise regularization requests and managers approve them through a punch approval workflow."],
      ["Can I define different attendance types?", "Yes. Attendance types are fully configurable, along with late-coming and missed clock-in tolerance rules."],
      ["Do you support round-off rules?", "Yes. Rounding rules for clock-in/out times are fully configurable to match your policy."]
    ]
  },
  {
    id: "leave", title: "Leave Management", icon: "calendar",
    items: [
      ["Can I configure our custom leave policies?", "Yes. Accruals, attendance-based accrual, per-employee overrides, tolerance and weekend policies are all configurable without code."],
      ["Can HR apply leave on behalf of employees?", "Yes. HR can apply leave on behalf of any employee, with the same approval and balance checks."],
      ["How do multi-level approvals work?", "You define the approval chain and requests route automatically from one approver to the next, with notifications at every step."],
      ["Can we view team-wide leave calendars?", "Yes. Holiday and leave calendars show who is away across teams so you can prevent understaffing."],
      ["Do you handle regional holiday lists?", "Yes. Configure branch-level holiday lists and policies to match local statutory requirements."]
    ]
  },
  {
    id: "payroll", title: "Payroll", icon: "wallet",
    items: [
      ["Is payroll integrated with attendance?", "Yes. Attendance, leave, late-coming and penalties flow directly into payroll calculations, so there is no re-keying."],
      ["Can I customize salary structures?", "Yes. Configure payroll heads, custom allowances and deductions, and design your own salary slip template."],
      ["Do employees get self-service payslips?", "Yes. Employees download monthly payslips as PDFs from the portal or mobile app."],
      ["Can I run daily salary reports?", "Yes. The Daily Salary Report gives finance a day-by-day breakdown of payroll cost."],
      ["Can we handle advance salary requests?", "Yes. Employees can request advances, managers can approve, and repayments schedule automatically."]
    ]
  },
  {
    id: "reports", title: "Reports & Analytics", icon: "chart",
    items: [
      ["What reports come out of the box?", "13 built-in report types: Event Sheet, Timesheet, Attendance, Attendance Comparison, Exception, Punch Approval, Who Is Here, Daily Clock In/Out, Penalty, Daily Salary, Visitor Timesheet, Biometrics/Registration and Late Coming."],
      ["Can I customize dashboards?", "Yes. The admin dashboard is built from widgets you can arrange, and Enterprise customers can get role-specific custom dashboards."],
      ["Can data be exported?", "Yes. Report data can be exported for spreadsheets, finance and audit tools."],
      ["Is there an audit trail?", "Yes. Critical modules — including policy and status changes — keep a full audit trail."],
      ["Can department heads see their own analytics?", "Yes. Role-based access ensures every leader sees exactly the data they need — and nothing more."]
    ]
  },
  {
    id: "security", title: "Security & Compliance", icon: "shield",
    items: [
      ["Is my data secure?", "Yes. SublimeHR runs on secure cloud infrastructure with MFA, role-based access control, tenant isolation and audit trails."],
      ["Do you support multi-factor authentication?", "Yes. MFA / OTP authentication is supported, and login can use email, username or employee code."],
      ["How are permissions managed?", "Roles carry View / Add / Edit / Delete rights per feature, with user-level permission overrides."],
      ["Do you provide audit logs?", "Yes. Changes to policies, statuses and other critical records are logged with who changed what and when."],
      ["Is data isolated per company?", "Yes. Multi-tenant architecture with subdomain isolation keeps each customer's data logically separated."]
    ]
  },
  {
    id: "custom-development", title: "Custom Development", icon: "code",
    items: [
      ["Can SublimeHR be customized for our workflows?", "Yes. Most needs are handled through configuration. For truly unique workflows, our team builds custom modules, approvals, payroll rules and integrations."],
      ["How long does customization take?", "It depends on scope. After discovery you receive a solution design with a timeline and fixed pricing, and you see sprint demos every two weeks."],
      ["Do we retain ownership of custom work?", "Ownership terms are agreed in your custom development contract — discuss your requirements with our solutions team."],
      ["Do you build integrations?", "Yes. We connect legacy ERPs, accounting systems, LMS and internal tools to any REST-based system."],
      ["How do we start a custom project?", "Use the Custom Development request form or book a consultation with our solutions team."]
    ]
  },
  {
    id: "pricing", title: "Pricing & Billing", icon: "dollar",
    items: [
      ["How is SublimeHR priced?", "Per active user per month: Starter is $4, Professional is $8, and Enterprise is custom-priced. You pay only for active employees."],
      ["Are there setup fees?", "Standard plans include free onboarding and data migration. Enterprise projects with custom development are quoted separately."],
      ["Can I change plans later?", "Yes. You can upgrade or change plans as your team grows."],
      ["Do you offer annual discounts?", "Yes. Talk to our sales team about annual billing options."],
      ["Is there a minimum contract length?", "Monthly plans are month-to-month. Annual plans run for 12 months with auto-renewal."]
    ]
  },
  {
    id: "implementation", title: "Implementation & Support", icon: "headset",
    items: [
      ["Do you assist with data migration?", "Yes. White-glove data migration from spreadsheets or your existing HR system is included in onboarding."],
      ["Do you provide dedicated support?", "Professional plans include priority support. Enterprise plans include a dedicated success manager."],
      ["What are your support hours?", "Starter and Professional customers get support during business hours. Enterprise customers get 24/7 premium support."],
      ["Is documentation available?", "Yes. Every implementation comes with documentation and training material for admins and employees."],
      ["Do you offer admin training?", "Yes. Every implementation includes admin and end-user training. Additional workshops are available on demand."]
    ]
  },
  {
    id: "mobile-integrations", title: "Mobile & Integrations", icon: "plug",
    items: [
      ["Is there a mobile app?", "Yes. A native mobile app covers punch-in, leave, approvals, WFH requests and admin access, with permissions controlled from the web admin."],
      ["Which systems can SublimeHR integrate with?", "Google Workspace, Microsoft 365, Slack, Microsoft Teams, Zoom, biometric devices, QuickBooks, Tally, SAP, Oracle, Okta / SAML SSO, and any system via REST API."],
      ["Do you support SSO?", "Yes. SSO / SAML authentication is available on the Enterprise plan."],
      ["Is there an API?", "Yes. A documented REST API is available for custom integrations."],
      ["Does the mobile app support offline mode?", "The mobile app queues punches when offline and syncs automatically once the device reconnects."]
    ]
  }
];

export const homeFaqIds = [
  "What is SublimeHR?",
  "Who is SublimeHR built for?",
  "How quickly can we go live?",
  "Do you offer a free trial or demo?",
  "Which biometric devices are supported?",
  "Can employees punch in from mobile?",
  "Is payroll integrated with attendance?",
  "How is SublimeHR priced?"
];

export function findFaq(q) {
  for (const g of faqs) for (const [qq, a] of g.items) if (qq === q) return [qq, a];
  return null;
}
