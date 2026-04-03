import { useState } from 'react'
import { FileText, Download, Eye, CheckCircle2, Lock } from 'lucide-react'

type DocType = 'LEASE' | 'TENANT_INFO' | 'BOND' | 'PCR' | 'NOTICE'

interface Document {
  id: string
  name: string
  type: DocType
  description: string
  generatedDate: string
  version: string
  size: string
}

const DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: 'Residential Tenancy Agreement (Form 1AA)',
    type: 'LEASE',
    description: 'Your signed lease agreement for 12 Kings Park Rd. All parties have signed.',
    generatedDate: '16 Sep 2025',
    version: '1.0',
    size: '842 KB',
  },
  {
    id: 'doc-002',
    name: 'Information for Tenant (Form 1AC)',
    type: 'TENANT_INFO',
    description: 'WA government information document outlining your rights and obligations as a tenant.',
    generatedDate: '16 Sep 2025',
    version: '1.0',
    size: '1.2 MB',
  },
  {
    id: 'doc-003',
    name: 'Entry Condition Report (PCR)',
    type: 'PCR',
    description: 'Property condition at lease commencement — 1 October 2025. Acknowledged by tenant.',
    generatedDate: '1 Oct 2025',
    version: '1.0',
    size: '3.4 MB',
  },
  {
    id: 'doc-004',
    name: 'Quarterly Inspection Report — Apr 2026',
    type: 'PCR',
    description: 'Routine inspection conducted 15 April 2026. Pending tenant acknowledgement.',
    generatedDate: '15 Apr 2026',
    version: '1.0',
    size: '2.1 MB',
  },
  {
    id: 'doc-005',
    name: 'Notice of Rent Increase (Form 20)',
    type: 'NOTICE',
    description: 'Rent increase from $700 to $750/wk effective 1 April 2026. 60 days notice given.',
    generatedDate: '15 Jan 2026',
    version: '1.0',
    size: '124 KB',
  },
  {
    id: 'doc-006',
    name: 'Notice of Inspection (Form 19)',
    type: 'NOTICE',
    description: 'Routine inspection notice for 15 April 2026, 10:00am–11:00am.',
    generatedDate: '2 Apr 2026',
    version: '1.0',
    size: '98 KB',
  },
]

const TYPE_COLORS: Record<DocType, string> = {
  LEASE:       'bg-blue-100 text-blue-700 border-blue-200',
  TENANT_INFO: 'bg-purple-100 text-purple-700 border-purple-200',
  BOND:        'bg-emerald-100 text-emerald-700 border-emerald-200',
  PCR:         'bg-amber-100 text-amber-700 border-amber-200',
  NOTICE:      'bg-gray-100 text-gray-600 border-gray-200',
}

const TYPE_LABELS: Record<DocType, string> = {
  LEASE:       'Lease',
  TENANT_INFO: 'Tenant Info',
  BOND:        'Bond',
  PCR:         'Condition Report',
  NOTICE:      'Notice',
}

export default function TenantDocuments() {
  const [downloading, setDownloading] = useState<string | null>(null)

  function handleDownload(docId: string) {
    setDownloading(docId)
    setTimeout(() => setDownloading(null), 1500)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Documents</h1>
      <p className="text-sm text-gray-500 mb-5">12 Kings Park Rd, West Perth WA 6005</p>

      {/* Security note */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 mb-5">
        <Lock size={13} className="text-gray-400 flex-shrink-0" />
        Documents are encrypted and only accessible to you. Download links expire after 15 minutes.
      </div>

      <div className="space-y-2">
        {DOCUMENTS.map(doc => (
          <div key={doc.id} className="card p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-gray-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TYPE_COLORS[doc.type]}`}>
                  {TYPE_LABELS[doc.type]}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{doc.description}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Generated {doc.generatedDate} · v{doc.version} · {doc.size}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Preview"
              >
                <Eye size={15} />
              </button>
              <button
                className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium ${
                  downloading === doc.id
                    ? 'text-green-600 bg-green-50'
                    : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                }`}
                onClick={() => handleDownload(doc.id)}
                title="Download"
              >
                {downloading === doc.id
                  ? <CheckCircle2 size={15} />
                  : <Download size={15} />
                }
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
        <strong>Need a document not listed here?</strong> Contact your property manager Sarah Mitchell at s.mitchell@pms.com and she can send you a copy.
      </div>
    </div>
  )
}
