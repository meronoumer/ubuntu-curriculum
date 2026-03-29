"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/sessions", label: "Sessions" },
  { href: "/report", label: "Report" },
  { href: "/admin", label: "Admin" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
      <span className="font-bold tracking-wide text-sm">Ubuntu Curriculum</span>
      <div className="flex gap-4 text-sm">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              pathname.startsWith(href)
                ? "font-semibold underline underline-offset-4"
                : "opacity-80 hover:opacity-100"
            }
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
