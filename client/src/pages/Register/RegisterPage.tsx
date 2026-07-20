import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password, confirmPassword });
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-terminal-50">Register</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-terminal-100">
            First name
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              className="rounded-lg border border-terminal-700 bg-terminal-900 px-3 py-2 text-sm text-terminal-50 focus:border-brand focus:outline-none"
            />
          </label>

          <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm text-terminal-100">
            Last name
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              className="rounded-lg border border-terminal-700 bg-terminal-900 px-3 py-2 text-sm text-terminal-50 focus:border-brand focus:outline-none"
            />
          </label>
        </div>

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

        <label className="flex flex-col gap-1 text-sm text-terminal-100">
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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
          {isSubmitting ? 'Creating account…' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-terminal-100">
        Already have an account?{' '}
        <Link to="/login" className="text-terminal-50 underline hover:text-brand">
          Login
        </Link>
      </p>
    </>
  );
}
