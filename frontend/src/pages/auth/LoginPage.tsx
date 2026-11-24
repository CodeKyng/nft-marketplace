import { useState, type FormEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/pages/auth/AuthLayout"

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a16.8 16.8 0 0 1-3 3.9M6.2 6.3C3.5 8.1 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4-.8" /></svg>
  )
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice("Sign-in is not connected to an authentication service yet.")
  }

  return (
    <AuthLayout alternateHref="/signup" alternateLabel="New here?" alternateAction="Create an account">
      <Card className="border-white/10 bg-[#11120f]/90 shadow-[0_24px_100px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <CardContent className="p-6 sm:p-9">
          <Badge variant="outline" className="mb-5">MEMBER ACCESS</Badge>
          <h1 className="text-3xl font-medium tracking-[-.045em]">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Sign in to return to your corner of the guild.</p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="login-email">Email address</Label>
              <Input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="login-password">Password</Label>
                <span className="text-xs text-zinc-600">Forgot password?</span>
              </div>
              <div className="relative">
                <Input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" className="pr-12" required />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 grid place-items-center text-zinc-500 transition hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {notice && <p role="status" className="rounded-xl border border-amber-200/15 bg-amber-100/[0.04] px-3.5 py-3 text-xs leading-5 text-amber-100/80">{notice}</p>}

            <Button type="submit" className="h-12 w-full rounded-xl text-sm">Sign in <span aria-hidden="true">→</span></Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] tracking-[.16em] text-zinc-600">
            <span className="h-px flex-1 bg-white/[0.08]" />
            WALLET CONNECTION COMING LATER
            <span className="h-px flex-1 bg-white/[0.08]" />
          </div>
          <p className="text-center text-xs leading-5 text-zinc-500">The contracts are live on Base Sepolia. This form is a UI preview; no account service is connected.</p>

          <p className="mt-7 text-center text-sm text-zinc-500">New to the guild? <a href="/signup" className="font-medium text-lime-200 underline decoration-lime-200/30 underline-offset-4 transition hover:text-lime-100">Create an account</a></p>
        </CardContent>
      </Card>
      <a href="/" className="mx-auto mt-5 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-300"><span aria-hidden="true">←</span> Back to the guild</a>
    </AuthLayout>
  )
}

export default LoginPage
