//todo: when i click on update button i should navigate to the id/edit page 
//todo: Use same form as you used in create form 
//todo: send same data as you send in create form 
//todo: think about how you are gonna upload images at the same time this looks very tricky 
//todo: use same error validation as you used in create form 
//todo: to update your data you need to send your data with in component file and your thunkfunction in js should use as a parameter and also critical is id
//todo: after customer clicked on create navigate customer to the spot/id page with updated code 
//todo: consider to retrieve data from image to update image photos from store or ask how to do it ?





import { useEffect, useState } from "react";
import { ReactReduxContext, useDispatch,useSelector } from "react-redux"
import { thunkUpdateSpot } from "../../store/updateSpot";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

import {useParams} from 'react-router-dom'
import { thunkaddImage } from "../../store/addSpotImage";
import { getSpotDetails } from "../../store/spotDetails";
// import { thunkaddImage } from "../../store/addSpotImage";

    


const UpdateSpot = () => {

const {spotId} = useParams()

const navigate = useNavigate()

const spotsData = useSelector(state => state.createSpotState)

console.log('why created spot id returns undefined ask',spotsData)
const data = Object.values(spotsData)
const updatedSpotId = data[0]?.id
console.log('createdid,.dasasd',updatedSpotId)



const spotDetails = useSelector(state => state.spotDetails)

const dispatch = useDispatch()

const [isLoading,setIsLoading] = useState(true)
const [country,setCountry] = useState(data[0]?.country)
const [address,setAdress] = useState(data[0]?.address)
const [city,setCity] = useState(data[0]?.city)
const [state,setState] = useState(data[0]?.state)
const [latitude,setLatitude] = useState(data[0]?.latitude)
const [longitude,setLongitude] = useState(data[0]?.longitude)
const [body,setBody] = useState(data[0]?.body)
const [name,setName] = useState(data[0]?.name)
const [price,setPrice] = useState(data[0]?.price)
const [error,setError] = useState({})


// const [validationErrors,setValidationErrors] = useState({})

//create differnt iamges 

const [image1,setImage1] = useState("")
const [image2,setImage2] = useState("")
const [image3,setImage3] = useState("")
const [image4,setImage4] = useState("")
const [preview,setPreview] = useState('')




//probably need to wait for sometimes assskkkkkkkk

useEffect(() => {
    dispatch(getSpotDetails(spotId))
      .then(() => setIsLoading(false)) // Set loading to false once data is fetched
      .catch(error => {
        console.error("Error fetching details:", error);
        setIsLoading(false); // Also set loading to false in case of error
      });
  }, [dispatch, spotId]);
  if (isLoading) {
    return <div>Loading...</div>; // Show a loading message or spinner
  }

  console.log("imaginadadadsadsad",spotDetails) // returns empty obj and empty spotImages array and owner obj all empty 




 
//todo: ask if you can syncronously create your error below and set or you need to return error from backend 
// todo: and need to use that error you returned from back end  askkkkkkkkkkk
// const errorData = useSelector(state => state.createSpotState.error)


// console.log(errorData)

// useEffect(() => {
//   const errors = {};
//   if (!name.length) errors.name='Please enter your Name';
//   if (!email.includes('@')) errors.email='Please provide a valid Email';
//   setValidationErrors(errors);
// }, [name, email])

// const onSubmit = e => {
//   // Prevent the default form behavior so the page doesn't reload.
//   e.preventDefault();
//   if (Object.values(validationErrors).length) { 
//     return alert(`The following errors were found:
    
//     ${validationErrors.name ? "* " + validationErrors.name : ""}
//     ${validationErrors.email ? "* " + validationErrors.email : ""}`);
//   }
  



const handleSubmit = async (e) => {
    e.preventDefault();
    const updateFormData = {
      country,
      address,
      city,
      state,
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      description: body,
      name,
      price: parseFloat(price)
    };
  
  
      // Dispatch thunkCreateSpot and get the response
    const updateSpotResponse = await dispatch(thunkUpdateSpot(spotId,updateFormData));

    //todo: definetely come back to refactor for error handling  this is very important 
    // if (updateSpotResponse.error) { 
    //      setError(updateSpotResponse.error) 
    // }

    const newSpotId = updateSpotResponse?.id;  //use question mark in case of undefined or nul not throw and error 

    if (newSpotId) {
      // Create an array of all images including the preview image
      const allImages = [preview, image1, image2, image3, image4];
  
     //i do not tink i need this one come to refactor 
      const filteredImages = allImages.filter(img => img); // i think i do not need this section
  
      // Map over the images and create a promise for each upload
      const imageUploadPromises = filteredImages.map(img => {
          // Mark the image object with preview: true only if it's the preview image
          const isPreview = img === preview;
          const newImgObj = { url: img, preview: isPreview };
          return dispatch(thunkaddImage(newSpotId, newImgObj));
      });
  
      // Wait for all image uploads to complete
      // await Promise.all(imageUploadPromises);
  
      // Navigate to the newly created spot's page
      navigate(`/spots/${spotId}`);
  } else {
      // Handle the case where spot creation failed
      console.error('Failed to update the spot');
 
    }


}

  return (
    <div className="main-contain">
    
      <h1>Create a New Spot</h1>
      <h2>Where&apos;s your place located?</h2>
      <h3>
        Guests will only get your exact address once they booked a reservation.
      </h3>

      <form onSubmit={handleSubmit}>
        <label>
          Country
          <input
            type="text"
            value={country}
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        {/* {errorData && (
     <h1>this is  an error </h1>

    )} */}
        <label >
          Street Address
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAdress(e.target.value)}
          />
        </label>

    <div className="city-state">
        <label>
          City
          <input className="city"
            type="text"
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
          />
        </label>

        <label>
          State
          <input className="state"
            type="text"
            value={state}
            placeholder="STATE"
            onChange={(e) => setState(e.target.value)}
          />
        </label>
    </div>

        <div className="lat-long">
          <label>
            Latitude
            <input className="lat"
              type="text"
              value={latitude}
              placeholder="40.730610"
              onChange={(e) => setLatitude(e.target.value)}
            />
          </label>

          <label>
            Longitude
            <input className="long"
              type="text"
              value={longitude}
              placeholder="-73.935242"
              onChange={(e) => setLongitude(e.target.value)}
            />
          </label>
        </div>
        <br />
        <h2>Describe your place to guests</h2>
        <h3>
          Mention the best features of your space, any special amentities like
          fast wif or parking, and what you love about the neighborhood.
        </h3>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Please write at least 30 characters"
        ></textarea>
        <br />

        <h2>Create a title for your spot</h2>
        <h3>
          Catch guests&apos; attention with a spot title that highlights what makes
          your place special
        </h3>
        <label htmlFor="">
          <input
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />

        <h2>Set a base price for your spot</h2>
        <h3>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </h3>
        <div className="dollar-sign-wrapper">
          <span className="dolar-sign">$</span>
          <input
            type="text"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <br />

        <h2>Liven up your spot with photos</h2>
        <h3>Submit a link to at least one photo to publish your spot</h3>
      <div className="image-url">
        <input
          type="text"
          placeholder="Preview Image URL"
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image1}
          onChange={(e) => setImage1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image2}
          onChange={(e) => setImage2(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image3}
          onChange={(e) => setImage3(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image4}
          onChange={(e) => setImage4(e.target.value)}
        />
    </div>
        <br />
        <button>Create Spot</button>
      </form>
    </div>
  );
};


export default UpdateSpot;
