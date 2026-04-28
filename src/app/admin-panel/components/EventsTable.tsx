'use client';
import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import { type AdminEvent } from '../data/adminMockData';

interface EventsTableProps {
  events: AdminEvent[];
  onUpload: () => void;
}

const statusConfig: Record<AdminEvent['status'], { label: string; color: string; dot: string }> = {
  complete: { label: 'Complete', color: 'bg-green-500/15 text-green-400 border-green-500/25', dot: 'bg-green-400' },
  processing: { label: 'Processing', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25', dot: 'bg-blue-400 animate-pulse' },
  queued: { label: 'Queued', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25', dot: 'bg-amber-400' },
  failed: { label: 'Failed', color: 'bg-red-500/15 text-red-400 border-red-500/25', dot: 'bg-red-400' },
  partial: { label: 'Partial', color: 'bg-orange-500/15 text-orange-400 border-orange-500/25', dot: 'bg-orange-400' },
};

const typeColors: Record<AdminEvent['type'], string> = {
  wedding: 'text-pink-400',
  corporate: 'text-blue-400',
  college: 'text-amber-400',
  conference: 'text-cyan-400',
  alumni: 'text-green-400',
};

export default function EventsTable({ events, onUpload }: EventsTableProps) {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState<keyof AdminEvent>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.uploadedBy.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortCol];
    const bv = b[sortCol];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    return sortDir === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (col: keyof AdminEvent) => {
    if (sortCol === col) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === paginated.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginated.map((e) => e.id)));
  };

  const handleDelete = (id: string) => {
    // Backend integration point: DELETE /api/admin/events/:id
    setDeleteConfirm(null);
    toast.success('Event and all associated photos deleted.');
  };

  const handleBulkDelete = () => {
    // Backend integration point: DELETE /api/admin/events/bulk
    toast.success(`${selectedRows.size} events deleted.`);
    setSelectedRows(new Set());
  };

  const handleReprocess = (id: string) => {
    // Backend integration point: POST /api/admin/events/:id/reprocess
    toast.success('Reprocessing queued — encoding will begin shortly.');
  };

  const SortIcon = ({ col }: { col: keyof AdminEvent }) => (
    <span className={`ml-1 inline-flex flex-col ${sortCol === col ? 'text-violet-400' : 'text-[hsl(var(--muted-foreground))]'}`}>
      <Icon name={sortCol === col && sortDir === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={11} />
    </span>
  );

  const columns: { key: keyof AdminEvent; label: string; sortable: boolean }[] = [
    { key: 'name', label: 'Event Name', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'photosUploaded', label: 'Photos', sortable: true },
    { key: 'facesEncoded', label: 'Faces Enc.', sortable: true },
    { key: 'matchesDelivered', label: 'Matches', sortable: true },
    { key: 'registeredAttendees', label: 'Attendees', sortable: true },
    { key: 'accuracy', label: 'Accuracy', sortable: true },
    { key: 'uploadedBy', label: 'Uploaded By', sortable: false },
  ];

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden">
      {/* Table header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[hsl(var(--border))]">
        <div>
          <h3 className="text-sm font-bold text-white">Event Management</h3>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{filtered.length} events total</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Icon name="MagnifyingGlassIcon" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-1 focus:ring-violet-500 w-48"
            />
          </div>
          <button
            onClick={onUpload}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
          >
            <Icon name="PlusIcon" size={13} />
            New Event
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      <div
        className={`overflow-hidden transition-all duration-300 ${selectedRows.size > 0 ? 'max-h-12' : 'max-h-0'}`}
      >
        <div className="flex items-center gap-3 px-5 py-2.5 bg-violet-600/10 border-b border-violet-500/20">
          <span className="text-xs font-semibold text-violet-300">{selectedRows.size} selected</span>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded-lg transition-all"
          >
            <Icon name="TrashIcon" size={12} />
            Delete Selected
          </button>
          <button
            onClick={() => setSelectedRows(new Set())}
            className="text-xs text-[hsl(var(--muted-foreground))] hover:text-white transition-colors ml-auto"
          >
            Clear selection
          </button>
        </div>
      </div>

      {/* Table scroll */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginated.length && paginated.length > 0}
                  onChange={toggleAll}
                  className="w-3.5 h-3.5 rounded accent-violet-500"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={`th-${col.key}`}
                  className={`px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-white select-none' : ''} ${sortCol === col.key ? 'text-violet-400' : ''}`}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && <SortIcon col={col.key} />}
                </th>
              ))}
              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))]">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Icon name="CalendarDaysIcon" size={32} className="text-[hsl(var(--muted-foreground))]" />
                    <p className="text-sm font-semibold text-white">No events found</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Try adjusting your search or upload a new event.</p>
                    <button onClick={onUpload} className="mt-1 flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all">
                      <Icon name="PlusIcon" size={12} />
                      Upload Event Photos
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((event) => {
                const status = statusConfig[event.status];
                const encodingPct = event.photosUploaded > 0
                  ? Math.round((event.facesEncoded / Math.max(event.facesDetected, 1)) * 100)
                  : 0;
                return (
                  <tr
                    key={event.id}
                    className={`group transition-colors ${selectedRows.has(event.id) ? 'bg-violet-600/8' : 'hover:bg-[hsl(var(--muted))/40]'}`}
                  >
                    {/* Checkbox */}
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(event.id)}
                        onChange={() => toggleRow(event.id)}
                        className="w-3.5 h-3.5 rounded accent-violet-500"
                      />
                    </td>

                    {/* Event Name */}
                    <td className="px-3 py-3.5 min-w-[200px]">
                      <div>
                        <p className="font-semibold text-white text-[13px] truncate max-w-[200px]">{event.name}</p>
                        <p className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-0.5">
                          <Icon name="MapPinIcon" size={10} />
                          <span className="truncate max-w-[160px]">{event.location}</span>
                          <span className={`ml-1 text-[10px] font-bold uppercase ${typeColors[event.type]}`}>· {event.type}</span>
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className="text-[13px] font-mono text-[hsl(var(--muted-foreground))]">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>

                    {/* Photos */}
                    <td className="px-3 py-3.5">
                      <span className="font-mono font-bold text-[13px] text-white tabular-nums">
                        {event.photosUploaded.toLocaleString()}
                      </span>
                    </td>

                    {/* Faces Encoded */}
                    <td className="px-3 py-3.5 min-w-[110px]">
                      <div className="space-y-1">
                        <span className="font-mono text-[13px] text-white tabular-nums">
                          {event.facesEncoded.toLocaleString()}
                        </span>
                        {event.facesDetected > 0 && (
                          <div className="h-1 w-20 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-violet-500 rounded-full transition-all"
                              style={{ width: `${Math.min(encodingPct, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Matches */}
                    <td className="px-3 py-3.5">
                      <span className={`font-mono font-bold text-[13px] tabular-nums ${event.matchesDelivered > 0 ? 'text-green-400' : 'text-[hsl(var(--muted-foreground))]'}`}>
                        {event.matchesDelivered.toLocaleString()}
                      </span>
                    </td>

                    {/* Attendees */}
                    <td className="px-3 py-3.5">
                      <span className="font-mono text-[13px] text-[hsl(var(--muted-foreground))] tabular-nums">
                        {event.registeredAttendees}
                      </span>
                    </td>

                    {/* Accuracy */}
                    <td className="px-3 py-3.5">
                      {event.accuracy > 0 ? (
                        <span className={`font-mono font-bold text-[13px] tabular-nums ${event.accuracy >= 95 ? 'text-green-400' : event.accuracy >= 88 ? 'text-amber-400' : 'text-red-400'}`}>
                          {event.accuracy.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-[13px] text-[hsl(var(--muted-foreground))]">—</span>
                      )}
                    </td>

                    {/* Uploaded By */}
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                          {event.uploadedBy.charAt(0)}
                        </div>
                        <span className="text-[13px] text-[hsl(var(--muted-foreground))] truncate max-w-[100px]">{event.uploadedBy}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {event.status === 'failed' || event.status === 'partial' ? (
                          <button
                            onClick={() => handleReprocess(event.id)}
                            title="Reprocess encoding for this event"
                            className="w-7 h-7 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400 transition-all"
                          >
                            <Icon name="ArrowPathIcon" size={13} />
                          </button>
                        ) : null}
                        <button
                          onClick={() => onUpload()}
                          title="Upload more photos to this event"
                          className="w-7 h-7 rounded-lg bg-[hsl(var(--muted))] hover:bg-violet-500/20 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-violet-400 transition-all"
                        >
                          <Icon name="ArrowUpTrayIcon" size={13} />
                        </button>
                        <button
                          title="View event analytics"
                          className="w-7 h-7 rounded-lg bg-[hsl(var(--muted))] hover:bg-cyan-500/20 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-cyan-400 transition-all"
                        >
                          <Icon name="ChartBarIcon" size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(event.id)}
                          title="Delete this event — removes all photos and matches, cannot be undone"
                          className="w-7 h-7 rounded-lg bg-[hsl(var(--muted))] hover:bg-red-500/20 flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-red-400 transition-all"
                        >
                          <Icon name="TrashIcon" size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-t border-[hsl(var(--border))]">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Showing <span className="font-semibold text-white">{(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)}</span> of <span className="font-semibold text-white">{filtered.length}</span> events
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Icon name="ChevronLeftIcon" size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={`page-${p}`}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${p === page ? 'bg-violet-600 text-white' : 'bg-[hsl(var(--muted))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-white'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="w-8 h-8 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Icon name="ChevronRightIcon" size={14} />
          </button>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
              <Icon name="TrashIcon" size={22} className="text-red-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Delete Event?</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-5">
              This will permanently delete all uploaded photos, face encodings, and match records for this event. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted))]/80 border border-[hsl(var(--border))] text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}