import "./Login.css"
import user_icon from "../assets/person.png"
import email_icon from "../assets/email.png"
import pass_icon from "../assets/password.png"
import phone_icon from "../assets/telephone.png"
import addr_icon from "../assets/locations.png"
import { useState, useEffect, type FormEvent } from "react"
import useBodyClass from "./useBodyClass"
import { apiFetch } from "../api/auth_api"

function LoginPage() {
    useBodyClass("body-login")

    const [action, setAction] = useState("Login");
    const [formData, setFormData] = useState({
        type: "",
        login_email: "",
        login_password: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address_line_1: "",
        address_line_2: "",
        district: "",
        state: "",
        police_station: "",
        pincode: "",
        password_1: "",
        password_2: ""
    });

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await apiFetch("/auth/check", {
                    method: "GET",
                });

                if (res.ok) {
                    window.location.href = "/dashboard";
                }
            } catch {
                console.warn("Invalid User Token");
            }
        }

        checkAuth();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://${window.location.hostname}:5000/get/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                if (result.type == "S") {
                    alert("Successfully Signed Up! Now Login to your profile!");
                    formData.type = "L";
                    formData.login_email = formData.email;
                } else {
                    localStorage.setItem("token", result.token);
                    window.location.href = "/dashboard";
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert("Server error. Try again later.");
        }
    }

    formData.type = (action === "Login") ? "L" : "S";

    return (
        <>
            <div className="container">
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="inputs">
                        {action === "Login"
                            ? <>
                                <table>
                                    <tr>
                                        <td>
                                            <div className="input input-big">
                                                <img src={email_icon} alt="" />
                                                <input type="email" placeholder="Email" name="login_email" value={formData.login_email} onChange={handleChange} required />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="input input-big">
                                                <img src={pass_icon} alt="" />
                                                <input type="password" placeholder="Password" minLength={8} name="login_password" value={formData.login_password} onChange={handleChange} required />
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                <div className="forgot-password">Forgot Password? <span>Click Here!</span></div>
                            </>
                            : <>
                                <table className="signup-table">
                                    <tr>
                                        <td>
                                            <div className="input input-small">
                                                <img src={user_icon} alt="" />
                                                <input type="text" placeholder="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input input-small">
                                                <img src={user_icon} alt="" />
                                                <input type="text" placeholder="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="input input-small">
                                                <img src={phone_icon} alt="" width="24px" />
                                                <input type="phone" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input input-small">
                                                <img src={email_icon} alt="" />
                                                <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="input input-big">
                                                <img src={addr_icon} alt="" width="26px" />
                                                <input type="text" placeholder="Address Line 1" name="address_line_1" value={formData.address_line_1} onChange={handleChange} required />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="input input-big">
                                                <img src={addr_icon} alt="" width="26px" />
                                                <input type="text" placeholder="Address Line 2" name="address_line_2" value={formData.address_line_2} onChange={handleChange} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="input input-small">
                                                <img src={addr_icon} alt="" width="26px" />
                                                <input type="text" placeholder="District" name="district" value={formData.district} onChange={handleChange} required />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input input-small">
                                                <img src={addr_icon} alt="" width="26px" />
                                                <select name="state" value={formData.state} onChange={handleChange} required>
                                                    <option value="">State</option>
                                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                                    <option value="Assam">Assam</option>
                                                    <option value="Bihar">Bihar</option>
                                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                                    <option value="Goa">Goa</option>
                                                    <option value="Gujarat">Gujarat</option>
                                                    <option value="Haryana">Haryana</option>
                                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                                    <option value="Jharkhand">Jharkhand</option>
                                                    <option value="Karnataka">Karnataka</option>
                                                    <option value="Kerala">Kerala</option>
                                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                                    <option value="Maharashtra">Maharashtra</option>
                                                    <option value="Manipur">Manipur</option>
                                                    <option value="Meghalaya">Meghalaya</option>
                                                    <option value="Mizoram">Mizoram</option>
                                                    <option value="Nagaland">Nagaland</option>
                                                    <option value="Odisha">Odisha</option>
                                                    <option value="Punjab">Punjab</option>
                                                    <option value="Rajasthan">Rajasthan</option>
                                                    <option value="Sikkim">Sikkim</option>
                                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                                    <option value="Telangana">Telangana</option>
                                                    <option value="Tripura">Tripura</option>
                                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                                    <option value="Uttarakhand">Uttarakhand</option>
                                                    <option value="West Bengal">West Bengal</option>
                                                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                                    <option value="Chandigarh">Chandigarh</option>
                                                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                                                    <option value="Delhi">Delhi</option>
                                                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                                    <option value="Ladakh">Ladakh</option>
                                                    <option value="Lakshadweep">Lakshadweep</option>
                                                    <option value="Puducherry">Puducherry</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="input input-small">
                                                <img src={addr_icon} alt="" width="26px" />
                                                <input type="text" placeholder="Police Station" name="police_station" value={formData.police_station} onChange={handleChange} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input input-small">
                                                <img src={addr_icon} alt="" width="26px" />
                                                <input type="number" placeholder="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="input input-small">
                                                <img src={pass_icon} alt="" />
                                                <input type="password" placeholder="Create Password" minLength={8} name="password_1" value={formData.password_1} onChange={handleChange} required />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="input input-small">
                                                <img src={pass_icon} alt="" />
                                                <input type="password" placeholder="Confirm Password" name="password_2" value={formData.password_2} onChange={handleChange} required />
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </>}
                    </div>
                    {/* <button type="submit" className="btn btn-secondary submit-btn signup-btn">Submit</button><br /><br /> */}
                    <div className="submit-container">
                        <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}><button className={action === "Login" ? "transparent-bg gray" : "transparent-bg white"} type={action === "Sign Up"?"submit":"button"}>Sign Up</button></div>
                        <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}><button className={action === "Sign Up" ? "transparent-bg gray" : "transparent-bg white"} type={action === "Login"?"submit":"button"}>Login</button></div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default LoginPage;