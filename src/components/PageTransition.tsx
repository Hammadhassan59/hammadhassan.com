"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // On route change, fade out then swap content
    if (pathname !== prevPathname.current) {
      setTransitioning(true);

      const timeout = setTimeout(() => {
        setDisplayChildren(children);
        setTransitioning(false);
        prevPathname.current = pathname;
        // Scroll to top on page change
        window.scrollTo({ top: 0 });
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      // Same pathname but children may have updated (e.g., initial render)
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      className={`page-transition ${transitioning ? "page-exit" : "page-enter"}`}
    >
      {displayChildren}
    </div>
  );
}
