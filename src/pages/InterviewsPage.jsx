import { useMemo, useState } from "react";
import { CalendarClock, Mic2, UserCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import { Table, THead, TBody, TR, TH, TD } from "../components/Table";
import { interviews as seedInterviews } from "../data/mockData";

function interviewStatusVariant(s) {
  if (s === "completed") return "selected";
  if (s === "in_progress") return "interviewed";
  return "applied";
}

function interviewStatusLabel(s) {
  if (s === "completed") return "Completed";
  if (s === "in_progress") return "In progress";
  return "Not started";
}

export default function InterviewsPage() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("2026-03-30");
  const [time, setTime] = useState("15:00");
  const [type, setType] = useState("ai");
  const [list, setList] = useState(seedInterviews);

  const sorted = useMemo(
    () => [...list].sort((a, b) => (a.scheduledAt < b.scheduledAt ? 1 : -1)),
    [list]
  );

  const schedule = () => {
    const id = `i${Date.now()}`;
    setList((prev) => [
      {
        id,
        candidateId: "new",
        candidateName: "New candidate",
        type,
        status: "not_started",
        scheduledAt: `${date}T${time}:00`,
        live: false,
      },
      ...prev,
    ]);
    setOpen(false);
    toast.success("Interview scheduled (demo)");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Interview management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Schedule sessions, assign AI vs human interviewers, and track live status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-indigo-400"
        >
          <CalendarClock className="h-4 w-4" />
          Schedule interview
        </button>
      </div>

      <Card hover>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Live sessions when status is in progress
          </span>
        </div>

        <Table>
          <THead>
            <TR>
              <TH>Candidate</TH>
              <TH>Type</TH>
              <TH>Status</TH>
              <TH>Scheduled</TH>
              <TH className="text-right">Signal</TH>
            </TR>
          </THead>
          <TBody>
            {sorted.map((row) => (
              <TR key={row.id}>
                <TD className="font-medium text-slate-100">{row.candidateName}</TD>
                <TD>
                  <span className="inline-flex items-center gap-2 text-slate-300">
                    {row.type === "ai" ? (
                      <Mic2 className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <UserCircle2 className="h-4 w-4 text-violet-400" />
                    )}
                    {row.type === "ai" ? "AI interview" : "Human HR"}
                  </span>
                </TD>
                <TD>
                  <Badge variant={interviewStatusVariant(row.status)}>
                    {interviewStatusLabel(row.status)}
                  </Badge>
                </TD>
                <TD className="text-slate-400">{row.scheduledAt.replace("T", " · ")}</TD>
                <TD className="text-right">
                  {row.status === "in_progress" && row.live ? (
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-green-400">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                      Live
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">—</span>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Schedule interview">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
              Assign interview
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="ai">AI interview</option>
              <option value="human">Human HR</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 transition-all duration-300 hover:border-slate-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={schedule}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-400"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
