// todo: make your component with expected result first as a psueducode
// todo: after that go to your action creator and make your action creator
// todo: then make your thunk function to fetch your data 
// todo: then handle your reducer to update your data which will be sent as a state back to this page 
// todo : do all your useSelector,useState whatever you need in this page
// todo: then finally pass your component to your root page  


import {useSelector,useDispatch } from "react-redux"
import { getAllSpots } from "../../store/spots"
import { useEffect } from "react"

import './ListOfSpots.css'


const ListOfSpots = () => { 

const dispatch = useDispatch()

const spotsData = useSelector(state => state.spots.Spots) 
// console.log(spotsData) // spotsdata is an array of objects 
console.log(spotsData)
useEffect(() => { 
    dispatch(getAllSpots())
}, [dispatch])


return (
    <div className="grid-container">   
        {spotsData.map(spot => (
            <div key={spot.id} className="grid-item">
                <span className="tooltip">{spot.name}</span> 
                <img src={spot.previewImage} alt={spot.name}/>
                <h2>{spot.state}</h2>
                <h2>{spot.price}</h2>
            </div>
        ))}
    </div>
)

}

export default ListOfSpots