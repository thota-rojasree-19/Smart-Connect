import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GroupChats.css";

export default function GroupChats() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [groupPic, setGroupPic] = useState(null);
  const [preview, setPreview] = useState(null);
  const me = sessionStorage.getItem("email");

  useEffect(() => {
    async function fetchFriends() {
<<<<<<< HEAD
      const res = await fetch(`https://smart-connect-backend-eu0p.onrender.com/api/user/current?email=${me}`);
=======
      const res = await fetch(`http://localhost:5000/api/user/current?email=${me}`);
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
      const data = await res.json();
      // data.friends contains objects with email,name
      setFriends(data.friends || []);
    }
    if (me) fetchFriends();
  }, [me]);

  const toggle = (email) => {
    setSelected(prev => prev.includes(email) ? prev.filter(e => e!==email) : [...prev, email]);
  };

  const createGroup = async () => {
    if (selected.length < 1 || selected.length > 5) {
      return alert("Select between 1 and 5 friends to create a group.");
    }
    if (!name.trim()) return alert("Group name required");
    // If groupPic is set, read as base64 and include in payload as `image`
    let imageBase64 = null;
    if (groupPic) {
      // groupPic is a File
      imageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(groupPic);
      });
    }

<<<<<<< HEAD
    const res = await fetch("https://smart-connect-backend-eu0p.onrender.com/api/groups/create", {
=======
    const res = await fetch("http://localhost:5000/api/groups/create", {
>>>>>>> 32152e9e6930315a4cf111cae252faf2df3a9203
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ name, adminEmail: me, memberEmails: selected, image: imageBase64 })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Failed");
    // navigate to group chat page
    navigate(`/group/${data.group._id}`);
  };

  const onPicChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return setGroupPic(null);
    setGroupPic(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  return (
    <div className="group-chats-container">
      <div className="group-chats-header">
        <button 
          className="back-btn" 
          onClick={() => navigate("/dashboard")}
          title="Back to Dashboard"
        >
          ←
        </button>
        <h1>Create Group Chat</h1>
      </div>

      <div className="create-group-card">
        <h2>New Group</h2>
        
        <div className="form-group">
          <label>Group Name</label>
          <input 
            type="text"
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Enter group name..."
          />
        </div>

        <div className="form-group">
          <label>Group Photo (optional)</label>
          <input type="file" accept="image/*" onChange={onPicChange} />
          {preview && <div style={{marginTop:10}}><img src={preview} alt="preview" style={{width:80,height:80,objectFit:'cover',borderRadius:8}}/></div>}
        </div>

        <div className="friends-section">
          <p>Select Members (1-5 friends)</p>
          <ul className="friends-list">
            {friends.map(f => (
              <li key={f.email}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={selected.includes(f.email)} 
                    onChange={() => toggle(f.email)} 
                  />
                  {f.name || f.email}
                </label>
              </li>
            ))}
          </ul>
          {friends.length === 0 && (
            <p style={{ textAlign: "center", color: "#999", margin: "20px 0" }}>
              No friends available. Add friends first!
            </p>
          )}
          <div className="friends-counter">
            Selected: {selected.length}/5
          </div>
        </div>

        <button 
          className="create-btn" 
          onClick={createGroup}
          disabled={selected.length === 0 || !name.trim()}
        >
          ✓ Create Group
        </button>
      </div>
    </div>
  );
}