import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('https://workerbuild-backend.onrender.com')
      .then(res => {
        setGigs(res.data);
        setFilteredGigs(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = gigs.filter(
      gig =>
        gig.title.toLowerCase().includes(query) ||
        gig.requiredSkills.join(',').toLowerCase().includes(query)
    );
    setFilteredGigs(filtered);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Available Gigs</h2>

      {/* Search Bar */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by title or skill"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-white/30 bg-transparent text-white rounded placeholder-white/70"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {filteredGigs.length === 0 ? (
        <p className="text-white/70">No gigs found.</p>
      ) : (
        filteredGigs.map((gig) => (
          <div key={gig._id} className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10 text-white">
            <h3 className="text-lg font-bold">{gig.title}</h3>
            <p className="text-sm text-gray-200">{gig.description}</p>
            <p><strong>Skills:</strong> {gig.requiredSkills.join(', ')}</p>
            <p><strong>Location:</strong> {gig.location}</p>
            <ApplyForm gigId={gig._id} />
          </div>
        ))
      )}
    </div>
  );
};

const ApplyForm = ({ gigId }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    resume: "",
    message: "",
    skills: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApply = async () => {
    const { name, phone, resume, message, skills } = form;

    if (!name || !phone || !resume) {
      alert("Please fill all required fields.");
      return;
    }

    // Ensure resume starts with https:// or http://
    const resumeLink = resume.startsWith("http") ? resume : `https://${resume}`;

    try {
      await axios.post(`http://localhost:5000/api/gigs/${gigId}/apply`, {
        name: name.trim(),
        phone,
        resume: resumeLink,
        message,
        skills: skills.split(",").map((s) => s.trim())
      });

      setStatus("✅ Successfully applied!");
    } catch (err) {
      if (err.response?.data?.message === "Already applied") {
        setStatus("⚠ You already applied.");
      } else {
        setStatus("❌ Error applying.");
      }
    }
  };

  return (
    <div className="mt-2 space-y-2">
      <input
        type="text"
        name="name"
        placeholder="Your name"
        className="border px-2 py-1 w-full rounded"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone number"
        className="border px-2 py-1 w-full rounded"
        value={form.phone}
        onChange={handleChange}
      />
      <input
        type="text"
        name="resume"
        placeholder="Resume Link (Google Drive / Dropbox)"
        className="border px-2 py-1 w-full rounded"
        value={form.resume}
        onChange={handleChange}
      />
      <textarea
        name="message"
        placeholder="Message (optional)"
        className="border px-2 py-1 w-full rounded"
        value={form.message}
        onChange={handleChange}
      />
      <input
        type="text"
        name="skills"
        placeholder="Skills (comma separated)"
        className="border px-2 py-1 w-full rounded"
        value={form.skills}
        onChange={handleChange}
      />
      <button
        onClick={handleApply}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
      >
        Apply
      </button>
      {status && <p className="text-sm text-blue-600">{status}</p>}
    </div>
  );
};

export default GigList;