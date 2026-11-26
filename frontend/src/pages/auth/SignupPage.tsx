import { useState, type FormEvent } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAccount, getAuthErrorMessage } from "@/lib/firebase"
import { AuthLayout } from "@/pages/auth/AuthLayout"

export function SignupPage() {
  const { configured } = useAuth()
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
    const password = String(formData.get("password") ?? "")
    const confirmation = String(formData.get("confirmPassword") ?? "")

    if (password !== confirmation) {
      setError("Those passwords do not match. Check them and try again.")
      setBusy(false)
      return
    }

    try {
      const result = await createAccount(
        String(formData.get("email") ?? "").trim(),
        password,
        String(formData.get("name") ?? "").trim(),
      )
      setStatus(result.verificationSent
        ? "Your account is ready. Check your inbox for a verification link."
        : "Your account is ready, but we could not send the verification email. You can resend it from your dashboard.")
    } catch (authError) {
      setError(getAuthErrorMessage(authError))
      setBusy(false)
    }
  }

  return (
    <AuthLayout alternateHref="/login" alternateLabel="Already a member?" alternateAction="Sign in">
      <Card className="border-white/10 bg-[#11120f]/90 shadow-[0_24px_100px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <CardContent className="p-6 sm:p-9">
          <Badge variant="outline" className="mb-5">JOIN THE GUILD</Badge>
          <h1 className="text-3xl font-medium tracking-[-.045em]">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Make a home for your collection and the stories behind it.</p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="signup-name">Display name</Label>
              <Input id="signup-name" name="name" type="text" autoComplete="name" placeholder="How should we call you?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email address</Label>
              <Input id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input id="signup-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} placeholder="At least 8 characters" className="pr-12" required />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 grid place-items-center text-xs text-zinc-500 transition hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm password</Label>
              <Input id="signup-confirm-password" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} placeholder="Enter it once more" required />
            </div>

            {!configured && <p role="alert" className="rounded-xl border border-amber-200/15 bg-amber-100/[0.04] px-3.5 py-3 text-xs leading-5 text-amber-100/80">Firebase is not configured. Add the VITE_FIREBASE settings to your local environment file and restart Vite.</p>}
            {error && <p role="alert" className="rounded-xl border border-rose-300/15 bg-rose-300/[0.05] px-3.5 py-3 text-xs leading-5 text-rose-100/90">{error}</p>}
            {status && <p role="status" className="rounded-xl border border-lime-200/15 bg-lime-200/[0.04] px-3.5 py-3 text-xs leading-5 text-lime-100/90">{status}</p>}

            <Button type="submit" disabled={busy || !configured} className="h-12 w-full rounded-xl text-sm">{busy ? "Creating account..." : "Create account"} <span aria-hidden="true">→</span></Button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-zinc-500">We will try to send a verification email after you create your account.</p>
          <p className="mt-6 text-center text-sm text-zinc-500">Already a member? <a href="/login" className="font-medium text-lime-200 underline decoration-lime-200/30 underline-offset-4 transition hover:text-lime-100">Sign in</a></p>
        </CardContent>
      </Card>
      <a href="/" className="mx-auto mt-5 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-300"><span aria-hidden="true">←</span> Back to the guild</a>
    </AuthLayout>
  )
}

export default SignupPage
