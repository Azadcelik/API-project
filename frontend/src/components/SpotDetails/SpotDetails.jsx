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
  const [error, setError] = useState(null);

  const spotDetails = useSelector((state) => state.spots[spotId]); // Retrieve specific spot details
  console.log("spotdetails in spotdetails section",spotDetails);

  // Post review code
  const { setModalContent } = useModal();
  const handleOpenModalContent = () => {
    setModalContent(<PostReview />);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchError = await dispatch(getSpotDetails(spotId));
      if (fetchError) {
        setError("Please try again");
      }
    };
    fetchData();
  }, [dispatch, spotId]);

  if (!spotDetails) {
    return <div>Please try again</div>; // Or any other loading state
  }

  return (
    <div>
      {error && <p>{error}</p>}

      <div key={spotDetails.id}>
        <h2>{spotDetails.name}</h2>
        <h2>
          {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
        </h2>
        <div className="image-container">
          <div className="main-image">
            {spotDetails.SpotImages && spotDetails.SpotImages.length > 0 && (
              <img src={spotDetails.SpotImages[0].url} alt="Main Spot" />
            )}
          </div>
          <div className="small-images">
            {spotDetails.SpotImages &&
              spotDetails.SpotImages.slice(1, 5).map((image) => (
                <img key={image.id} src={image.url} alt="Spot Image" />
              ))}
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
      </div>
    </div>
  );
};

export default SpotDetails;
