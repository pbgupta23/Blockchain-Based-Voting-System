import React, { useContext } from "react";
import { RouteProps } from "react-router";
import { AuthContext } from "../../contexts/Auth";

const Profile = (props: RouteProps) => {
  const authContext = useContext(AuthContext);

  console.log({ authContext });

  return (
    <div className="profile-wrapper">
      <div className="left-panel">
        <div className="person-icon">
          <i className="bi bi-person-circle"></i>
        </div>
        
        <div className="right-panel">
        <span className="profile">Profile</span>
        <div className="userdata">Name : {authContext.name}</div>
        <div className="userdata">Email : {authContext.email}</div>
        <div className="userdata">ID : {authContext.citizenshipNumber}</div>

      </div>
       
        <button onClick={authContext.logout} className="button-primary">
          Logout
        </button>
      </div>

      
    </div>
  );
};

export default Profile;
