export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Renders an FAQ accordion-style list plus a matching FAQPage JSON-LD
 * schema block, so Google can show these as rich snippets in search
 * results. Keep answers plain text (no markup) — that's what the schema
 * expects.
 */
export default function FaqSection({ items, title = "Frequently asked questions" }: { items: FaqItem[]; title?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-xl font-extrabold text-[var(--text-main)] mb-5">{title}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.question} className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5">
            <h3 className="font-bold text-[var(--text-main)] text-sm mb-2">{item.question}</h3>
            <p className="text-sm text-[var(--text-sec)] leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
