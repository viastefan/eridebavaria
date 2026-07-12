"use client";

import { useState } from "react";
import type { GarageAccessData } from "@/lib/garage-types";
import { GarageLogin } from "./GarageLogin";
import { GarageDashboard } from "./GarageDashboard";
import { AccountGaragePanel, AccountGarageLoginPrompt } from "./AccountGaragePanel";

interface GarageShellProps {
  initialAccess: GarageAccessData | null;
}

export function GarageShell({ initialAccess }: GarageShellProps) {
  const [access, setAccess] = useState<GarageAccessData | null>(initialAccess);

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="section-padding mx-auto max-w-6xl">
        <AccountGaragePanel />
        {access ? (
          <GarageDashboard access={access} onLogout={() => setAccess(null)} />
        ) : (
          <>
            <AccountGarageLoginPrompt />
            <GarageLogin onAuthenticated={setAccess} />
          </>
        )}
      </div>
    </div>
  );
}
