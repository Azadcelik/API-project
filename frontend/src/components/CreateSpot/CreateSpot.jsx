//todo: create useState for all variables that will be changed
//todo: do not forget dispatch with thunk action so then to be send to your backend

import { useState } from "react";
import { useDispatch,useSelector } from "react-redux"
import { thunkCreateSpot } from "../../store/createSpot";
// import { useNavigate } from 'react-router-dom';
import './CreateSpot.css'


const CreateSpot = () => {

const dispatch = useDispatch()
// const navigate = useNavigate()

const [country,setCountry] = useState('')
const [address,setAdress] = useState('')
const [city,setCity] = useState('')
const [state,setState] = useState('')
const [image,setImage] = useState('')
const [latitude,setLatitude] = useState()
const [longitude,setLongitude] = useState()
const [body,setBody] = useState('')
const [name,setName] = useState('')
const [price,setPrice] = useState()
const [preview,setPreview] = useState('')
// const [validationErrors,setValidationErrors] = useState({})



 
//todo: ask if you can syncronously create your error below and set or you need to return error from backend 
// todo: and need to use that error you returned from back end  askkkkkkkkkkk
const errorData = useSelector(state => state.createSpotState.error)


console.log(errorData)

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
    const formData = {
      country,
      address,
      city,
      state,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description: body,
      name,
      price: parseFloat(price),
      SpotImages: [image, /* other image URLs if necessary */], //search for it because not hundred percent sure
    };
  
    await dispatch(thunkCreateSpot(formData)); // Assuming thunkCreateSpot is your thunk action
    //  navigate('/')


  };




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
        {errorData && (
     <h1>this is  an error </h1>
    )}
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
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
    </div>
        <br />
        <button>Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;
