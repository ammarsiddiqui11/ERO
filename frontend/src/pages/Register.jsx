"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronRight, Mail, Lock, User, UserPlus, Car } from "lucide-react"

export default function Register() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    vehicleName: "",
    vehicleCompany: "",
    vehicleModel: "",
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match")
        return
      }
      setStep(2)
    } else {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setLoading(false)
        // Handle registration logic here (removed for this example)
        navigate("/") // Navigate to home page after successful registration
      }, 1500)
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

      {/* Right side - Registration Form */}
      <div className="md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join us and optimize your electric vehicle journeys</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="vehicleName" className="text-sm font-medium text-gray-700 block">
                    Vehicle Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="vehicleName"
                      name="vehicleName"
                      type="text"
                      required
                      value={formData.vehicleName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="My Electric Car"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="vehicleCompany" className="text-sm font-medium text-gray-700 block">
                    Vehicle Company
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="vehicleCompany"
                      name="vehicleCompany"
                      type="text"
                      required
                      value={formData.vehicleCompany}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tesla"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="vehicleModel" className="text-sm font-medium text-gray-700 block">
                    Vehicle Model
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="vehicleModel"
                      name="vehicleModel"
                      type="text"
                      required
                      value={formData.vehicleModel}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Model 3"
                    />
                  </div>
                </div>
              </>
            )}

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
                    <UserPlus className="h-5 w-5 mr-2" />
                    {step === 1 ? "Next" : "Create Account"}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

