import { useState } from "react";
import axios from "axios";
import "./RegisterForm.css";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://localhost:3000/users",
      {
        username,
        password,
        PhoneNo,
        email,
        address,
      }
    );

    console.log(response.data);

    localStorage.setItem("_id", response.data.user._id);

    alert(response.data.message);

    navigate("/home"); 
  } catch (err) {
    console.log(err);
    alert("Registration Failed");
  }
};

   //useEffect(() => {
    //const userId = localStorage.getItem("_id");
    //if (userId) {
      //console.log("User ID from local storage:", userId);
   // }
  // }, []);   


  return (
    <div className="register-form-container">
      <h1 className="register-form-title">User Information Form</h1>

      <form className="register-form" onSubmit={handleRegister}>

        <div className="register-form-group">
          <label className="register-form-label">Username:</label>
          <input
            className="register-form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="register-form-group">
          <label className="register-form-label">Email:</label>
          <input
            className="register-form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="register-form-group">
          <label className="register-form-label">Phone Number:</label>
          <input
            className="register-form-input"
            type="text"
            value={PhoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          />
        </div>
        <div className="register-form-group">
            <label className="register-form-label">Address:</label>
            <input
                className="register-form-input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />
            </div>

        <div className="register-form-group">
          <label className="register-form-label">Password:</label>
          <input
            className="register-form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="register-form-button" type="submit">
          Submit
        </button>

      </form>
    </div>
  );
}

export default RegisterForm;