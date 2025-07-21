import { FedpoffaLogo } from "@/components/ui/fedpoffa-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fedpoffa-purple/5 via-white to-fedpoffa-orange/5">
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Auth form */}

        {/* Right side - Branding/Info */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-fedpoffa-purple to-fedpoffa-orange" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <FedpoffaLogo className="h-8 w-auto text-white" />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Empowering students and lecturers with modern digital
                assessment tools for enhanced learning outcomes."
              </p>
              <footer className="text-sm">FEDPOFFA CBT Portal</footer>
            </blockquote>
          </div>
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center mb-6">
              <FedpoffaLogo className="h-12 w-auto" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Federal Polytechnic Offa
            </h1>
            <p className="text-sm text-muted-foreground">
              Computer Based Test Portal
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
