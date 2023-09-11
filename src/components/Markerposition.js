import React, {useEffect} from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import iconLocation from "./icon.js"

const Markerposition = ({address}) => {
    
    const position = [address.location.lat, address.location.lng]
    const map = useMap()

    useEffect(() => {
        map.flyTo(position, 13, {
            animate:true
            })
    }, [map, position])
    
    return (
        <>
            <Marker icon={iconLocation} position={position}>
                <Popup>Your searched  <br /> location</Popup>
            </Marker>
        </>
    )
}

export default Markerposition