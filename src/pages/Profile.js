import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="container">
      <h2>Profile</h2>
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login.</p>
      )}
    </div>
  );
}

export default Profile;
