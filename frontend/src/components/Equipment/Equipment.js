import React, { useEffect, useState } from "react";
import styles from "./equipment.module.css";
import { useLocation, useParams } from "react-router-dom";
import { getEquipmentBySportId } from "../../API/apiService";

function Equipment() {
  const { id } = useParams(); // Sport ID from route
  const location = useLocation();
  const sportName = location.state?.sportName || "Equipment List";
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const equipmentData = await getEquipmentBySportId(id);
        setEquipments(equipmentData.equipment); // Assuming the API returns an object with 'equipment' key
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };

    fetchEquipment();
  }, [id]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold">{sportName}</h2>
      <hr />
      {equipments.length > 0 ? (
        <div className="row">
          {equipments.map((equipment) => (
            <div className="col-md-4 col-lg-3 mb-4" key={equipment._id}>
              <div className={`card ${styles.EachCard} shadow`}>
                <img
                  src={equipment.equipment_image[0]}
                  alt={equipment.name}
                  className={`card-img-top ${styles.imgHeight}`}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{equipment.name}</h5>
                  <p className="card-text text-muted">
                    {equipment.description.length > 60
                      ? `${equipment.description.substring(0, 40)}...`
                      : equipment.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <h4>No equipment found for this sport.</h4>
        </div>
      )}
    </div>
  );
}

export default Equipment;
