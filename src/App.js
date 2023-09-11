import { useState, useEffect } from "react"
import { MapContainer, TileLayer} from 'react-leaflet'
import arrow from "./images/icon-arrow.svg"
import bgMobile from "./images/pattern-bg-mobile.png"
import bgDesktop from "./images/pattern-bg-desktop.png"
import "leaflet/dist/leaflet.css"
import Markerposition from "./components/Markerposition.js"


function App() {
  const [address, setAddress] = useState(null)
  const [ipAddress, setIpAddress] = useState("")
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/


  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=8.8.8.8`
        )
        const data = await res.json()
        setAddress(data)
      }

      getInitialData()
      
    } catch (error) {
      console.trace(error)
    }
  }, [])

  const getEnteredAddress = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    )
    const data = await res.json()
    setAddress(data) 
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    getEnteredAddress()
    setIpAddress("")
  }

  return (
    <>
      <section>
        <div className="fixed w-screen -z-50">
          <picture>
            <source media="(min-width: 768px)" srcSet={bgDesktop} />
            <img src={bgMobile} alt="Background Pattern" className="bg__img w-screen h-72"/>
          </picture>
        </div>
          
        <article className="max-w-xl mx-auto p-4 md:p-6">
          <h1 className="text-2xl lg:text-3xl text-center text-white font-bold mb-8">IP Address Tracker</h1>
          <form onSubmit={handleSubmit} autoComplete="off" className="flex justify-center max-w-xl mx-auto">
            <input 
              type="text" 
              name="ip-address" 
              className="ip__input py-2 px-4 rounded-l-lg w-screen" 
              id="ip_address" 
              value={ipAddress} 
              onChange={(e) => setIpAddress(e.target.value)} 
              placeholder="Search for any IP address or domain" 
              required
            ></input>
            <button type="submit" className="px-4 rounded-r-lg">
              <img src={arrow} alt="Arrow" className="w-3 md:w-6"/>
            </button>
          </form>
        </article>

        {address && (
          <>
            <article className="px-4 md:p-6">
              <div
                className="relative ip__info-bar rounded-xl p-6 shadow max-w-6xl mx-auto grid grid-cols-1 gap-5 text-center md:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:text-left -mb-64 lg:-mb-24"
                style={{zIndex: 10000}}>
                <article className="lg:border-r lg:border-slate-300 px-8 md:px-0 md:pr-8 md:pl-2">
                  <h2 className="title uppercase text-xs lg:text-sm font-bold">IP Address</h2>
                  <p className="info font-medium md:font-bold text-lg md:text-xl pt-1 lg:pt-2">{address.ip}</p>
                </article>

                <article className="lg:border-r lg:border-slate-300 px-8">
                  <h2 className="title uppercase text-xs lg:text-sm font-bold">Location</h2>
                  <p className="info font-medium md:font-bold text-lg md:text-xl pt-1 lg:pt-2">{address.location.city}, {address.location.region}</p>
                </article>

                <article className="lg:border-r lg:border-slate-300 px-8">
                  <h2 className="title uppercase text-xs lg:text-sm font-bold">Timezone</h2>
                  <p className="info font-medium md:font-bold text-lg md:text-xl pt-1 lg:pt-2">UTC {address.location.timezone}</p>
                </article>

                <article className="px-6">
                  <h2 className="title uppercase text-xs lg:text-sm font-bold">ISP</h2>
                  <p className="info font-medium md:font-bold text-lg md:text-xl pt-1 lg:pt-2">{address.isp}</p>
                </article>
              </div>
            </article>

            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              className="map-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Markerposition address={address} />
            </MapContainer>
          </>
        )}
      </section>
    </>
  );
}

export default App;
