import FirebaseAuth from "@/components/auth/firebase-auth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login or Sign up</CardTitle>
          <CardDescription>
            Use one of the providers below to access your account or create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FirebaseAuth />
        </CardContent>
      </Card>
    </div>
  )
}
