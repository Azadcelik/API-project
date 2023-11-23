//When viewing the spot's detail page, show a list of the reviews for the spot below the spot's 
//information with the newest reviews at the top, and the oldest reviews at the bottom
//Each review in the review list must include: The reviewer's first name,
// the month and the year that the review was posted (e.g. December 2022), and the review comment text
import './ReviewList.css'

const ReviewList = ({ reviews }) => { 
    console.log('reviews in the review list', reviews);

    return (
        <div >
            {reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(rev => (
                <div key={rev.id} className="revieww">
                    <h2>{rev.User.firstName}</h2>
                    <h2>{new Date(rev.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <p>{rev.review}</p>
                    <hr />
                </div>
                
            ))}
             
        </div>

    );
}









export default ReviewList;