import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="mx-auto mt-16 w-full max-w-sm px-4">
      <Outlet />
    </div>
  );
}
