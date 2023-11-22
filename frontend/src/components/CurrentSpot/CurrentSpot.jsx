//todo: you need to create your action thunkaction and reducer to get your data from your store by your state
//todo : create your component here which will have same layout as your home page
//todo: add additional button such as Create a new spot update or delete
//todo: that is all  after that you are good to go :)

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { thunkCurrentSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
 import { useNavigate } from "react-router-dom";
 import { useModal } from "../../context/Modal";
 import DeleteSpot from "../DeleteSpot/DeleteSpot";

import "./CurrentSpot.css";

const CurrentSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

const {setModalContent} = useModal()

const handleDeleteOpenModel = (spotId) => { 
  setModalContent(<DeleteSpot spotId={spotId}/>)
}



  const currentData = useSelector((state) => state.spots);

  const data = Object.values(currentData);
  

  useEffect(() => {
    dispatch(thunkCurrentSpot());
  }, [dispatch]);


 const handleUpdateClick = (spotId) => { 
   
  navigate(`/spots/${spotId}/edit`)
 }




  return (
    <div className="main-current-container">
      {data.map((current) => (
        
        <div className="second-container" key={current.id}>
            {console.log('currentssalo ', current.previewImage)}
          <h2>Manage Your Spots</h2>
          <button>Create a New Spot</button>

          <img src={current.previewImage} alt="image not found" />

          <p>{current.city} {current.state}</p>
          <h2>{current.price } {current.night}</h2>
          <h3> *{current.avgRating }  ##</h3>
          <div className="update-delete-button">
            <button onClick={() => handleUpdateClick(current.id)}>Update</button>
            <button onClick={() => handleDeleteOpenModel(current.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurrentSpot;
