import { ReactNode, createContext, useState } from "react"

interface RoleContextType {
    role: string,
    setRole: React.Dispatch<React.SetStateAction<string>>
}

interface RoleProviderProps {
    children: ReactNode;
  }

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<RoleProviderProps> = ({children}) => {
    const [role, setRole] = useState<string>('USER')

    return (
        <RoleContext.Provider value={{ role, setRole }}>
          {children}
        </RoleContext.Provider>
      );
}