type Alert = {
  alert_id: number;
  message: string;
  severity: string;
  created_at: string;
};

type AlertsCardProps = {
  alerts: Alert[];
};

export default function AlertsCard({
  alerts,
}: AlertsCardProps) {
  const getStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-50 border-red-200";

      case "medium":
        return "bg-orange-50 border-orange-200";

      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getTitle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "🚨 Alerte importante";

      case "medium":
        return "⚠️ Attention";

      default:
        return "ℹ️ Information";
    }
  };

  return (
    <article className="rounded-3xl bg-white/95 p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-black">
          Alertes récentes
        </h2>

        <button
          type="button"
          className="text-sm font-bold text-violet-600"
        >
          Voir toutes
        </button>
      </div>

      <ul className="space-y-4">
        {alerts.map((alert) => (
          <li
            key={alert.alert_id}
            className={`rounded-2xl border p-4 ${getStyle(
              alert.severity,
            )}`}
          >
            <h3 className="font-bold">
              {getTitle(alert.severity)}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {alert.message}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}