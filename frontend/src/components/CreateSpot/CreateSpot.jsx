//todo: create useState for all variables that will be changed
//todo: do not forget dispatch with thunk action so then to be send to your backend

//todo: realize that adding image prop to the data will not add in my backend createspot because i do not have that column
//todo: i shoul probably extract spotid, get images that user uplodaed and then dispatch to the thunk for being fetched
//todo: critical point is add spotId and data that is going to be posted images exactly same as in your backend data style(obj)here
//todo: add your state images which is beeing collected to your handle submit so you can send data

import { useEffect, useState } from "react";
import { ReactReduxContext, useDispatch, useSelector } from "react-redux";
import { thunkCreateSpot } from "../../store/spots";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
import "./CreateSpot.css";
import { useParams } from "react-router-dom";
import { thunkaddImage } from "../../store/addSpotImage";

const CreateSpot = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const spotsData = useSelector((state) => state.spots);
  console.log("why created spot id returns undefined ask", spotsData); //you need this section for updating not creating
  const data = Object.values(spotsData);
  const createdSpotId = data[0]?.id;
  console.log("createdid,.dasasd", createdSpotId);

  const dispatch = useDispatch();

  const [country, setCountry] = useState("");
  const [address, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [error, setError] = useState(null);

  const [validationErrors, setValidationErrors] = useState({});

  // const [validationErrors,setValidationErrors] = useState({})

  //create differnt iamges

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [previeww, setPreview] = useState("");

  //todo: ask if you can syncronously create your error below and set or you need to return error from backend
  // todo: and need to use that error you returned from back end  askkkkkkkkkkk

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!country) errors.country = "Country is required";
    if (!address) errors.address = "Address is required";
    if (body?.length < 30)
      errors.body = "Description needs a minimum of 30 characters";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!latitude) errors.latitude = "Latitude is required";
    if (!longitude) errors.longitude = "Longtitude is required";
    if (!name) errors.name = "Name is required";
    if (!price) errors.price = "Price is required";
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
    setValidationErrors(errors);
    

    if (Object.values(validationErrors).length > 0) {
      return;
    }

    const formData = {
      country,
      address,
      city,
      state,
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      description: body,
      name,
      price: parseFloat(price),
    };

    const createSpotResponse = await dispatch(thunkCreateSpot(formData));

    const newSpotId = createSpotResponse?.id; //use question mark in case of undefined or nul not throw and error

    if (newSpotId) {
      // Create an array of all images including the preview image
      const allImages = [previeww, image1, image2, image3, image4];

      //i do not tink i need this one come to refactor
      const filteredImages = allImages.filter((img) => img); // i think i do not need this section

      // Map over the images and create a promise for each upload
      const imageUploadPromises = filteredImages.map((img) => {
        // Mark the image object with preview: true only if it's the preview image
        // const isPreview = img === preview;
        const newImgObj = { url: img, preview: true };
        return dispatch(thunkaddImage(newSpotId, newImgObj));
      });

      // Wait for all image uploads to complete
      // await Promise.all(imageUploadPromises);

      // Navigate to the newly created spot's page
      navigate(`/spots/${newSpotId}`);
    } else {
      // Handle the case where spot creation failed
      console.error("Failed to create the spot");
    }
  };

  return (
    <div className="main-contain">
      {error && <p>{error}</p>}
      <div className="h1-h2">
      <h2>Create a New Spot</h2>
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
          {validationErrors.country && (
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
          {validationErrors.address && (
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
            {validationErrors.city && (
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
            {validationErrors.state && (
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
            {validationErrors.latitude && (
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
            {validationErrors.longitude && (
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
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Please write at least 30 characters"
          ></textarea>
          {validationErrors.body && (
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
          {validationErrors.name && (
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
            {validationErrors.price && (
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
            {/* {validationErrors.previeww && (
              <span className="error-message">{validationErrors.previeww}</span>
            )} */}
          </label>

          <label htmlFor="">
            <input
              type="text"
              placeholder="Image URL"
              value={image1}
              onChange={(e) => setImage1(e.target.value)}
            />
            {/* {validationErrors.image1 && (
              <span className="error-message">{validationErrors.image1}</span>
            )} */}
          </label>

          <label htmlFor="">
            <input
              type="text"
              placeholder="Image URL"
              value={image2}
              onChange={(e) => setImage2(e.target.value)}
            />
            {/* {validationErrors.image2 && (
              <span className="error-message">{validationErrors.image2}</span>
            )} */}
          </label>
          <label htmlFor="">
            <input
              type="text"
              placeholder="Image URL"
              value={image3}
              onChange={(e) => setImage3(e.target.value)}
            />
            {/* {validationErrors.image3 && (
              <span className="error-message">{validationErrors.image3}</span>
            )} */}
          </label>

          <label htmlFor="">
            <input
              type="text"
              placeholder="Image URL"
              value={image4}
              onChange={(e) => setImage4(e.target.value)}
            />
            {/* {validationErrors.image4 && (
              <span className="error-message">{validationErrors.image4}</span>
            )} */}
          </label>
        </div>
         <hr />
        <button className="create-button">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;
