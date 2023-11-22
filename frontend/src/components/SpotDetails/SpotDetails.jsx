//todo: first create your action and thunk action followed by reducer
//todo: in your thunk action fetch data through spot details api
//todo: in your component retrive spotid first and key thrugh spotId to get your targeted spotDetails image
//todo: do not forget that spotImage is an array of objects
//todo: when user clicked you should direct user to the spots/:spotsId so use params need to be used as well
//todo: do not forget to add your route path and element in your router finally

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetails } from "../../store/spots";
import "./SpotDetails.css";
import PostReview from "../PostReview/PostReview";
import { useModal } from "../../context/Modal";

const SpotDetails = () => {

  const dispatch = useDispatch();
  const { spotId } = useParams();
  console.log("iddddd", spotId);
  const [error,setError] = useState(null)

  //post review code
  const { setModalContent } = useModal();
  const handleOpenModalContent = () => {
    setModalContent(<PostReview />);
  };

  const spots = useSelector((state) => state.spots);
  const spotDetails = Object.values(spots); // array of objects contains spotimages and owners

  console.log("spotdetails returned from in spotDetails section", spotDetails);

  useEffect(() => {
  
   const fetchData  = async () => { 

   const fetchError = await dispatch(getSpotDetails(spotId));
   if (fetchError) { 
    setError('Please try again')
   }
   }
   fetchData()
   setError(null)

  }, [dispatch, spotId]);

  // const imageUrl = spotDetails.SpotImages[0]?.url;

  return (
    <div>
      
      {error && <p>{error}</p>}
       
      {spotDetails.map((spot) => (
        <div key={spot.id}>
          <h2>{spot.name}</h2>
          <h2>
            {spot.city}, {spot.state}, {spot.country}
          </h2>
          <div className="image-container">
            <div className="main-image">
              {spot.SpotImages && spot.SpotImages.length > 0 && (
                <img src={spot.SpotImages[0].url} alt="Main Spot" />
              )}
            </div>
            <div className="small-images">
              {spot.SpotImages &&
                spot.SpotImages.slice(1, 5).map((image) => (
                  <img key={image.id} src={image.url} alt="Spot Image" />
                ))}
            </div>
          </div>

          <div className="name-review">
            <h2>
              Hosted by {spot.Owner.firstName}{" "}
              {spot.Owner.lastName}
            </h2>

            <div className="second">
              <div className="price">
                <h2>
                  ${spot.price} <span className="night">night</span>
                </h2>

                <h3>
                  ☆{spot.avgRating} #reviews {spot.numReviews}
                </h3>
              </div>
              <button>Reserve</button>
            </div>
          </div>
          <hr />
          <button onClick={handleOpenModalContent}>Post Your Review</button>
        </div>
      ))}
    </div>
  );
};

export default SpotDetails;
