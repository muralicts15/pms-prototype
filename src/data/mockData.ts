import type { Property, Enquiry, Application, TimelineEntry, Lease, Bond, PCR, RentSchedule, ESignParty } from '../types'

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  // Listing
  DRAFT:                { label: 'Draft',                  color: 'text-gray-600',    bg: 'bg-gray-100',    border: 'border-gray-200' },
  READY_TO_LIST:        { label: 'Ready to List',          color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  LISTED:               { label: 'Listed',                 color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
  APPLICATIONS_OPEN:    { label: 'Accepting Applications', color: 'text-teal-700',    bg: 'bg-teal-50',     border: 'border-teal-200' },
  UNDER_REVIEW:         { label: 'Applications Closed',    color: 'text-orange-700',  bg: 'bg-orange-50',   border: 'border-orange-200' },
  OFFER_IN_PROGRESS:    { label: 'Under Offer',            color: 'text-purple-700',  bg: 'bg-purple-50',   border: 'border-purple-200' },
  VACATING_TENANT:      { label: 'Vacating Tenant',        color: 'text-pink-700',    bg: 'bg-pink-50',     border: 'border-pink-200' },
  MAINTENANCE_HOLD:     { label: 'Maintenance Hold',       color: 'text-yellow-700',  bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  OFF_MARKET:           { label: 'Off Market',             color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200' },
  ARCHIVED:             { label: 'Archived',               color: 'text-gray-500',    bg: 'bg-gray-100',    border: 'border-gray-200' },
  // Enquiry
  NEW:                  { label: 'New',                    color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  CONTACTED:            { label: 'Contacted',              color: 'text-yellow-700',  bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  ACCESS_SENT:          { label: 'Access Sent',            color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
  APPLIED:              { label: 'Applied',                color: 'text-purple-700',  bg: 'bg-purple-50',   border: 'border-purple-200' },
  DECLINED:             { label: 'Declined',               color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200' },
  // Application
  IN_PROGRESS:          { label: 'In Progress',            color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  PDF_REVIEW:           { label: 'PDF Review',             color: 'text-yellow-700',  bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  SUBMITTED:            { label: 'Submitted',              color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
  APPROVED_FOR_OFFER:   { label: 'Approved for Offer',     color: 'text-purple-700',  bg: 'bg-purple-50',   border: 'border-purple-200' },
  WITHDRAWN:            { label: 'Withdrawn',              color: 'text-gray-500',    bg: 'bg-gray-100',    border: 'border-gray-200' },
  EXPIRED:              { label: 'Expired',                color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200' },
  // Lease
  GENERATED:            { label: 'Generated',              color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  SENT_FOR_SIGNATURE:   { label: 'Sent for Signature',     color: 'text-yellow-700',  bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  PARTIALLY_SIGNED:     { label: 'Partially Signed',       color: 'text-orange-700',  bg: 'bg-orange-50',   border: 'border-orange-200' },
  FULLY_SIGNED:         { label: 'Fully Signed',           color: 'text-teal-700',    bg: 'bg-teal-50',     border: 'border-teal-200' },
  UPCOMING:             { label: 'Upcoming',               color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  ACTIVE:               { label: 'Active',                 color: 'text-green-800',   bg: 'bg-green-100',   border: 'border-green-300' },
  NOTICE_GIVEN:         { label: 'Notice Given',           color: 'text-orange-700',  bg: 'bg-orange-50',   border: 'border-orange-200' },
  VACATING:             { label: 'Vacating',               color: 'text-pink-700',    bg: 'bg-pink-50',     border: 'border-pink-200' },
  ENDED:                { label: 'Ended',                  color: 'text-gray-500',    bg: 'bg-gray-100',    border: 'border-gray-200' },
  // Bond
  INVOICED:             { label: 'Invoiced',               color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  PARTIALLY_PAID:       { label: 'Partially Paid',         color: 'text-yellow-700',  bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  RECEIVED:             { label: 'Received',               color: 'text-teal-700',    bg: 'bg-teal-50',     border: 'border-teal-200' },
  READY_TO_LODGE:       { label: 'Ready to Lodge',         color: 'text-orange-700',  bg: 'bg-orange-50',   border: 'border-orange-200' },
  LODGED:               { label: 'Lodged',                 color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
  REFUND_IN_PROGRESS:   { label: 'Refund in Progress',     color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  REFUNDED:             { label: 'Refunded',               color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
  WAIVED:               { label: 'Waived',                 color: 'text-gray-500',    bg: 'bg-gray-100',    border: 'border-gray-200' },
  CANCELLED:            { label: 'Cancelled',              color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200' },
  // E-sign
  PENDING:              { label: 'Pending',                color: 'text-gray-500',    bg: 'bg-gray-100',    border: 'border-gray-200' },
  SENT:                 { label: 'Sent',                   color: 'text-blue-600',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  OPENED:               { label: 'Opened',                 color: 'text-yellow-700',  bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  SIGNED:               { label: 'Signed',                 color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
  // PCR
  AWAITING_TENANT_REVIEW:{ label: 'Awaiting Tenant Review',color: 'text-yellow-700',  bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  DISPUTED:             { label: 'Disputed',               color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200' },
  RESOLUTION_IN_PROGRESS:{ label: 'Resolving Dispute',     color: 'text-orange-700',  bg: 'bg-orange-50',   border: 'border-orange-200' },
  FINALIZED:            { label: 'Finalized',              color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
  // Rent
  OVERDUE:              { label: 'Overdue',                color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200' },
  PAID:                 { label: 'Paid',                   color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
  // Rent increase
  NOTICE_GENERATED:     { label: 'Notice Generated',       color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  NOTICE_SERVED:        { label: 'Notice Served',          color: 'text-yellow-700',  bg: 'bg-yellow-50',   border: 'border-yellow-200' },
  EFFECTIVE:            { label: 'Effective',              color: 'text-green-700',   bg: 'bg-green-50',    border: 'border-green-200' },
}

export const PROPERTIES: Property[] = [
  {
    id: 'prop-001', address: '24 Chapel St', suburb: 'Brighton', state: 'WA', postcode: '6020',
    bedrooms: 3, bathrooms: 2, parking: 2, weeklyRent: 650, bond: 2600,
    listingStatus: 'DRAFT', stageLabel: 'Draft', availableFrom: '1 May 2026',
    propertyType: 'House',
    description: 'Spacious 3-bedroom family home in the heart of Brighton.',
    allowedActions: [{ code: 'MARK_READY', label: 'Mark as Ready', variant: 'primary' }],
  },
  {
    id: 'prop-002', address: '8 Ocean Drive', suburb: 'Cottesloe', state: 'WA', postcode: '6011',
    bedrooms: 2, bathrooms: 1, parking: 1, weeklyRent: 550, bond: 2200,
    listingStatus: 'READY_TO_LIST', stageLabel: 'Ready to List', availableFrom: '15 Apr 2026',
    propertyType: 'Apartment',
    description: 'Modern 2-bedroom apartment just minutes from Cottesloe Beach.',
    allowedActions: [{ code: 'PUBLISH', label: 'Publish Listing', variant: 'primary' }],
  },
  {
    id: 'prop-003', address: '12 Kings Park Rd', suburb: 'West Perth', state: 'WA', postcode: '6005',
    bedrooms: 4, bathrooms: 2, parking: 2, weeklyRent: 750, bond: 3000,
    listingStatus: 'LISTED', stageLabel: 'Listed', availableFrom: '1 Apr 2026',
    propertyType: 'House',
    description: 'Beautiful 4-bedroom family home near Kings Park.',
    allowedActions: [
      { code: 'OPEN_APPLICATIONS', label: 'Open Applications', variant: 'primary' },
      { code: 'TAKE_OFF_MARKET',   label: 'Take Off Market',   variant: 'secondary' },
      { code: 'MAINTENANCE_HOLD',  label: 'Place on Hold',     variant: 'ghost' },
    ],
  },
  {
    id: 'prop-004', address: '5 Mill Point Rd', suburb: 'South Perth', state: 'WA', postcode: '6151',
    bedrooms: 3, bathrooms: 2, parking: 1, weeklyRent: 600, bond: 2400,
    listingStatus: 'APPLICATIONS_OPEN', stageLabel: 'Accepting Applications', availableFrom: '20 Apr 2026',
    propertyType: 'Townhouse',
    description: 'Stylish 3-bedroom townhouse with city views.',
    allowedActions: [
      { code: 'CLOSE_APPLICATIONS', label: 'Close Applications', variant: 'primary' },
      { code: 'TAKE_OFF_MARKET',    label: 'Take Off Market',    variant: 'secondary' },
    ],
  },
  {
    id: 'prop-005', address: '33 Hay St', suburb: 'Subiaco', state: 'WA', postcode: '6008',
    bedrooms: 2, bathrooms: 1, parking: 1, weeklyRent: 480, bond: 1920,
    listingStatus: 'VACATING_TENANT', occupancyStatus: 'VACATING_TENANT',
    stageLabel: 'Vacating Tenant', availableFrom: '1 May 2027',
    propertyType: 'Apartment',
    description: 'Charming 2-bedroom apartment in vibrant Subiaco.',
    allowedActions: [
      { code: 'RELIST', label: 'Relist Property', variant: 'primary' },
    ],
  },
]

export const ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-001', enquirerName: 'Sarah Johnson', enquirerEmail: 'sarah.j@email.com',
    enquirerPhone: '0412 345 678', message: "Looking for a place near schools for my family.",
    status: 'NEW', submittedAt: 'Today, 10:23am', propertyAddress: '12 Kings Park Rd, West Perth',
    allowedActions: [
      { code: 'MARK_CONTACTED', label: 'Mark as Contacted', variant: 'primary' },
      { code: 'DECLINE', label: 'Decline', variant: 'danger' },
    ],
  },
  {
    id: 'enq-002', enquirerName: 'Michael Chen', enquirerEmail: 'm.chen@email.com',
    enquirerPhone: '0423 456 789', message: 'Very interested in 3BR!',
    status: 'CONTACTED', submittedAt: 'Yesterday, 2:15pm', propertyAddress: '12 Kings Park Rd, West Perth',
    allowedActions: [
      { code: 'SEND_TEMP_ACCESS', label: 'Send Temp Access', variant: 'primary' },
      { code: 'DECLINE', label: 'Decline', variant: 'danger' },
    ],
  },
  {
    id: 'enq-003', enquirerName: 'Emma Williams', enquirerEmail: 'emma.w@email.com',
    enquirerPhone: '0434 567 890', message: '',
    status: 'ACCESS_SENT', submittedAt: '2 days ago', propertyAddress: '12 Kings Park Rd, West Perth',
    allowedActions: [{ code: 'RESEND_ACCESS', label: 'Resend Access', variant: 'secondary' }],
  },
]

export const APPLICATIONS: Application[] = [
  {
    id: 'app-001', applicantName: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '0412 345 678',
    status: 'SUBMITTED', stageLabel: 'Submitted', submittedAt: '28 Mar 2026',
    propertyAddress: '5 Mill Point Rd, South Perth', occupation: 'Teacher', weeklyIncome: 1450,
    allowedActions: [{ code: 'VIEW', label: 'View Application', variant: 'primary' }],
  },
  {
    id: 'app-002', applicantName: 'Michael Chen', email: 'm.chen@email.com', phone: '0423 456 789',
    status: 'SUBMITTED', stageLabel: 'Submitted', submittedAt: '29 Mar 2026',
    propertyAddress: '5 Mill Point Rd, South Perth', occupation: 'Software Engineer', weeklyIncome: 2100,
    allowedActions: [{ code: 'VIEW', label: 'View Application', variant: 'primary' }],
  },
]

const SIGNED_PARTIES = (lessor: string, tenant: string): ESignParty[] => [
  { role: 'LESSOR', name: lessor,          email: 'lessor@email.com',        status: 'SIGNED', signedAt: '15 Mar 2026' },
  { role: 'TENANT', name: tenant,          email: 'tenant@email.com',        status: 'SIGNED', signedAt: '16 Mar 2026' },
  { role: 'PORTFOLIO_MANAGER',  name: 'Sarah Mitchell',email: 's.mitchell@pms.com',      status: 'SIGNED', signedAt: '16 Mar 2026' },
]

export const LEASES: Lease[] = [
  {
    id: 'lease-001', propertyId: 'prop-005',
    propertyAddress: '33 Hay St, Subiaco WA 6008',
    tenantName: 'Sarah Johnson', tenantEmail: 'sarah.j@email.com',
    lessorName: 'Robert & Mary Thompson', portfolioManagerName: 'Sarah Mitchell',
    status: 'GENERATED', stageLabel: 'Generated',
    leaseStart: '1 May 2026', leaseEnd: '30 Apr 2027',
    weeklyRent: 480, bondAmount: 1920, agreementType: 'Fixed Term',
    parties: [
      { role: 'LESSOR', name: 'Robert Thompson', email: 'r.thompson@email.com', status: 'PENDING' },
      { role: 'TENANT', name: 'Sarah Johnson',   email: 'sarah.j@email.com',   status: 'PENDING' },
      { role: 'PORTFOLIO_MANAGER',  name: 'Sarah Mitchell',  email: 's.mitchell@pms.com',  status: 'PENDING' },
    ],
    allowedActions: [{ code: 'SEND_FOR_SIGNATURE', label: 'Send for Signature', variant: 'primary' }],
    bondId: 'bond-001',
  },
  {
    id: 'lease-002', propertyId: 'prop-003',
    propertyAddress: '12 Kings Park Rd, West Perth WA 6005',
    tenantName: 'Michael Chen', tenantEmail: 'm.chen@email.com',
    lessorName: 'Patricia Wong', portfolioManagerName: 'Sarah Mitchell',
    status: 'ACTIVE', stageLabel: 'Active',
    leaseStart: '1 Oct 2025', leaseEnd: '30 May 2026',
    weeklyRent: 750, bondAmount: 3000, agreementType: 'Fixed Term',
    parties: SIGNED_PARTIES('Patricia Wong', 'Michael Chen'),
    allowedActions: [],
    bondId: 'bond-002',
  },
  {
    id: 'lease-003', propertyId: 'prop-004',
    propertyAddress: '5 Mill Point Rd, South Perth WA 6151',
    tenantName: 'Emma Williams', tenantEmail: 'e.williams@email.com',
    lessorName: 'James & Helen Barrett', portfolioManagerName: 'Sarah Mitchell',
    status: 'ACTIVE', stageLabel: 'Active',
    leaseStart: '1 Jan 2026', leaseEnd: '31 Dec 2026',
    weeklyRent: 600, bondAmount: 2400, agreementType: 'Fixed Term',
    parties: SIGNED_PARTIES('James Barrett', 'Emma Williams'),
    allowedActions: [],
    bondId: 'bond-003',
  },
  {
    id: 'lease-004', propertyId: 'prop-002',
    propertyAddress: '8 Ocean Drive, Cottesloe WA 6011',
    tenantName: 'David & Lisa Park', tenantEmail: 'd.park@email.com',
    lessorName: 'Sunita Kapoor', portfolioManagerName: 'Sarah Mitchell',
    status: 'NOTICE_GIVEN', stageLabel: 'Notice Given',
    leaseStart: '1 Jun 2025', leaseEnd: '31 May 2026',
    weeklyRent: 550, bondAmount: 2200, agreementType: 'Fixed Term',
    parties: SIGNED_PARTIES('Sunita Kapoor', 'David Park'),
    allowedActions: [],
    bondId: 'bond-004',
  },
  {
    id: 'lease-005', propertyId: 'prop-001',
    propertyAddress: '24 Chapel St, Brighton WA 6020',
    tenantName: 'James & Priya Nair', tenantEmail: 'james.nair@email.com',
    lessorName: 'George Papadopoulos', portfolioManagerName: 'Sarah Mitchell',
    status: 'ENDED', stageLabel: 'Ended',
    leaseStart: '1 Apr 2025', leaseEnd: '31 Mar 2026',
    weeklyRent: 620, bondAmount: 2480, agreementType: 'Fixed Term',
    parties: SIGNED_PARTIES('George Papadopoulos', 'James Nair'),
    allowedActions: [],
    bondId: 'bond-005',
  },
]

export const BONDS: Bond[] = [
  {
    id: 'bond-001', leaseId: 'lease-001', propertyId: 'prop-005',
    propertyAddress: '33 Hay St, Subiaco WA 6008',
    tenantName: 'Sarah Johnson', status: 'INVOICED', stageLabel: 'Invoiced',
    bondAmount: 1920, amountPaid: 0, invoicedAt: '31 Mar 2026',
    allowedActions: [{ code: 'RECORD_PAYMENT', label: 'Record Payment', variant: 'primary' }],
  },
  {
    id: 'bond-002', leaseId: 'lease-002', propertyId: 'prop-003',
    propertyAddress: '12 Kings Park Rd, West Perth WA 6005',
    tenantName: 'Michael Chen', status: 'LODGED', stageLabel: 'Lodged',
    bondAmount: 3000, amountPaid: 3000, invoicedAt: '25 Sep 2025',
    dmirsReference: 'WA-BND-2025-09-00441',
    allowedActions: [],
  },
  {
    id: 'bond-003', leaseId: 'lease-003', propertyId: 'prop-004',
    propertyAddress: '5 Mill Point Rd, South Perth WA 6151',
    tenantName: 'Emma Williams', status: 'REFUND_IN_PROGRESS', stageLabel: 'Refund in Progress',
    bondAmount: 2400, amountPaid: 2400, invoicedAt: '28 Dec 2025',
    dmirsReference: 'WA-BND-2025-12-00887',
    allowedActions: [],
  },
  {
    id: 'bond-004', leaseId: 'lease-004', propertyId: 'prop-002',
    propertyAddress: '8 Ocean Drive, Cottesloe WA 6011',
    tenantName: 'David & Lisa Park', status: 'LODGED', stageLabel: 'Lodged',
    bondAmount: 2200, amountPaid: 2200, invoicedAt: '1 Jun 2025',
    dmirsReference: 'WA-BND-2025-06-00112',
    allowedActions: [],
  },
  {
    id: 'bond-005', leaseId: 'lease-005', propertyId: 'prop-001',
    propertyAddress: '24 Chapel St, Brighton WA 6020',
    tenantName: 'James & Priya Nair', status: 'REFUNDED', stageLabel: 'Refunded',
    bondAmount: 2480, amountPaid: 2480, invoicedAt: '1 Apr 2025',
    dmirsReference: 'WA-BND-2025-04-00078',
    allowedActions: [],
  },
]

const makePcrSections = (entryMode = false) => [
  {
    id: 's1', name: 'Living Room', overallCondition: 'GOOD' as const, open: true,
    items: [
      { id: 'i1', name: 'Walls',   condition: 'GOOD' as const, notes: '', entryCondition: entryMode ? undefined : 'GOOD' as const },
      { id: 'i2', name: 'Ceiling', condition: 'GOOD' as const, notes: '', entryCondition: entryMode ? undefined : 'GOOD' as const },
      { id: 'i3', name: 'Floor / Carpet', condition: 'FAIR' as const, notes: 'Minor wear near entrance', entryCondition: entryMode ? undefined : 'FAIR' as const },
      { id: 'i4', name: 'Windows & Tracks', condition: 'GOOD' as const, notes: '', entryCondition: entryMode ? undefined : 'GOOD' as const },
      { id: 'i5', name: 'Doors & Handles', condition: 'GOOD' as const, notes: '', entryCondition: entryMode ? undefined : 'GOOD' as const },
    ],
  },
  {
    id: 's2', name: 'Kitchen', overallCondition: 'EXCELLENT' as const, open: false,
    items: [
      { id: 'i6', name: 'Benchtops',         condition: 'EXCELLENT' as const, notes: '' },
      { id: 'i7', name: 'Sink & Tapware',    condition: 'EXCELLENT' as const, notes: '' },
      { id: 'i8', name: 'Oven / Cooktop',    condition: 'GOOD' as const, notes: '' },
      { id: 'i9', name: 'Rangehood',         condition: 'GOOD' as const, notes: '' },
      { id: 'i10', name: 'Cupboards',        condition: 'EXCELLENT' as const, notes: '' },
    ],
  },
  {
    id: 's3', name: 'Bedroom 1', overallCondition: 'GOOD' as const, open: false,
    items: [
      { id: 'i11', name: 'Walls',    condition: 'GOOD' as const, notes: '' },
      { id: 'i12', name: 'Ceiling',  condition: 'GOOD' as const, notes: '' },
      { id: 'i13', name: 'Floor',    condition: 'GOOD' as const, notes: '' },
      { id: 'i14', name: 'Wardrobe', condition: 'GOOD' as const, notes: '' },
      { id: 'i15', name: 'Windows',  condition: 'GOOD' as const, notes: '' },
    ],
  },
  {
    id: 's4', name: 'Bedroom 2', overallCondition: 'GOOD' as const, open: false,
    items: [
      { id: 'i16', name: 'Walls',    condition: 'GOOD' as const, notes: '' },
      { id: 'i17', name: 'Ceiling',  condition: 'GOOD' as const, notes: '' },
      { id: 'i18', name: 'Floor',    condition: 'GOOD' as const, notes: '' },
      { id: 'i19', name: 'Wardrobe', condition: 'GOOD' as const, notes: '' },
    ],
  },
  {
    id: 's5', name: 'Bathroom', overallCondition: 'GOOD' as const, open: false,
    items: [
      { id: 'i20', name: 'Shower / Bath', condition: 'GOOD' as const, notes: '' },
      { id: 'i21', name: 'Toilet',        condition: 'GOOD' as const, notes: '' },
      { id: 'i22', name: 'Vanity & Taps', condition: 'GOOD' as const, notes: '' },
      { id: 'i23', name: 'Tiles',         condition: 'GOOD' as const, notes: '' },
    ],
  },
  {
    id: 's6', name: 'General', overallCondition: 'GOOD' as const, open: false,
    items: [
      { id: 'i24', name: 'Smoke Alarms',  condition: 'EXCELLENT' as const, notes: 'All tested, working' },
      { id: 'i25', name: 'Door Locks',    condition: 'GOOD' as const, notes: '' },
      { id: 'i26', name: 'Meter Readings',condition: 'NA' as const, notes: 'Elec: 4521 kWh · Gas: 892 MJ' },
    ],
  },
]

export const PCRS: PCR[] = [
  {
    id: 'pcr-001', leaseId: 'lease-001', propertyId: 'prop-005',
    propertyAddress: '33 Hay St, Subiaco WA 6008',
    tenantName: 'Sarah Johnson', type: 'ENTRY', status: 'IN_PROGRESS',
    inspectionDate: '1 May 2026',
    sections: makePcrSections(true),
    allowedActions: [{ code: 'SUBMIT_FOR_REVIEW', label: 'Submit for Tenant Review', variant: 'primary' }],
  },
]

export const RENT_SCHEDULES: RentSchedule[] = [
  {
    id: 'rent-001', leaseId: 'lease-001', propertyId: 'prop-005',
    propertyAddress: '33 Hay St, Subiaco WA 6008',
    tenantName: 'Sarah Johnson', weeklyRent: 480,
    frequency: 'WEEKLY', startDate: '1 May 2026',
    invoices: [
      {
        id: 'inv-001', leaseId: 'lease-001', invoiceNumber: 'INV-001',
        periodStart: '1 May 2026', periodEnd: '6 May 2026',
        amount: 274, dueDate: '1 May 2026', paidDate: '1 May 2026',
        paidAmount: 274, status: 'PAID', isProRata: true,
      },
      {
        id: 'inv-002', leaseId: 'lease-001', invoiceNumber: 'INV-002',
        periodStart: '7 May 2026', periodEnd: '13 May 2026',
        amount: 480, dueDate: '7 May 2026', paidDate: '7 May 2026',
        paidAmount: 480, status: 'PAID',
      },
      {
        id: 'inv-003', leaseId: 'lease-001', invoiceNumber: 'INV-003',
        periodStart: '14 May 2026', periodEnd: '20 May 2026',
        amount: 480, dueDate: '14 May 2026', paidDate: '15 May 2026',
        paidAmount: 480, status: 'PAID',
      },
      {
        id: 'inv-004', leaseId: 'lease-001', invoiceNumber: 'INV-004',
        periodStart: '21 May 2026', periodEnd: '27 May 2026',
        amount: 480, dueDate: '21 May 2026',
        status: 'OVERDUE',
      },
    ],
  },
]

export const PROPERTY_TIMELINE: TimelineEntry[] = [
  { id: 't1', action: 'Applications closed',  actor: 'Sarah (Portfolio Manager)', timestamp: '31 Mar 2026, 9:00am' },
  { id: 't2', action: 'Applications opened',  actor: 'Sarah (Portfolio Manager)', timestamp: '24 Mar 2026, 11:30am' },
  { id: 't3', action: 'Listing published',     actor: 'Sarah (Portfolio Manager)', timestamp: '20 Mar 2026, 2:00pm' },
  { id: 't4', action: 'Marked ready to list',  actor: 'Sarah (Portfolio Manager)', timestamp: '18 Mar 2026, 4:15pm' },
  { id: 't5', action: 'Property created',      actor: 'Sarah (Portfolio Manager)', timestamp: '15 Mar 2026, 10:00am' },
]
