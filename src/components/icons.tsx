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
      fontFamily="'Bodoni Moda', serif"
      fontSize="26"
      fontWeight="600"
      letterSpacing="0.25em"
    >
      PAUL
    </text>
  </svg>
);
