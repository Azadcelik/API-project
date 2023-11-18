// todo: make your component with expected result first as a psueducode
// todo: after that go to your action creator and make your action creator
// todo: then make your thunk function to fetch your data 
// todo: then handle your reducer to update your data which will be sent as a state back to this page 
// todo : do all your useSelector,useState whatever you need in this page
// todo: then finally pass your component to your root page  


import {useSelector,useDispatch } from "react-redux"
import { getAllSpots } from "../../store/session"
import { useEffect } from "react"


const ListOfSpots = () => { 

const dispatch = useDispatch()

const spotsData = useSelector(state => state.spots.Spots) 

useEffect(() => { 
    dispatch(getAllSpots())
}, [dispatch])
// console.log(spotsData.state) //spotsData is an object which keying state array

    return (
        <div>   
           
            {spotsData.map(spots => (
            <>
                <h2>{spots.name}</h2>
                <img src={spots.previewImage}/>
                <h2>{spots.state}</h2>
                <h2>{spots.price}</h2>
            </>
            ))}
            
           
        </div>
    )
}


export default ListOfSpots