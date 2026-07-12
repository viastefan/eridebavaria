import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CheckoutCartClear } from "@/components/commerce/CheckoutCartClear";

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center section-padding pt-28 text-center">
      <CheckoutCartClear />
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
        <span className="text-2xl">✓</span>
      </div>
      <h1 className="heading-xl text-gradient">Bestellung bestätigt</h1>
      <p className="mx-auto mt-4 max-w-md text-foreground-secondary">
        Vielen Dank für Ihre Bestellung. Wir bereiten alles vor und melden uns bei Ihnen.
      </p>
      {order && (
        <p className="mt-4 font-mono text-sm text-accent">{order}</p>
      )}
      <Container className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/garage" className="btn btn--primary">
          Meine Garage
        </Link>
        <Link href="/shop" className="btn btn--secondary">
          Weiter einkaufen
        </Link>
      </Container>
    </main>
  );
}
