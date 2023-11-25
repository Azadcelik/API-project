// todo:  when user click on delete button simply pop up use modal
// todo: set this logic in current spot component as you did in post review 
//todo: after paged poped up if user click on delete button then dispatch thunk so can delete on database 
//todo: otherwise simply return to the current page 

import { getSpotDetails, thunkDeleteSpot } from '../../store/spots'
import './DeleteSpot.css'
import { useDispatch } from 'react-redux'
import {useModal} from '../../context/Modal'



const DeleteSpot = ({spotId}) => { 
    const {closeModal} = useModal()
    console.log('in  delete',spotId)

const dispatch = useDispatch()


 const handleDeleteButton = async () =>  { 

 const response = await dispatch(thunkDeleteSpot(spotId))
 
 if (!response.error) { 
    closeModal()
//    await dispatch(getSpotDetails(spotId))
 }

 console.log('response in delete', response)

 }

 const handleKeepButton = () => { 
     closeModal()
 }

    return (

    <div className="modal">
        <div className="modal-header">Confirm Delete</div>
        <div className="modal-body">Are you sure you want to remove this spot <br />
from the listings?</div>
        <button className="modal-button delete" onClick={handleDeleteButton}>Yes (Delete Spot)</button>
        <button className="modal-button cancel" onClick={handleKeepButton}>No (Keep Spot)</button>
    </div>
    )
}











export default DeleteSpot;