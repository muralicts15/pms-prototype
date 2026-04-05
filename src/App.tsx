import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'

// Agent pages
import PropertyList       from './pages/agent/PropertyList'
import PropertyDetail     from './pages/agent/PropertyDetail'
import PropertyWizard     from './pages/agent/PropertyWizard'
import EnquiryDashboard   from './pages/agent/EnquiryDashboard'
import ApplicationList    from './pages/agent/ApplicationList'
import ApplicationDetail  from './pages/agent/ApplicationDetail'
import LeaseList          from './pages/agent/LeaseList'
import LeaseDetail        from './pages/agent/LeaseDetail'
import BondList           from './pages/agent/BondList'
import BondDetail         from './pages/agent/BondDetail'
import PCRList            from './pages/agent/PCRList'
import PCRDetail          from './pages/agent/PCRDetail'
import RentDashboard      from './pages/agent/RentDashboard'
import RentLedger         from './pages/agent/RentLedger'

// Public pages
import SearchPortal         from './pages/public/SearchPortal'
import PublicPropertyDetail from './pages/public/PublicPropertyDetail'

// Applicant pages
import Login                from './pages/applicant/Login'
import Form18Wizard         from './pages/applicant/Form18Wizard'
import ApplicationSubmitted from './pages/applicant/ApplicationSubmitted'

// Tenant portal
import TenantLayout      from './components/layout/TenantLayout'
import TenantDashboard   from './pages/tenant/TenantDashboard'
import TenantRent        from './pages/tenant/TenantRent'
import TenantPCR         from './pages/tenant/TenantPCR'
import TenantNotices     from './pages/tenant/TenantNotices'
import TenantBond        from './pages/tenant/TenantBond'
import TenantMaintenance from './pages/tenant/TenantMaintenance'
import TenantDocuments   from './pages/tenant/TenantDocuments'

export default function App() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/pm/properties" replace />} />

      {/* Agent portal — with sidebar layout */}
      <Route path="/pm" element={<AppLayout />}>
        <Route index element={<Navigate to="/pm/properties" replace />} />
        <Route path="properties"                    element={<PropertyList />} />
        <Route path="properties/new"                element={<PropertyWizard />} />
        <Route path="properties/:id"                element={<PropertyDetail />} />
        <Route path="enquiries"                     element={<EnquiryDashboard />} />
        <Route path="applications"                  element={<ApplicationList />} />
        <Route path="applications/:id"              element={<ApplicationDetail />} />
        <Route path="leases"                        element={<LeaseList />} />
        <Route path="leases/:id"                    element={<LeaseDetail />} />
        <Route path="bonds"                         element={<BondList />} />
        <Route path="bonds/:id"                     element={<BondDetail />} />
        <Route path="pcr"                           element={<PCRList />} />
        <Route path="pcr/:id"                       element={<PCRDetail />} />
        <Route path="rent"                          element={<RentDashboard />} />
        <Route path="rent/:id"                      element={<RentLedger />} />
      </Route>

      {/* Public portal — no sidebar */}
      <Route path="/public/search"               element={<SearchPortal />} />
      <Route path="/public/properties/:id"       element={<PublicPropertyDetail />} />

      {/* Applicant flow — no sidebar */}
      <Route path="/applicant/login"     element={<Login />} />
      <Route path="/applicant/apply"     element={<Form18Wizard />} />
      <Route path="/applicant/submitted" element={<ApplicationSubmitted />} />

      {/* Tenant portal */}
      <Route path="/tenant" element={<TenantLayout />}>
        <Route index element={<Navigate to="/tenant/home" replace />} />
        <Route path="home"        element={<TenantDashboard />} />
        <Route path="rent"        element={<TenantRent />} />
        <Route path="pcr"         element={<TenantPCR />} />
        <Route path="notices"     element={<TenantNotices />} />
        <Route path="bond"        element={<TenantBond />} />
        <Route path="maintenance" element={<TenantMaintenance />} />
        <Route path="documents"   element={<TenantDocuments />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/pm/properties" replace />} />
    </Routes>
  )
}
