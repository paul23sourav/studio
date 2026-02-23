'use client';

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
    { href: "/account", label: "Profile" },
    { href: "/account/orders", label: "Orders" },
]

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </nav>
            </aside>
            <div className="flex-1">
              <div className="space-y-6">
                <div>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64 mt-2" />
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
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-32" />
                    </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    // This is a placeholder for active link styling. In a real app, you'd use usePathname.
                    // "bg-accent text-accent-foreground"
                )}
                >
                {item.label}
                </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
