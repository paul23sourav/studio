import { cn } from "@/lib/utils";

export const PaulLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 140 30"
    className={cn("h-7 w-auto text-primary", className)}
    {...props}
    fill="currentColor"
  >
    <title>PAUL</title>
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontFamily="'Inter', sans-serif"
      fontSize="26"
      fontWeight="800"
      letterSpacing="0.1em"
    >
      PAUL
    </text>
  </svg>
);
