import { useState, type FormEvent } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAuthErrorMessage, sendPasswordReset, signInAccount } from "@/lib/firebase"
import { AuthLayout } from "@/pages/auth/AuthLayout"

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a16.8 16.8 0 0 1-3 3.9M6.2 6.3C3.5 8.1 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4-.8" /></svg>
  )
}

export function LoginPage() {
  const { configured } = useAuth()
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setStatus("")
    setBusy(true)
    const formData = new FormData(event.currentTarget)

    try {
      await signInAccount(email.trim(), String(formData.get("password") ?? ""))
    } catch (authError) {
      setError(getAuthErrorMessage(authError))
    } finally {
      setBusy(false)
    }
  }

  async function handlePasswordReset() {
    setError("")
    setStatus("")
    if (!email.trim()) {
      setError("Enter your email address first, then choose Forgot password.")
      return
    }

    setBusy(true)
    try {
      await sendPasswordReset(email.trim())
      setStatus("If an account exists for that address, Firebase will send a password reset email.")
    } catch (authError) {
      setError(getAuthErrorMessage(authError))
    } finally {
      setBusy(false)
    }
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
              <Input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="login-password">Password</Label>
                <button type="button" onClick={handlePasswordReset} disabled={busy || !configured} className="text-xs text-zinc-500 transition hover:text-red-400 disabled:opacity-40">Forgot password?</button>
              </div>
              <div className="relative">
                <Input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" className="pr-12" required />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 grid place-items-center text-zinc-500 transition hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {!configured && <p role="alert" className="rounded-xl border border-amber-200/15 bg-amber-100/[0.04] px-3.5 py-3 text-xs leading-5 text-amber-100/80">Firebase is not configured. Add the VITE_FIREBASE settings to your local environment file and restart Vite.</p>}
            {error && <p role="alert" className="rounded-xl border border-rose-300/15 bg-rose-300/[0.05] px-3.5 py-3 text-xs leading-5 text-rose-100/90">{error}</p>}
            {status && <p role="status" className="rounded-xl border border-red-400/15 bg-red-400/[0.04] px-3.5 py-3 text-xs leading-5 text-red-300/90">{status}</p>}

            <Button type="submit" disabled={busy || !configured} className="h-12 w-full rounded-xl text-sm">{busy ? "Please wait..." : "Sign in"} <span aria-hidden="true">→</span></Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-[10px] tracking-[.16em] text-zinc-600">
            <span className="h-px flex-1 bg-white/[0.08]" />
            WALLET CONNECTION COMING LATER
            <span className="h-px flex-1 bg-white/[0.08]" />
          </div>
          <p className="text-center text-xs leading-5 text-zinc-500">Email and password authentication is handled by Firebase.</p>
          <p className="mt-7 text-center text-sm text-zinc-500">New to the guild? <a href="/signup" className="font-medium text-red-400 underline decoration-red-400/30 underline-offset-4 transition hover:text-red-300">Create an account</a></p>
        </CardContent>
      </Card>
      <a href="/" className="mx-auto mt-5 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-300"><span aria-hidden="true">←</span> Back to the guild</a>
    </AuthLayout>
  )
}

export default LoginPage
