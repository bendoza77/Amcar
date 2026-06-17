import { cn } from "../../lib/utils";

/**
 * Container — horizontal layout primitive that centers content and applies
 * consistent responsive gutters. Every section composes this.
 *
 * @param {"default"|"wide"|"narrow"} size
 */
export default function Container({ as: Tag = "div", size = "default", className, children, ...props }) {
  const max = {
    narrow: "max-w-3xl",
    default: "max-w-[1200px]",
    wide: "max-w-[1360px]",
  }[size];

  return (
    <Tag className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", max, className)} {...props}>
      {children}
    </Tag>
  );
}
