'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/context/currency-context"
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { SeedDatabase } from "./seed-database";

export default function AccountPage() {
  const { currency, setCurrency } = useCurrency();
  const { user, loading } = useUser();

  if (loading) {
      return (
          <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
              </div>
              <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-10 w-48" />
                      </div>
                  </CardContent>
                  <CardFooter>
                      <Skeleton className="h-10 w-32" />
                  </CardFooter>
              </Card>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account's profile information and currency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.displayName || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'INR')}>
              <SelectTrigger id="currency" className="w-[180px]">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
      <SeedDatabase />
    </div>
  )
}
