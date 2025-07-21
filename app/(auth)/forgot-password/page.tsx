"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForgotPassword } from "@/lib/api/auth";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPassword = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await forgotPassword.mutateAsync(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>
            We've sent a password reset link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              If you don't see the email, check your spam folder. The link will
              expire in 1 hour.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fedpoffa-purple/10">
          <Mail className="h-6 w-6 text-fedpoffa-purple" />
        </div>
        <CardTitle className="text-2xl">Forgot Password?</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={forgotPassword.isPending}
            />
          </div>

          {forgotPassword.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {forgotPassword.error?.message ||
                  "Failed to send reset email. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-fedpoffa-purple hover:bg-fedpoffa-purple/90"
            disabled={forgotPassword.isPending}
          >
            {forgotPassword.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
