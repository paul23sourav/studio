'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/context/currency-context"
import { useUser, useAuth, useFirestore } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { SeedDatabase } from "./seed-database";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function AccountPage() {
  const { currency, setCurrency } = useCurrency();
  const { user, loading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);
  
  const handleSaveChanges = async () => {
    if (!user || !auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to save changes.',
      });
      return;
    }

    if (displayName === user.displayName) {
        toast({
            title: "No Changes",
            description: "You haven't made any changes to your name.",
        });
        return;
    }

    setIsSaving(true);
    
    try {
      await updateProfile(user, { displayName });
    } catch (error) {
      console.error("Auth profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update your authentication profile.",
      });
      setIsSaving(false);
      return;
    }

    const userDocRef = doc(firestore, 'users', user.uid);
    const updatedData = { displayName };

    updateDoc(userDocRef, updatedData)
      .then(() => {
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved.",
        });
      })
      .catch((serverError) => {
        console.error("Firestore update error:", serverError);
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: updatedData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: 'Failed to save changes to the database. You may not have permission.',
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

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
            <Input 
              id="name" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email || ""} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'INR')} disabled={isSaving}>
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
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </Button>
        </CardFooter>
      </Card>
      <SeedDatabase />
    </div>
  )
}
