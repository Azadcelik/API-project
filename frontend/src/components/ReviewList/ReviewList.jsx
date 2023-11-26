//When viewing the spot's detail page, show a list of the reviews for the spot below the spot's
//information with the newest reviews at the top, and the oldest reviews at the bottom
//Each review in the review list must include: The reviewer's first name,
// the month and the year that the review was posted (e.g. December 2022), and the review comment text
import "./ReviewList.css";
import { useModal } from "../../context/Modal";
import DeleteReview from "../DeleteReview/DeleteReview";
import { useSelector } from "react-redux";

const ReviewList = ({ reviews, spotId }) => {
  console.log("reviews in the review list", reviews);
  const currentUser = useSelector(state => state.session.user)
  console.log('user in rrevieww lsit secidontaosd', currentUser)

  const { setModalContent } = useModal();

  const handleOpenModal = (reviewId) => {
    setModalContent(<DeleteReview reviewId={reviewId} spotId={spotId} />);
  };

  return (
    <div>
      {reviews
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((rev) => (
            
          <div key={rev.id} className="revieww">
            <h2 className="review-namee">{rev.User.firstName}</h2>
            <h2 className="date-review">
              {new Date(rev.createdAt).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <p className="review-text">{rev.review}</p>
            { currentUser && currentUser?.id == rev.userId && (
                <button onClick={() => handleOpenModal(rev.id)} className="button-for-delete-review">Delete</button>
            )}
            <hr />
          </div>
        ))}
    </div>
  );
};

export default ReviewList;
