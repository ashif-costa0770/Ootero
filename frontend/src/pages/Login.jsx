import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/ootero-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    alert('Login submitted!');
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full">
        <section className="flex w-full items-center justify-center bg-[#f0f2f5] px-5 py-8 lg:w-[65%]">
          <div className="w-full max-w-[448px]">
            <div className="text-center">
              {/* <h1 className="text-[48px] leading-none text-[#1a1a2e] [font-family:Georgia,'Times_New_Roman',serif]">
                Ootero
              </h1>
              <p className="mt-2 text-sm text-gray-600">Auspost Deliver Software</p> */}
              <img src={logo} alt="Ootero" className="w-1/2 mx-auto object-cover" />
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-[28px] font-bold text-[#1a3caa]">Please login or register</h2>
              <p className="mt-2 text-sm text-gray-600">
                New to ootero?{' '}
                <Link to="/register" className="font-medium text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-8 rounded-xl bg-white p-6 shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#1a6ef5] focus:ring-2 focus:ring-[#1a6ef5]/20"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-16 text-sm outline-none transition focus:border-[#1a6ef5] focus:ring-2 focus:ring-[#1a6ef5]/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-md border border-gray-300 bg-gray-100 px-3 py-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={captchaChecked}
                      onChange={(e) => setCaptchaChecked(e.target.checked)}
                      className="h-5 w-5 rounded border-gray-400 accent-[#1a6ef5]"
                    />
                    <span className="text-sm text-gray-800">I&apos;m not a robot</span>
                  </label>
                  <div className="text-center">
                    <svg width="30" height="30" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-label="reCAPTCHA logo">
                      <path fill="#1A73E8" d="M24 4a20 20 0 0 1 16.6 8.9l-4.8 3.2A14 14 0 0 0 24 10v6L12 8l12-8v4z" />
                      <path fill="#34A853" d="M44 24a20 20 0 0 1-9 16.8l-3.3-4.7A14 14 0 0 0 38 24h6l-8 12-8-12h4z" />
                      <path fill="#FBBC05" d="M24 44A20 20 0 0 1 7.2 35l4.7-3.3A14 14 0 0 0 24 38v-6l12 8-12 8v-4z" />
                    </svg>
                    <p className="text-[10px] text-gray-600">reCAPTCHA</p>
                    <p className="text-[10px] text-gray-500">Privacy &middot; Terms</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 accent-[#1a6ef5]"
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1a6ef5] py-2.5 text-sm font-bold text-white transition hover:bg-[#1558d0] active:scale-[0.99]"
                >
                  Login
                </button>
              </form>

            </div>
          </div>
        </section>

        <aside className="relative hidden w-[35%] flex-col justify-center overflow-hidden bg-[#0d2d8a] px-10 text-white lg:flex">
          <div className="relative z-10 max-w-[420px]">
            <h3 className="text-2xl font-bold leading-tight">We&apos;re making changes based on your feedback</h3>
            <p className="mt-6 text-base leading-relaxed text-blue-200">
              We&apos;ve been diligently working behind the scenes to enhance the products you rely on daily, helping to
              drive your business forward while striving to become the leading all-in-one fulfillment platform for small
              to medium-sized businesses.
            </p>
          </div>
          <div className="pointer-events-none absolute -bottom-28 -right-24 h-[280px] w-[280px] rounded-full bg-[#a8c4f0] opacity-40" />
          <div className="pointer-events-none absolute -bottom-40 -right-2 h-[360px] w-[360px] rounded-full bg-[#a8c4f0] opacity-30" />
        </aside>
      </div>
    </div>
  );
};

export default Login;
