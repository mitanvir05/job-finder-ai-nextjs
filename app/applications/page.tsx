import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import { Search } from "lucide-react";

// Force Next.js to dynamically render this page so it always shows fresh database records
export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  await dbConnect();

  // Fetch all applications and sort by newest first
  const applications = await Application.find().sort({ createdAt: -1 });

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Applications</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {applications.length} total applications
          </p>
        </div>
        <button className="bg-zinc-100 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors">
          + New Application
        </button>
      </div>

      {/* Search Bar (UI Only for now) */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-2 rounded-xl mb-6 flex items-center gap-3">
        <div className="pl-3 text-zinc-500">
          <Search size={16} />
        </div>
        <input
          type="text"
          placeholder="Search by email, company, or job title..."
          className="flex-1 bg-transparent border-none py-1.5 text-sm text-white focus:outline-none focus:ring-0"
        />
      </div>

      {/* Data Table */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
          <thead className="bg-zinc-900/50 border-b border-[var(--color-border)] text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Company</th>
              <th className="px-6 py-4 whitespace-nowrap">Job Title</th>
              <th className="px-6 py-4 whitespace-nowrap">Email</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {applications.map((app) => (
              <tr
                key={app._id.toString()}
                className="hover:bg-zinc-800/30 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-zinc-200">
                  {app.company}
                </td>
                <td className="px-6 py-4">{app.jobTitle}</td>
                <td className="px-6 py-4 font-mono text-xs">
                  {app.email || "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium border ${
                      app.status === "Sent"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-zinc-800 text-zinc-300 border-zinc-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(app.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}

            {applications.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-zinc-500"
                >
                  No applications found. Go find some jobs!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
