import "./Dashboard.css"
import user_icon from "../assets/user.png"
import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
import useBodyClass from "./useBodyClass";
import { apiFetch } from "../api/auth_api";
import { ref, onValue } from "firebase/database";
import { db } from "../api/firebase";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

type StatusDataType = {
    latitude: number;
    longitude: number;
    speed: number;
    heartRate: number;
    panic: boolean;
    battery: number;
    timestamp: number;
}

type UserDataType = {
    id: number,
    first_name: string,
    last_name: string,
    phone: string,
    email: string,
    address: string,
    district: string,
    state: string,
    police_station: string,
    pincode: string,
    signup_date: string,
    bio: string,
    dob: string,
    blood_group: string,
    medical_notes: string,
    photo_url: string,
    preferred_language: string,
    profile_completed: boolean,
    last_updated: string,
    emergency_contacts: Array<string>
}

// const socket = io(`http://${window.location.hostname}:5000`, {
//     path: "/socket.io",
//     transports: ["websocket"],
//     auth: {
//         token: localStorage.getItem("token"),
//     }
// })

let vibrationInterval: number | null = null

function startDangerVibration() {
    if (!("vibrate" in navigator)) return

    if (vibrationInterval) return // already running

    vibrationInterval = window.setInterval(() => {
        navigator.vibrate([500, 300, 500]) // vibrate-pause-vibrate
    }, 1300)
}

function stopDangerVibration() {
    if (vibrationInterval) {
        clearInterval(vibrationInterval)
        vibrationInterval = null
        navigator.vibrate(0) // stop immediately
    }
}

function playAlert(alertAudioRef: React.RefObject<HTMLAudioElement | null>) {
    startDangerVibration()
    alertAudioRef.current!
        .play()
        .catch(err => console.log("Audio blocked:", err));
}

function pauseAlert(alertAudioRef: React.RefObject<HTMLAudioElement | null>) {
    stopDangerVibration()
    alertAudioRef.current?.pause()
    alertAudioRef.current!.currentTime = 0
}

// --- Map Component to dynamically recenter marker ---
interface LiveMapProps {
    lat: number;
    lng: number;
}

function RecenterMarker({ lat, lng }: LiveMapProps) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
}

function LiveMap({ lat, lng }: LiveMapProps) {
    return (
        <MapContainer center={[lat, lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={[lat, lng]} />
            <RecenterMarker lat={lat} lng={lng} />
        </MapContainer>
    );
}

function DashboardPage() {
    useBodyClass("body-dashboard");

    const [statusData, setStatusData] = useState<StatusDataType | null>(null);
    const alertAudioRef = useRef<HTMLAudioElement | null>(null);
    const [soundEnable, setSoundEnable] = useState(false);
    const [enblBtnText, setEnblBtnText] = useState("Enable");

    const [userData, setUserData] = useState<UserDataType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const response = await apiFetch("/dashboard", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to load dashboard");
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                window.location.href = "/login";
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, []);

    // useEffect(() => {
    //     socket.on("connect", () => {
    //         console.log("Connected", socket.id)
    //     })
    //     socket.on("status_data", (data: StatusDataType) => {
    //         setStatusData(data);
    //     })
    //     if (import.meta.env.DEV) {
    //         socket.onAny((event, data) => {
    //             console.log("EVENT:", event, data)
    //         })
    //     }
    //     return () => {
    //         socket.off("status_data");
    //     }
    // }, [])

    useEffect(() => {
        alertAudioRef.current = new Audio("/alert.mp3");
        alertAudioRef.current.loop = true;
        alertAudioRef.current.volume = 0.9;

        return () => {
            pauseAlert(alertAudioRef);
        };
    }, []);

    useEffect(() => {
        if (!soundEnable) {
            if (alertAudioRef.current != null) pauseAlert(alertAudioRef);
            return;
        }

        if (statusData?.panic) {
            playAlert(alertAudioRef);
        } else {
            pauseAlert(alertAudioRef);
        }
    }, [statusData?.panic, soundEnable]);
    const isDanger = statusData?.panic

    useEffect(() => {
        if (!userData) return;

        const userId = String(userData.id)
        if (!userId) return;

        const statusRef = ref(
            db,
            `real-time-data/users/${userId}/device/latest`
        );

        const unsubscribe = onValue(statusRef, (snapshot) => {
            if (snapshot.exists()) {
                setStatusData(snapshot.val());
            }
        });

        return () => unsubscribe();
    }, [userData]);


    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }
    console.log(userData)
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="">PTAS&nbsp;&nbsp;&nbsp;&nbsp;<span className="longer-heading">(Precise Tracking & Alert System)</span></a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item user-logo">
                                <a className="nav-link" aria-current="page" href="/profile">
                                    <span>
                                        <img src={userData?.photo_url === "" ? user_icon : userData?.photo_url} alt="user" />
                                        {userData?.first_name}
                                    </span>
                                </a>
                            </li>
                            <li className="nav-item">
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/feed/features">Features</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/feed/faqs">FAQs</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/feed/about">About Us</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login" onClick={()=>{localStorage.clear()}}>Log Out</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <button className="btn active enable-btn"
                onClick={() => {
                    const audio = new Audio("/alert.mp3")
                    audio.play().then(() => {
                        audio.pause()
                        audio.currentTime = 0
                    })
                    if (soundEnable) {
                        setSoundEnable(false);
                        setEnblBtnText("Enable");
                    }
                    else {
                        setSoundEnable(true);
                        setEnblBtnText("Disable");

                    }
                }}
            >
                {enblBtnText} Alert Sound
            </button >
            <div className="container-fluid"><br />
                <h2 className={`text-center red-alert ${isDanger ? "danger" : ""}`}>
                    PRAYUKTI
                </h2>
                {isDanger ? <div className="danger-banner">🚨 RED ALERT — USER IN DANGER 🚨</div>
                    : <h5 className="text-center">A PIONEERING APPROACH OF ENSURING WOMEN'S SAFETY</h5>
                }
                <br />

                <div className="dashboard">
                    <div id="map-container">
                        {statusData && <LiveMap lat={statusData.latitude} lng={statusData.longitude} />}
                        {/* <iframe
                            src={`https://www.google.com/maps?q=${statusData?.latitude},${statusData?.longitude}&z=15&output=embed`}
                            width="100%"
                            height="100%"
                            loading="lazy">
                        </iframe> */}
                    </div>
                    <div id="status-panel">
                        {statusData && (
                            <table>
                                <tbody>
                                    <tr>
                                        <td><strong>Status:</strong></td>
                                        <td>{statusData.panic ? "DANGER" : "SAFE"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Heart Rate:</strong></td>
                                        <td>{statusData.heartRate} bpm</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Movement Speed:</strong></td>
                                        <td>{statusData.speed} kmph</td>
                                    </tr><hr />
                                    <tr>
                                        <td><strong>Latitude:</strong></td>
                                        <td>{statusData.latitude}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Longitude:</strong></td>
                                        <td>{statusData.longitude}</td>
                                    </tr><hr />
                                    <tr>
                                        <td><strong>Device Paired:</strong></td>
                                        <td>{Date.now() / 1000 - statusData.timestamp < 10 ? "Yes" : "No"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Connected To Server:</strong></td>
                                        <td>Yes</td>
                                    </tr><hr />
                                    <tr>
                                        <td><strong>Battery:</strong></td>
                                        <td>{statusData.battery}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            <footer className="site-footer">
                <div className="row">
                    <div className="col-lg-4 mb-3">
                        <a className="d-inline-flex align-items-center mb-2 text-body-emphasis text-decoration-none" href="/" aria-label="Bootstrap">
                            <img src="../static/Personal/Images/display/logo.png" width="30px" />
                            <span className="fs-5">Prayukti</span>
                        </a>
                        <ul className="list-unstyled small">
                            <li className="mb-2">Designed and built with all the love in the world by the <a href="/feed/about">Team Prayukti</a>.</li>
                            <li className="mb-2"></li>
                            <li className="mb-2">© Currently v1.0.0</li>
                        </ul>

                    </div>
                    <div className="col-6 col-lg-4 offset-lg-1 mb-2">
                        <h5>Links</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a className="style-a" href="/">Home</a></li>
                            <li className="mb-2"><a className="style-a" href="/feed/faq">FAQs</a></li>
                            <li className="mb-2"><a className="style-a" href="/feed/features">Features</a></li>
                            <li className="mb-2"><a className="style-a" href="/feed/about">About Us</a></li>
                            <li className="mb-2"><a className="style-a" href="/feed/how">How to use</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-lg-3 mb-2">
                        <h5>Creators</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a className="style-a" href="/feed/creators#c1">Sauhardya</a></li>
                            <li className="mb-2"><a className="style-a" href="/feed/creators#c2">Sugata</a></li>
                            <li className="mb-2"><a className="style-a" href="/feed/creators#c3">Debarghya</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-4">
                        <ul className="list-unstyled small" id="follow-apps">
                            <a href="https://facebook.com" target="_blank"><img src="../static/Personal/Images/follow/facebook.png" width="30px" /></a>
                            <a href="https://quora.com" target="_blank"><img src="../static/Personal/Images/follow/quora.png" width="34px" /></a>
                            <a href="https://instagram.com" target="_blank"><img src="../static/Personal/Images/follow/instagram.png" width="31px" /></a>
                            <a href="https://youtube.com" target="_blank"><img src="../static/Personal/Images/follow/youtube.png" width="31px" /></a>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default DashboardPage;