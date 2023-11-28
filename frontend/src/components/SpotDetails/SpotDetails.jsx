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
import { thunkFetchReviewsForSpot } from "../../store/postReview";
import ReviewList from "../ReviewList/ReviewList";

const SpotDetails = () => {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const [error, setError] = useState(null);
  // const [hasUserReviewed, setHasUserReviewed] = useState(false);

  const spotDetails = useSelector((state) => state.spots[spotId]); // Retrieve specific spot details
  console.log("spotdetails in spotdetails section", spotDetails);

  const currentUser = useSelector((state) => state.session?.user);
  const reviewsObject = useSelector((state) => state.reviews[spotId] || {});
  const reviews = Object.values(reviewsObject); // Convert the object to an array

  const userId = currentUser?.id;
  const ownerId = spotDetails?.Owner?.id;
  const spotDetailsId = spotDetails?.id;

  console.log("is this userId lol", userId, ownerId, spotDetailsId);

  const canPostReview = () => {
    if (!currentUser || userId === ownerId) return false;

    const reviews = Object.values(reviewsObject); // Convert the object to an array
    const hasReviewed = reviews.find((review) => review.userId === userId);

    return !hasReviewed;
  };

  // Post review code
  const { setModalContent } = useModal();

  const handleOpenModalContent = () => {
    const onReviewPosted = async () => {
      await dispatch(getSpotDetails(spotId)); // Re-fetch spot details
    };

    setModalContent(
      <PostReview spotsId={spotDetailsId} onReviewPosted={onReviewPosted} />
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchError = await dispatch(getSpotDetails(spotId));
      if (fetchError) {
        setError("Please try again");
      }

      // Dispatch action to fetch reviews
      dispatch(thunkFetchReviewsForSpot(spotId));
    };

    fetchData();
  }, [dispatch, spotId]);

  if (!spotDetails) {
    return <div>Please try again</div>; // Or any other loading state
  }

  const ssss = spotDetails.numReviews < 2 ? "Review" : "Reviews";
  const newReview =
    spotDetails.numReviews < 1
      ? "★ New"
      : `★ ${spotDetails.avgRating?.toFixed(2)} · ${
          spotDetails.numReviews
        } ${ssss}`;

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  return (
    <div className="spot-details-container">
      {error && <p>{error}</p>}

      <div key={spotDetails.id}>
        <h2 className="spot-name">{spotDetails.name}</h2>
        <p className="spot-city-state">
          {spotDetails.city}, {spotDetails.state}, {spotDetails.country}
        </p>
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
          <div className="host-info">
            <div className="host-name">
              <h2 className="host">Hosted by {spotDetails?.Owner?.firstName} {" "}{spotDetails?.Owner?.lastName} </h2>
            </div>
            <p className="desc">{spotDetails.description}</p>
          </div>

          <div className="second">
            <div className="price">
              <h2 className="nightt">
                ${spotDetails.price} <span className="text-night">night</span>
              </h2>

              <h3 className="star-review">{newReview}</h3>
            </div>
            <button className="reserve-button" onClick={handleReserveClick}>
              Reserve
            </button>
          </div>
        </div>
        <h2>{newReview}</h2>
        <hr />

        {canPostReview() && (
          <button onClick={handleOpenModalContent} className="post-review-button">Post Your Review</button>
        )}
        {spotDetails.numReviews < 1 && canPostReview() && (
          <p>Be the first to post a review!</p>
        )}
      </div>
      <ReviewList reviews={reviews} spotId={spotId} />
    </div>
  );
};

export default SpotDetails;
