'use client';

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCurrency } from "@/context/currency-context";

const orders = [
    {
      id: "ORD001",
      date: "2024-05-15",
      status: "Shipped",
      total: 120.00,
    },
    {
      id: "ORD002",
      date: "2024-05-18",
      status: "Processing",
      total: 75.00,
    },
    {
      id: "ORD003",
      date: "2024-05-21",
      status: "Delivered",
      total: 249.99,
    },
    {
      id: "ORD004",
      date: "2024-06-02",
      status: "Shipped",
      total: 180.00,
    }
]

export default function OrderHistoryPage() {
  const { formatCurrency } = useCurrency();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          A list of your past orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                        <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
