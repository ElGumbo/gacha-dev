import { useAuth } from '../../hooks/useAuth';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto mt-16 max-w-sm px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.firstName}!</h1>
      <p className="mt-2 text-sm text-gray-600">You are logged in.</p>
    </div>
  );
}
