'use client';

import Link from 'next/link';
import {
  Menu,
  ShoppingCart,
  User,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PaulLogo } from '@/components/icons';
import { useCart } from '@/context/cart-context';
import { CartSheet } from '@/components/cart/cart-sheet';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser, useAuth, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where } from 'firebase/firestore';
import { Product } from '@/lib/types';
import { useAdminAuth } from '@/hooks/use-admin-auth';


export function Header() {
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user } = useUser();
  const { isAdmin } = useAdminAuth();
  const auth = useAuth();
  const router = useRouter();

  const firestore = useFirestore();
  const productsQuery = useMemo(() => {
    if (!firestore) return null;
    const productsRef = collection(firestore, 'products');
    return query(productsRef, where('status', '==', 'active'));
  }, [firestore]);
  const { data: products } = useCollection<Product>(productsQuery);

  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-transparent bg-background/95 backdrop-blur-sm transition-all",
      isScrolled && "border-b-border"
    )}>
      <div className="container flex h-16 items-center px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4">
            <PaulLogo />
          </Link>
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Shop
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground data-[state=open]:text-foreground">
              Categories
              <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition-transform duration-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {categories.map((category) => (
                <DropdownMenuItem key={category} asChild>
                  <Link href={`/category/${category.toLowerCase()}`}>{category}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/account/orders" className="text-muted-foreground transition-colors hover:text-foreground">
            Orders
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader className="text-left">
              <SheetTitle>
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <PaulLogo />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium mt-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Shop
              </Link>
              <Accordion type="single" collapsible className="w-full -my-2">
                <AccordionItem value="categories" className="border-b-0">
                  <AccordionTrigger className="py-2 text-muted-foreground hover:text-foreground hover:no-underline">
                    Categories
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-2 flex flex-col space-y-4 pl-7">
                      {categories.map((category) => (
                        <Link key={category} href={`/category/${category.toLowerCase()}`} className="text-muted-foreground hover:text-foreground">
                          {category}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Link href="/account/orders" className="text-muted-foreground hover:text-foreground">
                Orders
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1 text-center md:hidden">
            <Link href="/" className="inline-flex items-center">
                <PaulLogo />
            </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user ? (
                <>
                  <DropdownMenuItem asChild><Link href="/account">Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/account/orders">Orders</Link></DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/signup">Sign up</Link></DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <CartSheet />
          </Sheet>
        </div>
      </div>
    </header>
  );
}
