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
  const navigate = useNavigate();
  

  const { setModalContent } = useModal();

  const handleDeleteOpenModel = (spotId) => {
    setModalContent(<DeleteSpot spotId={spotId} />);
  };

  const currentData = useSelector((state) => state.spots);
  console.log('current data in curent ', currentData)
  const spots = Object.values(currentData);
  const currentUser = useSelector(state => state.session.user)
  const spotsData = spots.filter(spot => spot?.ownerId == currentUser?.id)
  console.log('spotsdata in current spot',spotsData)


  useEffect(() => {
    dispatch(thunkCurrentSpot());
  }, [dispatch]);

  const handleUpdateClick = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const navigateDetailedPage = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  const createSpotButton = () => { 
    navigate('/spots/new')
  }

  return (
    <>
      <div>
      <h2 className="manage">Manage Your Spots</h2>
      {spotsData.length < 1 && <button onClick={createSpotButton} className="create-current-button">Create a New Spot</button>}
      </div>
      <div className="grid-container">
        {spotsData.map((spot) => (
          <div
            key={spot.id}
            className="grid-item"
          >
            <span className="tooltip">{spot.name}</span>
            <div  onClick={() => navigateDetailedPage(spot.id)}>
            <img src={spot.previewImage} className="spot-thumbnail" />
            <div className="spot-info">
              <div className="spot-location">
                <span className="spot-city">{spot.city},&nbsp;</span>
                <span className="spot-state">{spot.state}</span>
              </div>
              <div className="spot-rating">
                <span className="star-icon">★</span>
                <span className="rating-value">
                  {spot.avgRating?.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="spot-price">
              ${spot.price} <span className="spot-night">night</span>
            </div>
            </div>
            <div className="update-delete-button">
              <button onClick={() => handleUpdateClick(spot.id)} className="up-but">
                Update
              </button>
              <button onClick={() => handleDeleteOpenModel(spot.id)} className="up-but">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CurrentSpot;
