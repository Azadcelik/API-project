//todo: you need to create your action thunkaction and reducer to get your data from your store by your state 
//todo : create your component here which will have same layout as your home page 
//todo: add additional button such as Create a new spot update or delete 
//todo: that is all  after that you are good to go :)

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { thunkCurrentSpot } from "../../store/currentSpot"
import { useDispatch } from "react-redux"
import './CurrentSpot.css'

const CurrentSpot = () => { 

const dispatch = useDispatch()

const currentData = useSelector(state => state.currentSpot)

const data = Object.values(currentData)

useEffect(() => { 
    dispatch(thunkCurrentSpot())
}, [dispatch])
 


    return (
        

<>
        <h1>Manage Your Spots</h1>
        <button>Create a New Spot</button>
        {data.map(dat => { 

          return  <img src={dat.previewImage} alt="" />

        })}
        <h2>city, state</h2>
        <h2>price night</h2>
        <h3>*avgRating ##</h3>
    <div className="update-delete-button"> 
        <button>Update</button>
        <button>Delete</button>
    </div>
</>
 
   )
}












export default CurrentSpot