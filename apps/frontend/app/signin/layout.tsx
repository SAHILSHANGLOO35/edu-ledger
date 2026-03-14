import { AuthProvider } from "@/lib/auth-context"

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}
