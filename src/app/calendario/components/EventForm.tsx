"use client";
import { useState } from "react";
import type { EventDoc } from "@/lib/types";
import { createEvent } from "@/lib/events";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = { onCreated?: () => void };

export function EventForm({ onCreated }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<EventDoc["status"]>("planejado");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await createEvent(user.uid, {
        title,
        description,
        start_datetime: start,
        end_datetime: end,
        all_day: false,
        tags: [],
        status,
        goal_id: null,
        habit_id: null,
        created_at: "",
        updated_at: "",
        id: "",
        user_id: user.uid,
      } as unknown as EventDoc);
      setTitle("");
      setDescription("");
      setStart("");
      setEnd("");
      onCreated?.();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro ao criar evento";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do evento" className="w-full rounded-md border px-2 py-1" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Observações / horários coringa" className="w-full rounded-md border px-2 py-1" />
      <div className="grid grid-cols-2 gap-2">
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="rounded-md border px-2 py-1" />
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded-md border px-2 py-1" />
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm text-foreground/70">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as EventDoc["status"])} className="rounded-md border px-2 py-1">
          <option value="planejado">planejado</option>
          <option value="feito">feito</option>
          <option value="faltou">faltou</option>
        </select>
      </div>
      <button disabled={loading} onClick={submit} className="rounded-md border px-3 py-1.5 hover:bg-foreground/5 disabled:opacity-60">Salvar</button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
