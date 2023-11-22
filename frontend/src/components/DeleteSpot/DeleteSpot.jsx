// todo:  when user click on delete button simply pop up use modal
// todo: set this logic in current spot component as you did in post review 
//todo: after paged poped up if user click on delete button then dispatch thunk so can delete on database 
//todo: otherwise simply return to the current page 

import { thunkDeleteSpot } from '../../store/spots'
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
 }

 console.log('response in delete', response)

 }
    return (

<div className="main-delete">
        <h1>Confrm Delete</h1>

        <h2>Are you sure you want to remove this spot
        from the listings?</h2>

        <button onClick ={handleDeleteButton}>Yes (Delete Spot)</button>
        <button>No (Keep Spot)</button>
</div>
    )
}











export default DeleteSpot;