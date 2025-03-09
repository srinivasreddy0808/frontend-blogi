import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <header className={styles.header}>
      <span className={styles.icon}> Blogi </span>
      <button className={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Header;
