import React from 'react';
import AppLayout from '@/components/AppLayout';
import PhotoDashboardContent from './components/PhotoDashboardContent';

export default function UserPhotoDashboardPage() {
  return (
    <AppLayout role="user">
      <PhotoDashboardContent />
    </AppLayout>
  );
}