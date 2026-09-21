import React, { useEffect, useState } from "react";
import { useCart } from "../../Context/CartContext";
import { getAddress, saveAddress } from "../../API/apiService";
import Button from "../Button/Button";
import {
  MapPin,
  Plus,
  CreditCard,
  Landmark,
  Banknote,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function Accordion({ adressId, paymentMethod }) {
  const { allCartData } = useCart();
  const userId = allCartData?.cart?.user;
  const [address, setAddress] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [openSection, setOpenSection] = useState("address"); // 'address' | 'new-address' | 'payment'
  const [selectedCountry, setSelectedCountry] = useState("in");
  const [states, setStates] = useState([]);

  const countryData = {
    us: ["California", "Texas", "New York", "Florida"],
    ca: ["Ontario", "Quebec", "British Columbia"],
    in: [
      "Gujarat",
      "Maharashtra",
      "Delhi",
      "Karnataka",
      "Tamil Nadu",
      "Rajasthan",
      "Punjab",
    ],
  };

  const fetchAddress = async () => {
    try {
      const response = await getAddress(userId);
      if (response?.addresses) {
        setAddress(response.addresses);
      } else {
        setAddress([]);
      }
    } catch (error) {
      console.error("Failed to fetch address", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddress();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedCountry) {
      setStates(countryData[selectedCountry] || []);
    } else {
      setStates([]);
    }
  }, [selectedCountry]);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    adressId(id);
  };

  const handleSelectPayment = (method) => {
    setSelectedMethod(method);
    paymentMethod(method);
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    const form = e.target;

    const addressDetails = {
      details: {
        name: `${form.firstName.value} ${form.lastName.value}`,
        houseNo: form.houseNo.value,
        street: form.street.value,
        landmark: form.landmark.value,
        district: form.district.value,
        contact: form.contact.value,
        country: form.country.value,
        state: form.state.value,
        pin: form.zip.value,
      },
    };

    try {
      const response = await saveAddress(addressDetails);
      if (response) {
        await fetchAddress();
        form.reset();
        setOpenSection("address");
      }
    } catch (error) {
      console.error("Failed to save address", error);
      alert("Failed to save address. Please try again.");
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  return (
    <div className="space-y-4">
      {/* 1. Saved Addresses Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection("address")}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Shipping Address
              </h3>
              <p className="text-xs text-slate-500">
                {selectedAddressId ? "Address selected" : "Choose delivery address"}
              </p>
            </div>
          </div>
          {openSection === "address" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {openSection === "address" && (
          <div className="p-5 pt-0 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 gap-3 pt-4">
              {address.length > 0 ? (
                address.flatMap((adr) => adr.details || []).map((d) => (
                  <label
                    key={d._id}
                    className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      selectedAddressId === d._id
                        ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="addressSelection"
                      checked={selectedAddressId === d._id}
                      onChange={() => handleSelectAddress(d._id)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 text-sm block">
                        {d.name}
                      </span>
                      <span>
                        {d.houseNo}, {d.street}, {d.landmark}, {d.district},{" "}
                        {d.state}, {d.country} — <strong>{d.pin}</strong>
                      </span>
                      <span className="block mt-1 text-slate-500 font-medium">
                        Phone: {d.contact}
                      </span>
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  No saved addresses found. Please add a new address below.
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpenSection("new-address")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer pt-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add a new delivery address</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Enter New Address Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection("new-address")}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Add New Delivery Address
              </h3>
              <p className="text-xs text-slate-500">Enter a new shipping destination</p>
            </div>
          </div>
          {openSection === "new-address" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {openSection === "new-address" && (
          <div className="p-5 pt-0 border-t border-slate-100">
            <form onSubmit={handleAddressSave} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="Rohit"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    required
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Flat / House No.
                  </label>
                  <input
                    type="text"
                    name="houseNo"
                    required
                    placeholder="Flat 402, Block B"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Street / Area
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="Stadium Road, Navrangpura"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    required
                    placeholder="Near Cricket Ground"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District / City
                  </label>
                  <input
                    type="text"
                    name="district"
                    required
                    placeholder="Ahmedabad"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="in">India</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <select
                    name="state"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {states.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pincode / Zip Code
                </label>
                <input
                  type="text"
                  name="zip"
                  required
                  placeholder="380009"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  label="Save & Use Address"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 3. Payment Method Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => toggleSection("payment")}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Payment Method
              </h3>
              <p className="text-xs text-slate-500">
                {selectedMethod ? `Selected: ${selectedMethod}` : "Choose payment gateway"}
              </p>
            </div>
          </div>
          {openSection === "payment" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {openSection === "payment" && (
          <div className="p-5 pt-0 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {[
                { id: "Credit Card", label: "Credit Card", icon: CreditCard },
                { id: "Debit Card", label: "Debit Card", icon: CreditCard },
                { id: "Net Banking", label: "Net Banking", icon: Landmark },
                { id: "cod", label: "Cash on Delivery", icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <label
                    key={m.id}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      checked={isSelected}
                      onChange={() => handleSelectPayment(m.id)}
                      className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <Icon className={`w-5 h-5 ${isSelected ? "text-indigo-600" : "text-slate-500"}`} />
                    <span className="text-sm font-semibold text-slate-800">
                      {m.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Accordion;
