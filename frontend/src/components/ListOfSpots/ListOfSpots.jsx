// todo: make your component with expected result first as a psueducode
// todo: after that go to your action creator and make your action creator
// todo: then make your thunk function to fetch your data 
// todo: then handle your reducer to update your data which will be sent as a state back to this page 
// todo : do all your useSelector,useState whatever you need in this page
// todo: then finally pass your component to your root page  


import {useSelector,useDispatch } from "react-redux"
import { getAllSpots } from "../../store/spots"
import { useEffect, useState } from "react"

import './ListOfSpots.css'


const ListOfSpots = () => { 



const [error,setError] = useState(null)
const dispatch = useDispatch()


const spots = useSelector(state => state.spots) 
 const spotsData = Object.values(spots)
 console.log('in get spot section',spotsData) //array of objects id discarded

// when i make useEffect async itself dist warned to make async inside and call.make research why but it worked well 
// with this error handling i do not need error action which confuses alot.you can locally handle error by assigning error to null in useState
// return error in catch block so your dispatch thunk will return error which you can set your error by that 

useEffect(() => {
    const fetchData = async () => {
        const errorMessage = await dispatch(getAllSpots());
        console.log('error message in useeffect function',errorMessage)
        if (errorMessage) {
            setError('somethinng went wrongg');
        }
    };
    fetchData();
    setError(null)
}, [dispatch]);


return (
    <div className="grid-container">   
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
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