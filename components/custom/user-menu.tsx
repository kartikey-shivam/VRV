import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { ChevronDownIcon, LogOutIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { toast } from 'sonner'
export interface IUser {
    id: string
    firstName: string
    lastName: string
    avatar: string
    email: string
}
export function UserMenu() {
    const router = useRouter()
    const [user, setUser] = useState<IUser>({
        id: '',
        firstName: '',
        lastName: '',
        avatar: '',
        email: '',
    })
    useEffect(() => {
        fetchUserDetails()
    }, [])
    const fetchUserDetails = async () => {
        try {
            const {
                data: {
                    data: { user },
                },
            } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
                withCredentials: true,
            })
            if (!user) router.push('/login')
            setUser(user)
        } catch (error) {
            console.log(error)
        }
    }
    const handleLogout = async () => {
        try {
            const {
                data: { success, message },
            } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
                withCredentials: true,
            })
            if (success) {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                toast.success(message)
                router.push('/login')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10 h-11">
                    <Avatar>
                        <AvatarImage src={user.avatar} alt={user.firstName} />
                        <AvatarFallback className="bg-white/10 text-white">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{user.firstName}</span>
                    <ChevronDownIcon className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{`${user.firstName} ${user.lastName}`}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
