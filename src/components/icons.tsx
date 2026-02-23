import { cn } from "@/lib/utils";

export const PaulLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 20"
    className={cn("h-5 w-auto text-primary", className)}
    {...props}
    fill="currentColor"
  >
    <title>PAUL</title>
    <text
      x="0"
      y="15"
      fontFamily="Inter, sans-serif"
      fontSize="18"
      fontWeight="600"
      letterSpacing="0.2em"
    >
      PAUL
    </text>
  </svg>
);
