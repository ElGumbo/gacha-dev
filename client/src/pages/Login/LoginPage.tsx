import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-terminal-50">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-terminal-100">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="rounded-lg border border-terminal-700 bg-terminal-900 px-3 py-2 text-sm text-terminal-50 focus:border-brand focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-terminal-100">
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="rounded-lg border border-terminal-700 bg-terminal-900 px-3 py-2 text-sm text-terminal-50 focus:border-brand focus:outline-none"
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-terminal-950 transition-colors hover:bg-brand/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-sm text-terminal-100">
        No account yet?{' '}
        <Link to="/register" className="text-terminal-50 underline hover:text-brand">
          Register
        </Link>
      </p>
    </>
  );
}
