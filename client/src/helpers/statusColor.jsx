export const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "text-emerald-400";

    case "processing":
      return "text-yellow-400";

    case "failed":
      return "text-red-400";

    default:
      return "text-slate-400";
  }
};

export const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "completed":
      return "success";

    case "processing":
      return "warning";

    case "failed":
      return "destructive";

    default:
      return "secondary";
  }
};