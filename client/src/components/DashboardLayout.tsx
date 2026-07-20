import { Outlet } from 'react-router';

export function DashboardLayout() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <Outlet />
    </div>
  );
}
