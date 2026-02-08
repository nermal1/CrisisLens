import Link from "next/link";
import { Button } from "@/components/ui/button";

// client/app/(marketing)/layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* You can put a simple Top Nav here later */}
      <main>{children}</main>
    </div>
  );
}