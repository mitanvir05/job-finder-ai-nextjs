'use client'

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import JobCard from "@/components/JobCard";
import { searchJobsWithAI } from "@/app/actions/jobFinder";

// Define the type based on what Gemini returns
type JobLead = {
  title: string;
  company: string;
  description: string;
  emailFound: boolean;
  email: string | null;
};

export default function JobFinderPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<JobLead[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    // Call our Server Action
    const response = await searchJobsWithAI(query);

    if (response.error) {
      setError(response.error);
    } else if (response.jobs) {
      setResults(response.jobs);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">AI Job Finder</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Harness Gemini 1.5 Pro to scour the internet for job openings and extract recruiter emails automatically.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-[var(--color-card)] border border-[var(--color-border)] p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-3">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Software Developer in USA Remote" 
          className="flex-1 bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
          disabled={isLoading}
        />
        <button 
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {isLoading ? "Searching AI..." : "Text Search"}
        </button>
      </form>

      {error && (
        <div className="p-4 mb-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((job, index) => (
          <JobCard 
            key={index}
            title={job.title}
            company={job.company}
            description={job.description}
            emailFound={job.emailFound}
            email={job.email}
          />
        ))}
      </div>

      {results.length === 0 && !isLoading && !error && (
        <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-xl">
          <SparklesIcon className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
          <h3 className="text-sm font-medium text-zinc-300">No jobs yet</h3>
          <p className="text-xs text-zinc-500 mt-1">Enter a search query above to let Gemini find leads.</p>
        </div>
      )}
    </div>
  );
}

// Just a small icon for the empty state
function SparklesIcon(props: any) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}