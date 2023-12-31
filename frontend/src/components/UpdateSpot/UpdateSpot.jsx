//todo: when i click on update button i should navigate to the id/edit page 
//todo: Use same form as you used in create form 
//todo: send same data as you send in create form 
//todo: think about how you are gonna upload images at the same time this looks very tricky 
//todo: use same error validation as you used in create form 
//todo: to update your data you need to send your data with in component file and your thunkfunction in js should use as a parameter and also critical is id
//todo: after customer clicked on create navigate customer to the spot/id page with updated code 
//todo: consider to retrieve data from image to update image photos from store or ask how to do it ?





import { useState } from "react";
import {  useDispatch,useSelector } from "react-redux"
import { thunkUpdateSpot } from "../../store/spots";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';

import {useParams} from 'react-router-dom'
import { thunkaddImage } from "../../store/addSpotImage";
// import { thunkaddImage } from "../../store/addSpotImage";

    


const UpdateSpot = () => {

const {spotId} = useParams()

const navigate = useNavigate()

const spotsData = useSelector(state => state.spots[spotId])


// console.log('in update section component ',spotsData)
// const data = Object.values(spotsData)
// const updatedSpotId = data[0]?.id
// console.log('in update section component ',updatedSpotId)


const dispatch = useDispatch()


const [country,setCountry] = useState(spotsData?.country)
const [address,setAdress] = useState(spotsData?.address)
const [city,setCity] = useState(spotsData?.city)
const [state,setState] = useState(spotsData?.state)
const [latitude,setLatitude] = useState(spotsData?.lat)
const [longitude,setLongitude] = useState(spotsData?.lng)
const [body,setBody] = useState(spotsData?.description)
const [name,setName] = useState(spotsData?.name)
const [price,setPrice] = useState(spotsData?.price)
// const [error,setError] = useState(null)
const  [hasSubmitted, setHasSubmitted] = useState(false);
const [validationErrors, setValidationErrors] = useState({});

// const [validationErrors,setValidationErrors] = useState({})

//create differnt iamges 

const [image1,setImage1] = useState("")
const [image2,setImage2] = useState("")
const [image3,setImage3] = useState("")
const [image4,setImage4] = useState("")
const [previeww,setPreview] = useState('')

 
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
    setHasSubmitted(true)
    const errors = {};
    if (!country) errors.country = "Country is required";
    if (!address) errors.address = "Address is required";
    if (body?.length < 30)
      errors.body = "Description needs a minimum of 30 characters";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!latitude) errors.latitude = "Latitude is required";
     if ( isNaN(latitude) ||  latitude < -90 || latitude > 90) {
      errors.latitude = "Latitude must be between -90 and 90";
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    errors.longitude = "Longitude must be between -180 and 180";
  }
    if (!longitude) errors.longitude = "Longtitude is required";
    if (!name) errors.name = "Name is required";
    if (!price) errors.price = "Price is required";
    if (isNaN(price)) errors.price = 'Price is not valid';
    if (!previeww || !/\.(jpg|jpeg|png)$/i.test(previeww)) {
      errors.previeww =
        "Preview image URL is required and must end in .png, .jpg, or .jpeg";
    }
    const validateImageUrl = (url) => {
      return !url || /\.(jpg|jpeg|png)$/i.test(url);
    };
    if (image1 && !validateImageUrl(image1)) {
      errors.image1 = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (image2 && !validateImageUrl(image2)) {
      errors.image2 = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (image3 && !validateImageUrl(image3)) {
      errors.image3 = "Image URL must end in .png, .jpg, or .jpeg";
    }
    if (image4 && !validateImageUrl(image4)) {
      errors.image4 = "Image URL must end in .png, .jpg, or .jpeg";
    }
    
    

    if (Object.values(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }


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
  
  
    
    //todo: definetely come back to refactor for error handling  this is very important 
    // if (updateSpotResponse.error) { 
    //   setError('Please try again') 
    // }
    // Dispatch thunkCreateSpot and get the response
  const updateSpotResponse = await dispatch(thunkUpdateSpot(spotId,updateFormData));
    
    // if (!updateSpotResponse) return

    const newSpotId = updateSpotResponse?.id;  //use question mark in case of undefined or nul not throw and error 

    //todo: do not worry about update picture in update because you have no data for that!!
    if (newSpotId) {
    //   Create an array of all images including the preview image
      const allImages = [previeww, image1, image2, image3, image4];
     console.log('alliimages aupadte in updateded section',allImages)
     //i do not tink i need this one come to refactor 
      const filteredImages = allImages.filter(img => img); // i think i do not need this section
  
      // Map over the images and create a promise for each upload
      // const imageUploadPromises = 
      filteredImages.map(img => {
          // Mark the image object with preview: true only if it's the preview image
          const isPreview = img === previeww;
          const newImgObj = { url: img, previeww: isPreview };
          return dispatch(thunkaddImage(newSpotId, newImgObj));
      });
  
      //i do not tink i need this one come to refactor 
      // await Promise.all(imageUploadPromises);
  
      // Navigate to the newly created spot's page
      navigate(`/spots/${spotId}`);
  } else {
      // Handle the case where spot creation failed
      console.log('Failed to update the spot');
 
    }


}
return (
  <div className="main-contain">
    {/* {error && <p>{error}</p>} */}
    <div className="h1-h2">
    <h2>Update your Spot</h2>
    <h3>Where&apos;s your place located?</h3>
    <h4>
      Guests will only get your exact address once they booked a reservation.
    </h4>
    </div>
    <form onSubmit={handleSubmit} className="create-form">
      <label>
        Country
        <input
          type="text"
          value={country}
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
        />
        {hasSubmitted && validationErrors.country && (
          <span className="error-message">{validationErrors.country}</span>
        )}
      </label>

      <label>
        Street Address
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAdress(e.target.value)}
        />
        {hasSubmitted && validationErrors.address && (
          <span className="error-message">{validationErrors.address}</span>
        )}
      </label>

      <div className="city-state">
        <label>
          City
          <input
            className="city"
            type="text"
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
          />
          {hasSubmitted && validationErrors.city && (
            <span className="error-message">{validationErrors.city}</span>
          )}
        </label>

        <label>
          State
          <input
            className="state"
            type="text"
            value={state}
            placeholder="STATE"
            onChange={(e) => setState(e.target.value)}
          />
          {hasSubmitted && validationErrors.state && (
            <span className="error-message">{validationErrors.state}</span>
          )}
        </label>
      </div>

      <div className="lat-long">
        <label>
          Latitude
          <input
            className="lat"
            type="text"
            value={latitude}
            placeholder="40.730610"
            onChange={(e) => setLatitude(e.target.value)}
          />
          {hasSubmitted && validationErrors.latitude && (
            <span className="error-message">{validationErrors.latitude}</span>
          )}
        </label>

        <label>
          Longitude
          <input
            className="long"
            type="text"
            value={longitude}
            placeholder="-73.935242"
            onChange={(e) => setLongitude(e.target.value)}
          />
          {hasSubmitted && validationErrors.longitude && (
            <span className="error-message">
              {validationErrors.longitude}
            </span>
          )}
        
        </label>
        
      </div>
      <hr />
      <h2>Describe your place to guests</h2>
      <h3>
        Mention the best features of your space, any special amentities like
        fast wif or parking, and what you love about the neighborhood.
      </h3>
      <label htmlFor="">
        <textarea className="body-text"
          name=""
          id=""
          cols="30"
          rows="10"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Please write at least 30 characters"
        ></textarea>
        {hasSubmitted && validationErrors.body && (
          <span className="error-message">{validationErrors.body}</span>
        )}
      </label>
      <hr />

      <h2>Create a title for your spot</h2>
      <h3>
        Catch guests&apos; attention with a spot title that highlights what
        makes your place special
      </h3>
      <label htmlFor="">
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {hasSubmitted && validationErrors.name && (
          <span className="error-message">{validationErrors.name}</span>
        )}
      </label>
      <hr />

      <h2>Set a base price for your spot</h2>
      <h3>
        Competitive pricing can help your listing stand out and rank higher in
        search results.
      </h3>
      <div className="dollar-sign-wrapper">
        <span className="dolar-sign">$</span>
        <label htmlFor="">
          <input
            type="text"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {hasSubmitted && validationErrors.price && (
            <span className="error-message">{validationErrors.price}</span>
          )}
        </label>
      </div>
      <hr />

      <h2>Liven up your spot with photos</h2>
      <h3>Submit a link to at least one photo to publish your spot</h3>
      <div className="image-url">
        <label htmlFor="">
          <input
            type="text"
            placeholder="Preview Image URL"
            value={previeww}
            onChange={(e) => setPreview(e.target.value)}
          />
          {hasSubmitted && validationErrors.previeww && (
            <span className="error-message">{validationErrors.previeww}</span>
          )}
        </label>

        <label htmlFor="">
          <input
            type="text"
            placeholder="Image URL"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
          {validationErrors.image1 && (
            <span className="error-message">{validationErrors.image1}</span>
          )}
        </label>

        <label htmlFor="">
          <input
            type="text"
            placeholder="Image URL"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
          {validationErrors.image2 && (
            <span className="error-message">{validationErrors.image2}</span>
          )}
        </label>
        <label htmlFor="">
          <input
            type="text"
            placeholder="Image URL"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
          {validationErrors.image3 && (
            <span className="error-message">{validationErrors.image3}</span>
          )}
        </label>

        <label htmlFor="">
          <input
            type="text"
            placeholder="Image URL"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          />
          {validationErrors.image4 && (
            <span className="error-message">{validationErrors.image4}</span>
          )}
        </label>
      </div>
       <hr />
      <button className="create-button">Update your Spot</button>
    </form>
  </div>
);
};





export default UpdateSpot;
