'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore } from "@/firebase";
import { products as productData } from "@/lib/products";
import { collection, doc, writeBatch } from "firebase/firestore";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { v4 as uuidv4 } from 'uuid';

export function SeedDatabase() {
    const firestore = useFirestore();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSeed = () => {
        if (!firestore) {
             toast({
                variant: "destructive",
                title: "Firestore not available",
                description: "Please check your Firebase configuration.",
            });
            return;
        }
        setLoading(true);

        const batch = writeBatch(firestore);
        const productsCollection = collection(firestore, "products");

        const productsWithIds = productData.map(product => ({
            ...product,
            id: `${product.name.toLowerCase().replace(/\s+/g, '-')}-${uuidv4().split('-')[0]}`,
        }));


        productsWithIds.forEach((product) => {
            const docRef = doc(productsCollection, product.id);
            batch.set(docRef, product);
        });

        batch.commit()
            .then(() => {
                toast({
                    title: "Database seeded!",
                    description: `${productsWithIds.length} products have been added.`,
                });
            })
            .catch((serverError) => {
                console.error("Seed error", serverError);
                const permissionError = new FirestorePermissionError({
                    path: '/products',
                    operation: 'write',
                    requestResourceData: { note: `Batch write for ${productsWithIds.length} products.` },
                });
                errorEmitter.emit('permission-error', permissionError);
                 toast({
                    variant: "destructive",
                    title: "Permission Denied",
                    description: "You must be an admin to seed the database. See console for details.",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Developer Tools</CardTitle>
                <CardDescription>
                    Seed your Firestore database with product data. This will overwrite any existing products with the same ID. This action requires admin privileges.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleSeed} disabled={loading || !firestore}>
                    {loading ? "Seeding..." : "Seed Product Database"}
                </Button>
            </CardContent>
        </Card>
    );
}
