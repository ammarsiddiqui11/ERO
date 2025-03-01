"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Search, MapPin, Navigation, LogOut, Menu, X, Battery, Zap, Clock, Car } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

// Custom icon for petrol pumps
const petrolPumpIcon = new L.Icon({
  iconUrl: "/petrol-pump-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function SetViewOnClick({ coords }) {
  const map = useMap()
  map.setView(coords, map.getZoom())
  return null
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [currentLocation, setCurrentLocation] = useState([51.505, -0.09])
  const [routeCalculated, setRouteCalculated] = useState(false)
  const [markers, setMarkers] = useState([])
  const [route, setRoute] = useState([])
  const [totalDistance, setTotalDistance] = useState(0)
  const [userVehicle, setUserVehicle] = useState({ name: "My Car", company: "Tesla", model: "Model 3" })
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
    // Add dummy petrol pumps
    const dummyPetrolPumps = [
      { position: [51.51, -0.1], name: "Petrol Station A" },
      { position: [51.49, -0.08], name: "Petrol Station B" },
      { position: [51.52, -0.12], name: "Petrol Station C" },
    ]
    setMarkers(dummyPetrolPumps)
  }, [])

  const handleFindRoute = (e) => {
    e.preventDefault()
    if (source && destination) {
      const sourceCoords = getCoordinatesFromAddress(source)
      const destCoords = getCoordinatesFromAddress(destination)

      if (sourceCoords && destCoords) {
        const simulatedRoute = [
          sourceCoords,
          [
            sourceCoords[0] + (destCoords[0] - sourceCoords[0]) / 3,
            sourceCoords[1] + (destCoords[1] - sourceCoords[1]) / 3,
          ],
          [
            sourceCoords[0] + (2 * (destCoords[0] - sourceCoords[0])) / 3,
            sourceCoords[1] + (2 * (destCoords[1] - sourceCoords[1])) / 3,
          ],
          destCoords,
        ]
        setRoute(simulatedRoute)
        setMarkers((prevMarkers) => [
          ...prevMarkers,
          { id: "source", position: sourceCoords, name: source },
          { id: "destination", position: destCoords, name: destination },
        ])
        setRouteCalculated(true)

        // Calculate total distance
        const distance = calculateTotalDistance(simulatedRoute)
        setTotalDistance(distance)
      }
    }
  }

  const calculateTotalDistance = (routePoints) => {
    let totalDistance = 0
    for (let i = 0; i < routePoints.length - 1; i++) {
      totalDistance += calculateDistance(routePoints[i], routePoints[i + 1])
    }
    return totalDistance.toFixed(2)
  }

  const calculateDistance = (point1, point2) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((point2[0] - point1[0]) * Math.PI) / 180
    const dLon = ((point2[1] - point1[1]) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1[0] * Math.PI) / 180) *
        Math.cos((point2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getCoordinatesFromAddress = (address) => {
    if (address === "Current Location") {
      return currentLocation
    }
    return [51.5 + Math.random() * 0.1 - 0.05, -0.1 + Math.random() * 0.1 - 0.05]
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    navigate("/login")
  }

  const handleUpdateVehicle = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const updatedVehicle = {
      name: formData.get("vehicleName"),
      company: formData.get("vehicleCompany"),
      model: formData.get("vehicleModel"),
    }
    setUserVehicle(updatedVehicle)
    setShowVehicleForm(false)
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <Zap className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Electric Route Optimizer</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/32" alt="User profile" />
                    <span className="ml-2 text-sm font-medium text-gray-700">John Doe</span>
                    <button
                      onClick={() => setShowVehicleForm(true)}
                      className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <Car className="h-5 w-5" />
                    </button>
                    <button onClick={handleLogout} className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for route planning */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:static inset-y-0 left-0 transform bg-white w-64 md:w-80 transition duration-200 ease-in-out z-30 shadow-lg md:shadow-none`}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 py-6">
              <h2 className="text-lg font-semibold text-gray-900">Plan Your Route</h2>
              <p className="mt-1 text-sm text-gray-600">Find the optimal path for your electric vehicle</p>
            </div>

            <div className="flex-1 px-4 pb-4">
              <form onSubmit={handleFindRoute} className="space-y-4">
                <div>
                  <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                    Starting Point
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="source"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter starting point"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        type="button"
                        className="p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setSource("Current Location")}
                      >
                        <Navigation className="h-5 w-5 text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                    Destination
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="destination"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Route
                </button>
              </form>

              {routeCalculated && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-medium text-gray-900">Route Details</h3>

                  <div className="mt-3 space-y-3">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Estimated Time</p>
                        <p className="text-sm text-gray-500">45 minutes</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Battery className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Battery Usage</p>
                        <p className="text-sm text-gray-500">35% estimated consumption</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Charging Stations</p>
                        <p className="text-sm text-gray-500">2 stations along route</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Total Distance</p>
                        <p className="text-sm text-gray-500">{totalDistance} km</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content - Map */}
        <main className="flex-1 relative z-0 overflow-hidden">
          <MapContainer center={currentLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={currentLocation}>
              <Popup>
                Your current location <br /> Start your journey from here.
              </Popup>
            </Marker>
            {markers.map((marker) => (
              <Marker
                key={marker.id || marker.name}
                position={marker.position}
                icon={marker.id ? undefined : petrolPumpIcon}
              >
                <Popup>{marker.name}</Popup>
              </Marker>
            ))}
            {route.length > 0 && <Polyline positions={route} color="blue" weight={5} opacity={0.7} />}
            <SetViewOnClick coords={currentLocation} />
          </MapContainer>
        </main>
      </div>

      {/* Vehicle Update Form */}
      {showVehicleForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Update Vehicle Details</h3>
              <form className="mt-2 px-7 py-3" onSubmit={handleUpdateVehicle}>
                <input
                  type="text"
                  name="vehicleName"
                  placeholder="Vehicle Name"
                  defaultValue={userVehicle.name}
                  className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                />
                <input
                  type="text"
                  name="vehicleCompany"
                  placeholder="Vehicle Company"
                  defaultValue={userVehicle.company}
                  className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                />
                <input
                  type="text"
                  name="vehicleModel"
                  placeholder="Vehicle Model"
                  defaultValue={userVehicle.model}
                  className="mt-2 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                />
                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Update Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

