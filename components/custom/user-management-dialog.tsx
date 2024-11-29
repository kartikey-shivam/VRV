"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { setLocale } from "yup"
import axios from "axios"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

// Validation Schema

export function UserManagementDialog() {
    const [open, setOpen] = useState(false)
    const [permission, setPermissions] = useState<string[]>([]);
    const [users,setUsers]=useState<string[]>() // Array to store selected permissions
    const [email,setEmail]=useState<String>()
    const [isLoading,setIsLoading]= useState(false)
    // Function to handle adding/removing permissions
    const togglePermission = (permission: string, isChecked: boolean) => {
      if (isChecked) {
        // Add the permission if checked
        setPermissions((prev) => [...prev, permission]);
      } else {
        // Remove the permission if unchecked
        setPermissions((prev) => prev.filter((perm) => perm !== permission));
      }
    };
  
    const handleSubmit = async ()=>{
        setIsLoading(true)
        try {
            
            const { data: { success, message } } = await axios.patch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/permission/update`,
                {email,permission},
                { withCredentials: true }
            )

            if (success) {
                toast.success(message)
                setOpen(false)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update permission')
        } finally {
            setIsLoading(false)
        }
    }
    const fetchUsers=async ()=>{
        try {
            const { data: { success, message,data:{userEmails} } } = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/all`,{ withCredentials: true })
                setUsers(userEmails)
                if (success) {
                    toast.success(message)
                }
        } catch (error) {
            toast.error('Failed to fetch users')
        }
    }
    useEffect(()=>{
        fetchUsers()
    },[])
   

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">User Management</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="top-0 bg-background z-10 pb-4">
                    <DialogTitle className="mb-4">User Management</DialogTitle>
                </DialogHeader>
                <div>
               {users && <div className="grid gap-4">
                            <Label htmlFor="user">User</Label>
                            <Select
                                name="user"
                                value={typeof email === 'string' ? email : undefined}
                                onValueChange={(value) => {setEmail(value)}}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user,index) => (
                                        <SelectItem key={index} value={user}>
                                            {user}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                           
                        </div>}

                </div>
            <div className="flex justify-between">
              
              <div className="flex items-center justify-between w-1/3 w-1/2 mr-4">
                <Label htmlFor="create-transaction">Create Transaction</Label>
                <Switch id="create-transaction"   onCheckedChange={(checked) =>
                    togglePermission('Create_transaction', checked) }  />
              </div>
              <div className="flex items-center justify-between w-1/3 mr-4">
                <Label htmlFor="cron-job-access">Cron Job Access</Label>
                <Switch id="cron-job-access" onCheckedChange={(checked) =>
                    togglePermission('Cron_job_access', checked) }   />
              </div>
            </div>
              <div  className="flex justify-between">
                <div className="flex items-center justify-between w-1/3 w-1/2 mr-4">
                  <Label htmlFor="download-report">Download Report</Label>
                  <Switch id="download-report" onCheckedChange={(checked) =>
                    togglePermission('Download_report', checked) }   />
                </div>
                <div className="flex items-center justify-between w-1/3 mr-4">
                  <Label htmlFor="generate-report">Generate Report</Label>
                  <Switch id="generate-report" onCheckedChange={(checked) =>
                    togglePermission('Generate_report', checked) }   />
                </div>
                
              </div>
              <div className="flex justify-between">
              <div className="flex items-center justify-between w-1/3 mr-4">
                  <Label htmlFor="user-permission-update">User Permission Update</Label>
                  <Switch id="user-permission-update" onCheckedChange={(checked) =>
                    togglePermission('User_permission_update', checked) }   />
                </div>
              
                <div className="flex items-center justify-between w-1/3 mr-4">
                  <Label htmlFor="user-role-update">User Role Update</Label>
                  <Switch id="user-role-update" onCheckedChange={(checked) =>
                    togglePermission('User_role_update', checked) }  />
                </div>
              </div>
              <Button
                        type="submit"
                        className="mt-4"
                        onClick={handleSubmit}
                    >
                        {isLoading ? 'Updating...' : 'Update Permission'}
                    </Button>
            </DialogContent>
        </Dialog>
    )
}
