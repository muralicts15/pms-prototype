import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type PortalRole = 'PORTFOLIO_DIRECTOR' | 'PORTFOLIO_MANAGER'

interface RoleContextType {
  currentRole: PortalRole
  setCurrentRole: (role: PortalRole) => void
}

const RoleContext = createContext<RoleContextType>({
  currentRole: 'PORTFOLIO_MANAGER',
  setCurrentRole: () => {},
})

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<PortalRole>('PORTFOLIO_MANAGER')
  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => useContext(RoleContext)
