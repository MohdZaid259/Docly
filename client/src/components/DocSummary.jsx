const DocumentSummary = ({ summary, status }) => {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5">
      <h3 className="text-lg font-semibold text-white">AI Summary</h3>

      <div className="mt-3 text-sm leading-7 text-slate-300">
        {status === "processing" && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-amber-300">
            Document is being processed. This usually takes a moment.
          </div>
        )}
        {status === "completed" && !summary && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-400">
            Generating summary...
          </div>
        )}
        {summary && <p className="whitespace-pre-wrap">{summary}</p>}
      </div>
    </div>
  );
};

export default DocumentSummary;