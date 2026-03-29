import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import FilterPanel from "../components/FilterPanel";
import Badge from "../components/Badge";
import ScoreBadge from "../components/ScoreBadge";
import { Table, THead, TBody, TR, TH, TD } from "../components/Table";
import EmptyState from "../components/EmptyState";
import { Skeleton, TableRowSkeleton } from "../components/Skeleton";
import { candidates as allCandidates } from "../data/mockData";

export default function CandidatesPage() {
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [skillsInput, setSkillsInput] = useState("");
  const [skillTags, setSkillTags] = useState([]);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const addSkill = () => {
    const s = skillsInput.trim();
    if (!s) return;
    if (!skillTags.includes(s)) setSkillTags((prev) => [...prev, s]);
    setSkillsInput("");
  };

  const filtered = useMemo(() => {
    return allCandidates.filter((c) => {
      if (c.atsScore < minScore || c.atsScore > maxScore) return false;
      if (status !== "all" && c.status !== status) return false;
      if (skillTags.length === 0) return true;
      return skillTags.every((tag) =>
        c.skills.some((sk) => sk.toLowerCase().includes(tag.toLowerCase()))
      );
    });
  }, [minScore, maxScore, status, skillTags]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Core workspace
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Candidates</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            ATS scores, AI summaries, and status — filter with precision before deep review.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
        <FilterPanel
          minScore={minScore}
          maxScore={maxScore}
          onMinScoreChange={(v) => {
            setMinScore(v);
            if (v > maxScore) setMaxScore(v);
          }}
          onMaxScoreChange={(v) => {
            setMaxScore(v);
            if (v < minScore) setMinScore(v);
          }}
          skillsInput={skillsInput}
          onSkillsInputChange={setSkillsInput}
          onAddSkill={addSkill}
          skillTags={skillTags}
          onRemoveSkill={(s) => setSkillTags((prev) => prev.filter((x) => x !== s))}
          status={status}
          onStatusChange={setStatus}
        />

        <div className="min-w-0 space-y-4">
          {loading ? (
            <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/50">
              <table className="w-full min-w-[720px]">
                <thead className="border-b border-slate-700 bg-slate-900/80 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Candidate</th>
                    <th className="px-4 py-3 text-left">ATS</th>
                    <th className="px-4 py-3 text-left">HR summary</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <TableRowSkeleton key={r} cols={4} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No candidates in this slice"
              description="Adjust score range, skills, or status — or clear filters to see everyone."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setMinScore(0);
                    setMaxScore(100);
                    setSkillTags([]);
                    setStatus("all");
                  }}
                  className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-indigo-400"
                >
                  Clear filters
                </button>
              }
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Candidate name</TH>
                  <TH>ATS score</TH>
                  <TH>HR review summary</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((c) => (
                  <TR key={c.id} className="group">
                    <TD>
                      <Link
                        to={`/candidates/${c.id}`}
                        className="font-medium text-indigo-300 transition-all duration-300 hover:text-indigo-200 group-hover:underline"
                      >
                        {c.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-slate-500">{c.role}</p>
                    </TD>
                    <TD>
                      <ScoreBadge score={c.atsScore} />
                    </TD>
                    <TD className="max-w-md">
                      <p className="line-clamp-2 text-sm text-slate-300">{c.summary}</p>
                    </TD>
                    <TD>
                      <Badge variant={c.status} />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
