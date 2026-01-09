import "./Profile.css"
import { useEffect, useState } from "react";
import { apiFetch } from "../api/auth_api";
import useBodyClass from "./useBodyClass";

type ProfileFormType = {
    bio: string;
    dob: string;
    blood_group: string;
    medical_notes: string;
    preferred_language: string;
    photo_url: string;
    emergency_contacts: string[];
};

function ProfilePage() {
    useBodyClass("body-profile");

    const [form, setForm] = useState<ProfileFormType>({
        bio: "",
        dob: "",
        blood_group: "",
        medical_notes: "",
        preferred_language: "",
        photo_url: "",
        emergency_contacts: [""],
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    /* ---------------- LOAD EXISTING PROFILE ---------------- */
    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await apiFetch("/profile", { method: "GET" });
                if (!res.ok) return;

                const data = await res.json();
                setForm({
                    bio: data.bio || "",
                    dob: data.dob ? data.dob.split("T")[0] : "",
                    blood_group: data.blood_group || "",
                    medical_notes: data.medical_notes || "",
                    preferred_language: data.preferred_language || "",
                    photo_url: data.photo_url || "",
                    emergency_contacts: data.emergency_contacts?.length
                        ? data.emergency_contacts
                        : [""],
                });
            } catch (err) {
                window.location.href = "/login";
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    /* ---------------- HANDLERS ---------------- */
    const updateField = (key: keyof ProfileFormType, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const updateContact = (index: number, value: string) => {
        const contacts = [...form.emergency_contacts];
        contacts[index] = value;
        updateField("emergency_contacts", contacts);
    };

    const addContact = () => {
        updateField("emergency_contacts", [...form.emergency_contacts, ""]);
    };

    const removeContact = (index: number) => {
        const contacts = form.emergency_contacts.filter((_, i) => i !== index);
        updateField("emergency_contacts", contacts.length ? contacts : [""]);
    };

    /* ---------------- SUBMIT ---------------- */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const res = await apiFetch("/profile", {
                method: "POST",
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");

            setMessage("✅ Profile updated successfully");
            alert("Profile updated successfully");
            window.location.href = "/dashboard"
        } catch (err: any) {
            setMessage("❌ " + err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <h3>Loading profile…</h3>;

    /* ---------------- UI ---------------- */
    return (
        <div className="container profile-page">
            <h2>User Profile</h2>

            <form onSubmit={handleSubmit}>
                <table className="profile-table">
                    <tbody>

                        <tr>
                            <td><label>Bio</label></td>
                            <td>
                                <textarea
                                    value={form.bio}
                                    onChange={e => updateField("bio", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td><label>Date of Birth</label></td>
                            <td>
                                <input
                                    type="date"
                                    value={form.dob || ""}
                                    onChange={e => updateField("dob", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td><label>Blood Group</label></td>
                            <td>
                                <select
                                    value={form.blood_group}
                                    onChange={e => updateField("blood_group", e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <td><label>Medical Notes</label></td>
                            <td>
                                <textarea
                                    value={form.medical_notes}
                                    onChange={e => updateField("medical_notes", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td><label>Preferred Language</label></td>
                            <td>
                                <input
                                    value={form.preferred_language}
                                    onChange={e => updateField("preferred_language", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td><label>Profile Photo URL</label></td>
                            <td>
                                <input
                                    value={form.photo_url}
                                    onChange={e => updateField("photo_url", e.target.value)}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td><label>Emergency Contacts</label></td>
                            <td>
                                {form.emergency_contacts.map((phone, i) => (
                                    <div key={i} className="contact-row">
                                        <input
                                            value={phone}
                                            onChange={e => updateContact(i, e.target.value)}
                                            placeholder="+91XXXXXXXXXX"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeContact(i)}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="add-contact"
                                    onClick={addContact}
                                >
                                    + Add Contact
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td></td>
                            <td>
                                <button disabled={saving} type="submit">
                                    {saving ? "Saving…" : "Save Profile"}
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>

                {message && <p className="profile-message">{message}</p>}
            </form>
        </div>

    );
}

export default ProfilePage;