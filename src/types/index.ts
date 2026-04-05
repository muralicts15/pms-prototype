export type ListingStatus =
  | 'DRAFT' | 'READY_TO_LIST' | 'LISTED' | 'APPLICATIONS_OPEN'
  | 'UNDER_REVIEW' | 'OFFER_IN_PROGRESS' | 'VACATING_TENANT'
  | 'MAINTENANCE_HOLD' | 'OFF_MARKET' | 'ARCHIVED'

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'ACCESS_SENT' | 'APPLIED' | 'DECLINED'

export type ApplicationStatus =
  | 'IN_PROGRESS' | 'PDF_REVIEW' | 'SUBMITTED'
  | 'APPROVED_FOR_OFFER' | 'DECLINED' | 'WITHDRAWN' | 'EXPIRED'

export type LeaseStatus =
  | 'DRAFT' | 'GENERATED' | 'SENT_FOR_SIGNATURE' | 'PARTIALLY_SIGNED'
  | 'FULLY_SIGNED' | 'UPCOMING' | 'ACTIVE'
  | 'NOTICE_GIVEN' | 'VACATING' | 'ENDED'

export type ESignPartyStatus = 'PENDING' | 'SENT' | 'OPENED' | 'SIGNED' | 'DECLINED'

export type BondStatus =
  | 'INVOICED' | 'PARTIALLY_PAID' | 'RECEIVED' | 'READY_TO_LODGE'
  | 'LODGED' | 'REFUND_IN_PROGRESS' | 'REFUNDED' | 'WAIVED' | 'CANCELLED'

export type PCRType    = 'ENTRY' | 'QUARTERLY' | 'EXIT'
export type PCRStatus  = 'DRAFT' | 'IN_PROGRESS' | 'AWAITING_TENANT_REVIEW' | 'DISPUTED' | 'RESOLUTION_IN_PROGRESS' | 'FINALIZED'
export type Condition  = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'NA'

export type RentStatus = 'ACTIVE' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'WAIVED'
export type RentIncreaseStatus = 'DRAFT' | 'NOTICE_GENERATED' | 'NOTICE_SERVED' | 'EFFECTIVE' | 'CANCELLED'

export interface AllowedAction {
  code: string
  label: string
  variant: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export interface Property {
  id: string
  address: string
  suburb: string
  state: string
  postcode: string
  bedrooms: number
  bathrooms: number
  parking: number
  weeklyRent: number
  bond: number
  listingStatus: ListingStatus
  occupancyStatus?: 'VACANT' | 'TENANTED' | 'VACATING_TENANT'
  stageLabel: string
  availableFrom: string
  propertyType: string
  description: string
  allowedActions: AllowedAction[]
}

export interface Enquiry {
  id: string
  enquirerName: string
  enquirerEmail: string
  enquirerPhone: string
  message: string
  status: EnquiryStatus
  submittedAt: string
  contactedAt?: string
  propertyAddress: string
  allowedActions: AllowedAction[]
}

export interface Application {
  id: string
  applicantName: string
  email: string
  phone: string
  status: ApplicationStatus
  stageLabel: string
  submittedAt: string
  propertyAddress: string
  occupation: string
  weeklyIncome: number
  allowedActions: AllowedAction[]
}

export interface ESignParty {
  role: 'LESSOR' | 'TENANT' | 'PORTFOLIO_MANAGER'
  name: string
  email: string
  status: ESignPartyStatus
  signedAt?: string
}

export interface Lease {
  id: string
  propertyId: string
  propertyAddress: string
  tenantName: string
  tenantEmail: string
  lessorName: string
  portfolioManagerName: string
  status: LeaseStatus
  stageLabel: string
  leaseStart: string
  leaseEnd: string
  weeklyRent: number
  bondAmount: number
  agreementType: 'Fixed Term' | 'Periodic'
  parties: ESignParty[]
  allowedActions: AllowedAction[]
  bondId?: string
}

export interface Bond {
  id: string
  leaseId: string
  propertyId: string
  propertyAddress: string
  tenantName: string
  status: BondStatus
  stageLabel: string
  bondAmount: number
  amountPaid: number
  invoicedAt: string
  dmirsReference?: string
  allowedActions: AllowedAction[]
}

export interface PCRItem {
  id: string
  name: string
  condition: Condition
  notes: string
  entryCondition?: Condition
  disputed?: boolean
  disputeReason?: string
  resolved?: boolean
}

export interface PCRSection {
  id: string
  name: string
  overallCondition: Condition
  items: PCRItem[]
  open?: boolean
}

export interface PCR {
  id: string
  leaseId: string
  propertyId: string
  propertyAddress: string
  tenantName: string
  type: PCRType
  status: PCRStatus
  inspectionDate: string
  sections: PCRSection[]
  allowedActions: AllowedAction[]
  entryPcrId?: string
}

export interface RentInvoice {
  id: string
  leaseId: string
  invoiceNumber: string
  periodStart: string
  periodEnd: string
  amount: number
  dueDate: string
  paidDate?: string
  paidAmount?: number
  status: RentStatus
  isProRata?: boolean
}

export interface RentSchedule {
  id: string
  leaseId: string
  propertyId: string
  propertyAddress: string
  tenantName: string
  weeklyRent: number
  frequency: 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY'
  startDate: string
  invoices: RentInvoice[]
  rentIncreaseStatus?: RentIncreaseStatus
  proposedRent?: number
  increaseEffectiveDate?: string
}

export interface TimelineEntry {
  id: string
  action: string
  actor: string
  timestamp: string
  note?: string
}
