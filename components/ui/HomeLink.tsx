"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Logo link to the homepage. From another page it navigates home as usual; on
 * the homepage itself it reloads the page. Modified clicks (new tab or window)
 * keep the browser default.
 */
export function HomeLink(props: Omit<React.ComponentProps<typeof Link>, "href" | "onClick">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href="/"
      onClick={(e) => {
        if (pathname !== "/" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        window.scrollTo(0, 0);
        window.location.reload();
      }}
    />
  );
}
