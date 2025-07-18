interface FedpoffaLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function FedpoffaLogo({ size = "md", showText = true, className = "" }: FedpoffaLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full fedpoffa-gradient flex items-center justify-center`}>
        <span className="text-white font-bold text-lg">F</span>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>FEDPOFFA</span>
          <span className="text-xs text-gray-600 -mt-1">CBT Portal</span>
        </div>
      )}
    </div>
  )
}
