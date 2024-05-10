import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-notosans font-semibold",
  {
    variants: {
      variant: {
        turquoise: "bg-turquoise text-white hover:bg-turquoise/90 capitalize",
        "turquoise-hipster":
          "bg-turquoise border border-transparent text-white capitalize hover:border hover: border-turquoise hover:text-turquoise hover:bg-transparent",
        pink: "bg-pink-dark bg text-white hover:bg-pink-light capitalize",
        "pink-hipster":
          "bg-pink border border-transparent text-white capitalize hover:border hover: border-pink hover:text-pink hover:bg-transparent",
        blue: "bg-blue-dark bg text-white hover:bg-blue-light capitalize",
        purple:
          "bg-purple-light bg text-white hover:bg-purple-light/90 capitalize",
        "purple-hipster":
          "bg-purple-light border border-transparent text-white capitalize hover:border hover: border-purple-light hover:text-purple-light hover:bg-transparent",
        olive: "bg-olive bg text-white hover:bg-olive/90 capitalize",
        "olive-hipster":
          "bg-olive border border-transparent text-white capitalize hover:border hover: border-olive hover:text-olive hover:bg-transparent",
        "clay-red": "bg-clay-red bg text-white hover:bg-clay-red/90 capitalize",
        "clay-red-hipster":
          "bg-clay-red border border-transparent text-white capitalize hover:border hover: border-clay-red hover:text-clay-red hover:bg-transparent",
        outline:
          "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-sl-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 capitalize",
        black: "bg-gray-900 text-white hover:bg-gray-900/90 capitalize",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 capitalize",
        ghost: "hover:bg-gray-200 capitalize",
        link: "text-primary underline-offset-4 hover:underline capitalize",
      },
      size: {
        default: "h-8 px-4 py-2",
        xs: "h-6 px-2 text-[12px]",
        sm: "h-7 px-3",
        lg: "h-9 px-5",
        xl: "h-10 px-5",
        prev: "rounded-none w-16 h-12 rounded-l-xl",
        next: "rounded-none w-16 h-12 rounded-r-xl",
        full: "rounded-full h-8 px-4 py-2",
        "sm-full": "rounded-full h-7 px-3",
        "lg-full": "rounded-full h-9 px-5",
        "real-full": "rounded-full h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "turquoise",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
