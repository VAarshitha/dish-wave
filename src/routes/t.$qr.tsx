import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { setTable } from "@/lib/cart";

export const Route = createFileRoute("/t/$qr")({
  head: () => ({ meta: [{ title: "Loading menu…" }] }),
  component: QrEntry,
  notFoundComponent: () => <div className="p-8">Invalid QR.</div>,
  errorComponent: () => <div className="p-8">Couldn't open this table.</div>,
});

function QrEntry() {
  const { qr } = Route.useParams();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("restaurant_tables")
        .select("id,label")
        .eq("qr_token", qr)
        .eq("is_active", true)
        .maybeSingle();
      if (error || !data) {
        navigate({ to: "/menu" });
        return;
      }
      setTable({ id: data.id, label: data.label });
      navigate({ to: "/menu" });
    })();
  }, [qr, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Opening menu…</p>
      </div>
    </div>
  );
}
