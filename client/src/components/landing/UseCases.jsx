const audiences = ["Researchers", "Legal teams", "Analysts", "Recruiters"];

export default function UseCases() {
  return (
    <section className="border-y border-border py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
        <span className="font-medium text-foreground">Built for</span>
        {audiences.map((audience, idx) => (
          <span key={audience} className="flex items-center gap-x-3">
            <span className="text-muted-foreground">{audience}</span>
            {idx < audiences.length - 1 && (
              <span className="text-border" aria-hidden="true">
                &middot;
              </span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
