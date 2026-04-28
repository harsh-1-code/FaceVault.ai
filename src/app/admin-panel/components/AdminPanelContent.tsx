'use client';
import React, { useState } from 'react';
import AdminTopbar from './AdminTopbar';
import AdminKPIGrid from './AdminKPIGrid';
import EncodingChart from './EncodingChart';
import MatchDistributionChart from './MatchDistributionChart';
import EventsTable from './EventsTable';
import UploadModal from './UploadModal';
import { adminEvents } from '../data/adminMockData';

export default function AdminPanelContent() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-full">
      <AdminTopbar onUpload={() => setUploadModalOpen(true)} />

      <div className="flex-1 px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 max-w-screen-2xl mx-auto w-full space-y-6">
        {/* KPI Grid */}
        <AdminKPIGrid events={adminEvents} />

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <EncodingChart />
          </div>
          <div className="xl:col-span-1">
            <MatchDistributionChart />
          </div>
        </div>

        {/* Events table */}
        <EventsTable
          events={adminEvents}
          onUpload={() => setUploadModalOpen(true)}
        />
      </div>

      {uploadModalOpen && (
        <UploadModal onClose={() => setUploadModalOpen(false)} />
      )}
    </div>
  );
}