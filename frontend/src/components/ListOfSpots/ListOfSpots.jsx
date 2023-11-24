// todo: make your component with expected result first as a psueducode
// todo: after that go to your action creator and make your action creator
// todo: then make your thunk function to fetch your data 
// todo: then handle your reducer to update your data which will be sent as a state back to this page 
// todo : do all your useSelector,useState whatever you need in this page
// todo: then finally pass your component to your root page  


import {useSelector,useDispatch } from "react-redux"
import { getAllSpots } from "../../store/spots"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import './ListOfSpots.css'


const ListOfSpots = () => { 



const [error,setError] = useState(null)
const dispatch = useDispatch()
const navigate = useNavigate()

const spots = useSelector(state => state.spots) 

console.log('spots in before object key', spots)
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


const navigateToSpotDetailsPage = (spotId) => { 
  
  navigate(`/spots/${spotId}`)
}

return (
    <div className="grid-container">
      {spotsData.map((spot) => (
        <div key={spot.id} className="grid-item"  onClick={() => navigateToSpotDetailsPage(spot.id)}>
             <span className="tooltip">{spot.name}</span> 
          <img src={spot.previewImage} className="spot-thumbnail"/>
          <div className="spot-info">
            <div className="spot-location">
              <span className="spot-city">{spot.city},</span>
              <span className="spot-state">{spot.state}</span>
            </div>
            <div className="spot-rating">
              <span className="star-icon">★</span>
              <span className="rating-value">{spot.avgRating?.toFixed(2)}</span>
            </div>
          </div>
          <div className="spot-price">${spot.price} <span>night</span></div>
        </div>
      ))}
    </div>
  );
};




export default ListOfSpots