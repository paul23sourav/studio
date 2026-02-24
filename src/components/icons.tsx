import { cn } from "@/lib/utils";

export const PaulLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 20"
    className={cn("h-6 w-auto text-primary", className)}
    {...props}
    fill="currentColor"
  >
    <title>PAUL</title>
    <text
      x="0"
      y="50%"
      dominantBaseline="middle"
      fontFamily="Inter, sans-serif"
      fontSize="20"
      fontWeight="600"
      letterSpacing="0.2em"
    >
      PAUL
    </text>
  </svg>
);
