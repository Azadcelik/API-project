//todo: first create your action and thunk action followed by reducer
//todo: in your thunk action fetch data through spot details api
//todo: in your component retrive spotid first and key thrugh spotId to get your targeted spotDetails image
//todo: do not forget that spotImage is an array of objects
//todo: when user clicked you should direct user to the spots/:spotsId so use params need to be used as well
//todo: do not forget to add your route path and element in your router finally

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetails } from "../../store/spotDetails";
import "./SpotDetails.css";
import PostReview from "../PostReview/PostReview";
import {useModal} from '../../context/Modal'


const SpotDetails = () => {


  const dispatch = useDispatch();
  const { spotId } = useParams();
  const  {setModalContent} = useModal()


  const handleOpenModalContent = () => { 
    setModalContent(<PostReview />)
  }

  const spotDetails = useSelector((state) => state.spotDetails);
  // console.log("spotdetails returned from", spotDetails);
  useEffect(() => {
    dispatch(getSpotDetails(spotId));
  }, [dispatch, spotId]);


  

  const imageUrl = spotDetails.SpotImages[0]?.url;

  return (
    <>
      <h2>{spotDetails.name}</h2>
      <h2>
        {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
      </h2>
      <div className="image-container">
        <div className="main-image">
          <img src={imageUrl} alt="Main Spot" />
        </div>
        <div className="small-images">
          <img src={imageUrl} alt="Spot Image" />
          <img src={imageUrl} alt="Spot Image" />
          <img src={imageUrl} alt="Spot Image" />
          <img src={imageUrl} alt="Spot Image" />
        </div>
      </div>


<div className="name-review">
      <h2>
        Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
      </h2>

<div className="second">
      <div className="price">
        <h2>
          ${spotDetails.price} <span className="night">night</span>
        </h2>

        <h3>
          ☆{spotDetails.avgRating} #reviews {spotDetails.numReviews}
        </h3>
        
      </div>
      <button>Reserve</button>
</div> 
 
</div>
     <hr />
     <button onClick={handleOpenModalContent}>Post Your Review</button>
      
    </>

  );
};

export default SpotDetails;
