import "./Login.css"
import user_icon from "../assets/person.png"
import email_icon from "../assets/email.png"
import pass_icon from "../assets/password.png"
import phone_icon from "../assets/telephone.png"
import addr_icon from "../assets/locations.png"
import { useState } from "react"

function LoginPage() {

    const [action, setAction] = useState("Login");

    return (
        <>
            <div className="container">
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {action === "Login"
                        ? <>
                            <table>
                                <tr>
                                    <td>
                                        <div className="input input-big">
                                            <img src={email_icon} alt="" />
                                            <input type="email" placeholder="Email" />
                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="input input-big">
                                            <img src={pass_icon} alt="" />
                                            <input type="password" placeholder="Password" />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div className="forgot-password">Forgot Password? <span>Click Here!</span></div>
                        </>
                        : <>
                            <table>
                                <tr>
                                    <td>
                                        <div className="input input-small">
                                            <img src={user_icon} alt="" />
                                            <input type="text" placeholder="First Name" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input input-small">
                                            <img src={user_icon} alt="" />
                                            <input type="text" placeholder="Last Name" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="input input-small">
                                            <img src={phone_icon} alt="" width="24px" />
                                            <input type="phone" placeholder="Phone Number" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input input-small">
                                            <img src={email_icon} alt="" />
                                            <input type="email" placeholder="Email" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <div className="input input-big">
                                        <img src={addr_icon} alt="" width="26px" />
                                        <input type="text" placeholder="Address Line 1" />
                                    </div>
                                </tr>
                                <tr>
                                    <div className="input input-big">
                                        <img src={addr_icon} alt="" width="26px" />
                                        <input type="text" placeholder="Address Line 2" />
                                    </div>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="input input-small">
                                            <img src={addr_icon} alt="" width="26px" />
                                            <input type="text" placeholder="District" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input input-small">
                                            <img src={addr_icon} alt="" width="26px" />
                                            <select name="state" required>
                                                <option value="" selected>State</option>
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
                                            <input type="text" placeholder="Police Station" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input input-small">
                                            <img src={addr_icon} alt="" width="26px" />
                                            <input type="number" placeholder="Pincode" />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="input input-small">
                                            <img src={pass_icon} alt="" />
                                            <input type="password" placeholder="Create Password" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="input input-small">
                                            <img src={pass_icon} alt="" />
                                            <input type="password" placeholder="Confirm Password" />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </>}
                </div>
                <div className="submit-container">
                    <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
                    <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;