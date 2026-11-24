import { useState, type FormEvent } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/pages/auth/AuthLayout"

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState("")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = String(formData.get("password") ?? "")
    const confirmation = String(formData.get("confirmPassword") ?? "")

    if (password !== confirmation) {
      setNotice("Those passwords do not match. Check them and try again.")
      return
    }

    setNotice("Account creation is not connected to an authentication service yet.")
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
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-3 grid place-items-center text-xs text-zinc-500 transition hover:text-white">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm-password">Confirm password</Label>
              <Input id="signup-confirm-password" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} placeholder="Enter it once more" required />
            </div>

            {notice && <p role="status" className="rounded-xl border border-amber-200/15 bg-amber-100/[0.04] px-3.5 py-3 text-xs leading-5 text-amber-100/80">{notice}</p>}

            <Button type="submit" className="h-12 w-full rounded-xl text-sm">Create account <span aria-hidden="true">→</span></Button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-zinc-500">Your password is not sent anywhere in this UI preview because no account service is connected.</p>
          <p className="mt-6 text-center text-sm text-zinc-500">Already a member? <a href="/login" className="font-medium text-lime-200 underline decoration-lime-200/30 underline-offset-4 transition hover:text-lime-100">Sign in</a></p>
        </CardContent>
      </Card>
      <a href="/" className="mx-auto mt-5 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-300"><span aria-hidden="true">←</span> Back to the guild</a>
    </AuthLayout>
  )
}

export default SignupPage
