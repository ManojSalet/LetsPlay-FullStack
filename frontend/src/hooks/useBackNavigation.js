import { useNavigate } from "react-router-dom";

const useBackNavigation = (fallback = "/") => {
  const navigate = useNavigate();

  const goBack = () => {
    // Try to retrieve the last location from localStorage
    const lastLocation = localStorage.getItem('lastLocation');

    // If there's a last location saved, navigate to it; otherwise, use the fallback
    if (lastLocation) {
      navigate(lastLocation, { replace: true });
    } else {
      navigate(fallback, { replace: true });
    }
  };

  return { goBack };
};

export default useBackNavigation;
