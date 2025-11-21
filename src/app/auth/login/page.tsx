'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                username,
                password,
            });

            if (result?.error) {
                setError('Invalid username or password. Please try again.');
                setLoading(false);
            }
            else if (result?.ok) {
                // Prefetch admin page for faster transition
                router.refresh(); 
                router.push('/admin');
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again later.');
            setLoading(false);
        }
    };

    return (
    // Full screen gray background with flex centering
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Title / Logo Text */}
        <h2 className="mt-6 text-center text-3xl font-bold text-brand-primary tracking-tight">
          Meiden CMS
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage website content
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Card Container with Top Border Accent */}
        <div className="bg-white py-8 px-4 shadow-md rounded-sm sm:rounded-lg sm:px-10 border-t-4 border-brand-primary">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* Error Message Display */}
            {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {/* Error Icon */}
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white 
                  transition-all duration-200
                  ${loading 
                    ? 'bg-brand-secondary cursor-wait opacity-80' 
                    : 'bg-brand-primary hover:bg-brand-deep hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary'
                  }
                `}
              >
                {loading ? 'Signing in...' : 'Log In'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer / Support Link */}
        <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Meiden CMS. Authorized personnel only.
            </p>
        </div>
      </div>
    </div>
  );
}