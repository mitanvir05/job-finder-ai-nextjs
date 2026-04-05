import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import { Send, Calendar, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await dbConnect();

  // 1. Fetch Aggregate Data
  const totalApps = await Application.countDocuments();
  const draftsCount = await Application.countDocuments({ status: "Draft" });
  const sentCount = await Application.countDocuments({ status: "Sent" });

  // Time-based calculations
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const todayForWeek = new Date();
  const startOfWeek = new Date(
    todayForWeek.setDate(todayForWeek.getDate() - todayForWeek.getDay()),
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const sentToday = await Application.countDocuments({
    status: "Sent",
    updatedAt: { $gte: startOfDay },
  });

  const sentThisWeek = await Application.countDocuments({
    status: "Sent",
    updatedAt: { $gte: startOfWeek },
  });

  // 2. Fetch Recent Applications
  const recentApps = await Application.find().sort({ createdAt: -1 }).limit(5);

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Track your job applications at a glance
          </p>
        </div>
        <Link
          href="/quick-send"
          className="bg-zinc-100 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors text-center"
        >
          + Quick Apply
        </Link>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Applications"
          value={totalApps}
          icon={<Send size={18} />}
        />
        <StatCard
          title="Sent Today"
          value={sentToday}
          icon={<Calendar size={18} />}
        />
        <StatCard
          title="This Week"
          value={sentThisWeek}
          icon={<Calendar size={18} />}
        />
        <StatCard
          title="Duplicates Found"
          value={0}
          icon={<AlertTriangle size={18} />}
        />
      </div>

      {/* Status Breakdown */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 mb-8">
        <h3 className="text-sm font-semibold text-white mb-4">
          Status Breakdown
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-lg border border-[var(--color-border)]">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Draft
            </span>
            <span className="text-lg font-bold text-white">{draftsCount}</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
            <span className="text-sm text-blue-500">Sent</span>
            <span className="text-lg font-bold text-blue-400">{sentCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">
            Recent Applications
          </h3>
          <Link
            href="/applications"
            className="text-xs text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {recentApps.map((app) => (
            <div
              key={app._id.toString()}
              className="p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors"
            >
              <div>
                <h4 className="text-sm font-medium text-white">
                  {app.company}
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {app.jobTitle} {app.email ? `· ${app.email}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium border ${
                    app.status === "Sent"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      : "bg-zinc-800 text-zinc-300 border-zinc-700"
                  }`}
                >
                  {app.status}
                </span>
                <span className="text-xs text-[var(--color-text-secondary)] hidden md:block">
                  {new Date(app.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}

          {recentApps.length === 0 && (
            <div className="p-8 text-center text-sm text-[var(--color-text-secondary)]">
              No recent applications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-5 rounded-xl flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="text-zinc-500 bg-zinc-800/50 p-2.5 rounded-lg">
        {icon}
      </div>
    </div>
  );
}
