import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  isActive?: (props: { isActive: boolean; isPending: boolean }) => boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, isActive, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={(linkProps) => {
          const active = isActive ? isActive(linkProps) : linkProps.isActive;
          return cn(className, active && activeClassName, linkProps.isPending && pendingClassName);
        }}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
