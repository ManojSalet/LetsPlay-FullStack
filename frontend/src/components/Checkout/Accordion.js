import React, { useEffect, useState } from "react";
import styles from "./checkout.module.css";
import { useCart } from "../../Context/CartContext";
import { getAddress, saveAddress } from "../../API/apiService";
import Button from "../Button/Button";

function Accordion({ adressId, paymentMethod }) {
  const { allCartData } = useCart();
  const userId = allCartData?.cart?.user;
  const [address, setAddress] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(""); // For country selection
  const [states, setStates] = useState([]); // To store and update states based on country


  // Country and state data
  const countryData = {
    us: ["California", "Texas", "New York", "Florida"],
    ca: ["Ontario", "Quebec", "British Columbia"],
    in: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Ahmedabad", "Porbandar", "Rajkot"],
  };

  const fetchAddress = async () => {
    try {
      const response = await getAddress(userId);
      // console.log("demo", response?.addresses);
      if (response?.addresses) {
        setAddress(response?.addresses);
      } else {
        setAddress([]);
      }
    } catch (error) {
      console.error("Failed to fetch address", error);
    }
  };

  useEffect(() => {
    if (userId) {
      // Only fetch address if userId exists
      fetchAddress();
    }
  }, [userId]);

  useEffect(() => {
    // Update states based on the selected country
    if (selectedCountry) {
      setStates(countryData[selectedCountry] || []);
    } else {
      setStates([]);
    }
  }, [selectedCountry]); // Runs whenever `selectedCountry` changes

  if (!userId) {
    // Handle the case when userId is not available
    return <div>Loading...</div>; // Or any appropriate UI until the data is available
  }

  const getAddressId = (id) => {
    console.log("Selected Address ID: ", id);
    adressId(id);
  };

  const getPaymentMethod = (method) => {
    console.log("Selected Payment Method: ", method);
    paymentMethod(method);
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;

    const addressDetails = {
      details: {
        name: firstName + " " + lastName,
        houseNo: e.target.houseNo.value,
        street: e.target.street.value,
        landmark: e.target.landmark.value,
        district: e.target.district.value,
        contact: e.target.contact.value,
        country: e.target.country.value,
        state: e.target.state.value,
        pin: e.target.zip.value,
      },
    };

    try {
      const response = await saveAddress(addressDetails);
      console.log("Address Saved: ", response);
      if (response) {
        fetchAddress();
        alert("Address saved successfully \nselect from the list");
        e.target.reset();
      }
    } catch (error) {
      console.error("Failed to save address", error);
    }
    console.log("Address Details: ", addressDetails);
  };

  return (
    <>
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <h4 className="">Default Shipping Address</h4>
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <div className="row">
                {address.length > 0 ? (
                  address.map((adr) =>
                    adr.details.map((d) => (
                      <>
                        <div className="m-3 d-flex gap-2" key={d._id}>
                          {" "}
                          {/* Unique key for each address */}
                          <input
                            type="radio"
                            name="adr-1"
                            id={`adr-${d._id}`}
                            className="m-2"
                            // onClick={() => getAddressId(d._id)}
                            onChange={() => getAddressId(d._id)}
                          />
                          <label
                            htmlFor={`adr-${d._id}`}
                            className="w-75"
                            onClick={() => getAddressId(d._id)}
                          >
                            {`${d.name}, ${d.houseNo}, ${d.street}, ${d.landmark}, ${d.district}, ${d.state}, ${d.country} - ${d.pin}`}
                            <br />
                            Contact: {d.contact}
                          </label>
                        </div>
                        <hr className="w-75 ms-3" />
                      </>
                    ))
                  )
                ) : (
                  <div className="m-3">
                    No address found. Please add a shipping address.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <h4 className="">Enter Shipping Address</h4>
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <h4 className="mb-3">Shipping Information</h4>
              <form onSubmit={handleAddressSave}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.formInput}`}
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.formInput}`}
                      id="lastName"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="contact" className="form-label">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${styles.formInput}`}
                      id="contact"
                      placeholder="12345 67890"
                      required
                    />
                  </div>
                  <div></div>
                  <div className="col-md-6">
                    <label htmlFor="houseNo" className="form-label">
                      House No
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.formInput}`}
                      id="houseNo"
                      placeholder="1234"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="street" className="form-label">
                      Street
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.formInput}`}
                      id="street"
                      placeholder="Main st"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="landmark" className="form-label">
                      Landmark
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.formInput}`}
                      id="landmark"
                      placeholder="new park"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="district" className="form-label">
                      Disctrict
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.formInput}`}
                      id="district"
                      placeholder="Ahmedabad"
                      required
                    />
                  </div>

                  {/* Country Dropdown */}
                  <div className="col-md-6">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <select
                      className={`form-select ${styles.formInput}`}
                      id="country"
                      name="country"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      required
                    >
                      <option value="">-- Choose a country --</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="in">India</option>
                    </select>
                  </div>

                  {/* State Dropdown */}
                  <div className="col-md-6">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <select
                      className={`form-select ${styles.formInput}`}
                      id="state"
                      name="state"
                      required
                    >
                      <option value="">-- Choose a state --</option>
                      {states.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="zip" className="form-label">
                      Pincode
                    </label>
                    <input
                      type="text"
                      className={`form-control ${styles.formInput}`}
                      id="zip"
                      required
                    />
                  </div>
                </div>
                <Button type={'submit'} label={'Save Address'} className={'mt-3'} />
              </form>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <h4 className="">Payment Information</h4>
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <h4 className="mb-3">Select Payment Method</h4>
              <hr />
              <div className="row mt-2">
                <div className="col-3 d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    id="creditCard"
                    value="Credit Card"
                    onChange={(e) => getPaymentMethod(e.target.value)}
                  />
                  <label
                    htmlFor="creditCard"
                    className="d-flex align-items-center gap-2"
                  >
                    <i class="bi bi-credit-card-fill fs-1"></i>
                    <h6>Credit Card</h6>
                  </label>
                </div>

                <div className="col-3 d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    id="debitCard"
                    value="Debit Card"
                    onChange={(e) => getPaymentMethod(e.target.value)}
                  />
                  <label
                    htmlFor="debitCard"
                    className="d-flex align-items-center gap-2"
                  >
                    <i class="bi bi-credit-card-2-back-fill fs-1"></i>
                    <h6>Debit Card</h6>
                  </label>
                </div>

                <div className="col-3 d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    id="netBanking"
                    value="Net Banking"
                    onChange={(e) => getPaymentMethod(e.target.value)}
                  />
                  <label
                    htmlFor="netBanking"
                    className="d-flex align-items-center gap-2"
                  >
                    <i class="bi bi-bank2 fs-1"></i> <h6>Net Banking</h6>
                  </label>
                </div>

                <div className="col-3 d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    id="cod"
                    value="cod"
                    onChange={(e) => getPaymentMethod(e.target.value)}
                  />
                  <label
                    htmlFor="cod"
                    className="d-flex align-items-center gap-2"
                  >
                    <i class="bi bi-cash fs-1"></i> <h6>COD</h6>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Accordion;
