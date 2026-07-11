const DocumentSummary = ({ summary, status }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-lg font-semibold text-foreground">AI Summary</h3>

      <div className="mt-3 text-sm leading-7 text-muted-foreground">
        {status === "processing" && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-300">
            Document is being processed. This usually takes a moment.
          </div>
        )}
        {status === "completed" && !summary && (
          <div className="rounded-2xl border border-border bg-muted/40 p-4 text-muted-foreground">
            Generating summary...
          </div>
        )}
        {summary && <p className="whitespace-pre-wrap text-foreground">{summary}</p>}
      </div>
    </div>
  );
};

export default DocumentSummary;
