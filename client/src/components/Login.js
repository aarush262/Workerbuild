import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('https://workerbuild-backend.onrender.com/api/auth/login', form);
      const { token, role, username } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);

      onLogin({ role, username });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded text-black placeholder-gray-500 bg-white"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded text-black placeholder-gray-500 bg-white"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
          >
            Sign In
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-4 text-center">{error}</p>}

        {/* ✅ This is your Register link */}
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;