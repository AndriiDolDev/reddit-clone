import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        primary: "bg-indigo-500 text-white hover:bg-indigo-500/90 ",
        outline:
          "bg-white hover:bg-slate-100 hover:text-slate-900 font-light hover:color-[#4F46E5]	",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
        ghost: "text-gray-700 hover:opacity-80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-sm	",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Icon({ children, isActive }) {
  if (children === "Home") {
    if (isActive) {
      return <img src="/home-active.svg" alt="icon" />;
    }
    return <img src="/home.svg" alt="icon" />;
  }
  if (children === "My posts") {
    if (isActive) {
      return <img src="/posts-active.svg" alt="icon" />;
    }
    return <img src="/posts.svg" alt="icon" />;
  }
  if (children === "Log In") {
    if (isActive) {
      return <img src="/log-in-active.svg" alt="icon" />;
    }
    return <img src="/log-in.svg" alt="icon" />;
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, isActive, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          <Icon isActive={isActive}>{children}</Icon>
          {children}
        </Comp>
      </>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
