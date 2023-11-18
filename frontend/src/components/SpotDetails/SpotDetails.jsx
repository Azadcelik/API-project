//todo: first create your action and thunk action followed by reducer 
//todo: in your thunk action fetch data through spot details api 
//todo: in your component retrive spotid first and key thrugh spotId to get your targeted spotDetails image 
//todo: do not forget that spotImage is an array of objects 
//todo: when user clicked you should direct user to the spots/:spotsId so use params need to be used as well
//todo: do not forget to add your route path and element in your router finally 

import { useEffect } from "react"
import { useSelector,useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { getSpotDetails } from "../../store/spotDetails"


const SpotDetails = () => { 


const dispatch = useDispatch() 
const {spotId} = useParams()

const spotDetails = useSelector(state => state.spotDetails)

useEffect(() => { 
    dispatch(getSpotDetails(spotId))
},[dispatch,spotId])

console.log('spotdetails returned from',spotDetails)


    return (
<>        
        <h2>name</h2>
        <h2>city state country </h2>
        <h2> images </h2>
        <h2>ownername lastname</h2>
        <h2>price star rating rviewCount</h2>
        <button>Reserver</button>
        <h2>preview </h2>
 </>

    )
}











export default SpotDetails