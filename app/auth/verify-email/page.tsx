"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVerifyEmail, useResendVerification } from "@/lib/api/auth";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [resendEmail, setResendEmail] = useState("");

  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setIsLoading(false);
      setError("Invalid or missing verification token.");
    }
  }, [token]);

  const handleVerification = async () => {
    if (!token) return;

    try {
      await verifyEmail.mutateAsync(token);
      setIsVerified(true);
    } catch (error: any) {
      setError(error.message || "Failed to verify email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await resendVerification.mutateAsync(resendEmail);
      setError("");
      // Show success message
    } catch (error: any) {
      setError(error.message || "Failed to resend verification email.");
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-fedpoffa-purple/10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fedpoffa-purple"></div>
          </div>
          <CardTitle className="text-2xl">Verifying Email</CardTitle>
          <CardDescription>
            Please wait while we verify your email address...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isVerified) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">
            Email Verified Successfully
          </CardTitle>
          <CardDescription>
            Your email address has been verified. You can now access all
            features of your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your account is now fully activated. You can log in and start
              using the platform.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Invalid Verification Link</CardTitle>
          <CardDescription>
            The email verification link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please request a new verification email or contact support if you
              continue to have issues.
            </AlertDescription>
          </Alert>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fedpoffa-purple"
              />
            </div>
            <Button
              onClick={handleResendVerification}
              disabled={resendVerification.isPending}
              className="w-full bg-fedpoffa-purple hover:bg-fedpoffa-purple/90"
            >
              {resendVerification.isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </div>
          <Button asChild variant="outline" className="w-full">
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
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-2xl">Verification Failed</CardTitle>
        <CardDescription>
          We couldn't verify your email address. The link may have expired or is
          invalid.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ||
              "The verification link is invalid or has expired. Please request a new one."}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fedpoffa-purple"
            />
          </div>
          <Button
            onClick={handleResendVerification}
            disabled={resendVerification.isPending}
            className="w-full bg-fedpoffa-purple hover:bg-fedpoffa-purple/90"
          >
            {resendVerification.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
