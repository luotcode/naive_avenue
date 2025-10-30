import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RedirectMobile({ minWidth = 1024 }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = () => {
      const isMobile = window.innerWidth < minWidth;
      if (isMobile && location.pathname !== "/mobile") {
        navigate("/mobile", { replace: true });
      } else if (!isMobile && location.pathname === "/mobile") {
        navigate("/", { replace: true });
      }
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [location, navigate, minWidth]);

  return null;
}
