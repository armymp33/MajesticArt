import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-[#2C2C2C] mb-2">Admin Login</h1>
          <p className="text-[#2C2C2C]/60">Enter password to access admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B86BD]"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#8B4A8B] text-white font-medium tracking-wide uppercase hover:bg-[#9B5A9B] transition-colors rounded-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-[#2C2C2C]/60 hover:text-[#2C2C2C] transition-colors"
          >
            ← Back to website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

