import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface Professional {
  id: string;
  name: string;
  specialties?: string[];
}

interface HeaderAdminNavigationProps {
  isGestionTurnosActive: boolean
  isDropdownOpen: boolean
  setIsDropdownOpen: (open: boolean) => void
  loadingPros: boolean
  professionals: Professional[]
  handleProfessionalSelect: (id: string) => void
}

export function HeaderAdminNavigation({
  isGestionTurnosActive,
  isDropdownOpen,
  setIsDropdownOpen,
  loadingPros,
  professionals,
  handleProfessionalSelect,
}: HeaderAdminNavigationProps) {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link 
        href="/admin" 
        className={` 
          ${isGestionTurnosActive ? 
            "text-background/60 pointer-events-none cursor-default" : 
            "text-background cursor-pointer hover:text-primary"
          } 
          font-medium text-sm
        `}
      >
        Gestión turnos
      </Link>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1 transition-colors text-sm focus:outline-none text-background cursor-pointer hover:text-primary"
        >
          Agenda semanal
          <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover shadow-lg z-50 py-1 animate-in fade-in-50 slide-in-from-top-1">
            {loadingPros ? (
              <div className="px-4 py-2 text-xs text-muted-foreground">Cargando profesionales...</div>
            ) : !Array.isArray(professionals) || professionals.length === 0 ? (
              <div className="px-4 py-2 text-xs text-muted-foreground">No hay profesionales.</div>
            ) : (
              professionals.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => handleProfessionalSelect(pro.id)}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-normal cursor-pointer block truncate"
                >
                  <span className="block font-medium">{pro.name}</span>
                  <span className="block text-[10px] text-muted-foreground truncate">
                    {pro.specialties?.[0] || "Odontología"}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </nav>
  )
}