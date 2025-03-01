"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronRight, Mail, Lock, LogIn } from "lucide-react"
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password })
      console.log(response.data)
      localStorage.setItem("token", response.data.token)
      navigate("/") // Navigate to home page after successful login
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Brand/Info */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Electric Route Optimizer</h1>
          <p className="text-blue-100 mb-8">Smart navigation for electric vehicles</p>
        </div>

        <div className="hidden md:block">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <ChevronRight className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Optimized Routes</h3>
                <p className="text-blue-100 text-sm">Find the most efficient path for your EV</p>
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <ChevronRight className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Charging Stations</h3>
                <p className="text-blue-100 text-sm">Locate charging points along your route</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-blue-500 p-2 rounded-full mr-4">
                <ChevronRight className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Energy Efficiency</h3>
                <p className="text-blue-100 text-sm">Save battery and maximize your range</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-blue-100">© 2025 Electric Route Optimizer</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to continue to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

