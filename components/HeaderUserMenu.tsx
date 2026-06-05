import Link from "next/link"
import { ChevronDown, User as UserIcon, LogOut, Settings } from "lucide-react"
import { type User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderUserMenuProps {
    user: User | null
    role?: string
    loadingUser: boolean
    isAdminPage: boolean
    setIsLoginModalOpen: (open: boolean) => void
    handleLogout: () => void
}

export function HeaderUserMenu({
  user,
  role,
  loadingUser,
  isAdminPage,
  setIsLoginModalOpen,
  handleLogout,
}: HeaderUserMenuProps) {
  if (loadingUser) return <div className="w-10 h-10" /> // Placeholder rápido mientras carga

  if (!user) {
    return (
      <Button 
        variant="ghost" 
        onClick={() => setIsLoginModalOpen(true)}
        className={`group cursor-pointer gap-2 font-medium px-3 h-10 hover:text-primary hover:bg-muted/0 ${
          isAdminPage ? "text-background" : "text-foreground"
        }`}
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
          isAdminPage 
            ? "bg-background/20 text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        }`}>
          <UserIcon className="h-4 w-4" />
        </div>
        <span>Invitado</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`group cursor-pointer gap-2 font-medium px-3 h-10 focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-primary hover:bg-muted/0 ${
            isAdminPage ? "text-background" : "text-foreground"
          }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
            isAdminPage 
              ? "bg-background/20 text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          }`}>
            <UserIcon className="h-4 w-4" />
          </div>
          <span className="max-w-[120px] truncate">
            {user.user_metadata?.full_name || user.email?.split("@")[0]}
          </span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-1 w-56 mt-1 z-50">
        {role === 'admin' && !isAdminPage && (
          <DropdownMenuItem asChild className="hover:bg-muted focus:bg-muted focus:text-primary cursor-pointer font-semibold text-primary">
            <Link href="/admin">
              <Settings className="h-4 w-4" />
              Panel de Administración
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="hover:bg-muted focus:bg-muted focus:text-primary cursor-pointer">
          <Link href="/perfil">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Configurar usuario
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-destructive data-[highlighted]:bg-destructive/10 data-[highlighted]:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}