import React, { useEffect, useState } from "react";
import axios from "axios";

const WorkerPanel = () => {
  const [gigs, setGigs] = useState([]);
  const [filters, setFilters] = useState({ title: "", skill: "", location: "" });
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGigId, setSelectedGigId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    resume: "",
    message: "",
    skills: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await axios.get('https://workerbuild-backend.onrender.com/api/gigs');
      setGigs(res.data.reverse());
      setFilteredGigs(res.data.reverse());
    } catch (err) {
      console.error("Error fetching gigs:", err);
    }
  };

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = () => {
    const filtered = gigs.filter(
      (gig) =>
        gig.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        gig.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        gig.requiredSkills.join(",").toLowerCase().includes(filters.skill.toLowerCase())
    );
    setFilteredGigs(filtered);
  };

  const openApplyModal = (gigId) => {
    setSelectedGigId(gigId);
    setShowModal(true);
    setStatus("");
    setForm({ name: "", phone: "", resume: "", skills: "", message: "" });
  };

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleApply = async () => {
    if (!form.name || !form.phone || !form.resume) {
      setStatus("❗ Please fill required fields.");
      return;
    }

    try {
      const res = await axios.post(
        `https://workerbuild-backend.onrender.com/api/gigs/${selectedGigId}/apply`,
        {
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()),
        }
      );
      setStatus("✅ Application submitted!");
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      console.error("Apply error:", err?.response?.data || err.message);
      setStatus("❌ Error applying.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 p-6 text-black">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="bg-white rounded-lg shadow p-4 md:col-span-1">
          <h3 className="text-xl font-semibold mb-4">🔍 Filters</h3>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={filters.title}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
          />
          <input
            type="text"
            name="skill"
            placeholder="Skill"
            value={filters.skill}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
            className="w-full p-2 mb-3 border rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Gig Listings */}
        <div className="md:col-span-3 space-y-4">
          {filteredGigs.length === 0 ? (
            <p>No gigs found.</p>
          ) : (
            filteredGigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{gig.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{gig.description}</p>
                    <p className="mt-2 text-sm text-gray-700">
                      📍 {gig.location} | 🛠 {gig.requiredSkills.join(", ")}
                    </p>
                  </div>
                  <button
                    onClick={() => openApplyModal(gig._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Apply Modal with pop animation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="animate-pop bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform scale-95 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4">Apply for Gig</h3>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleFormChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleFormChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              name="resume"
              placeholder="Resume Link"
              value={form.resume}
              onChange={handleFormChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={handleFormChange}
              className="w-full p-2 mb-3 border rounded"
            />
            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleFormChange}
              className="w-full p-2 mb-3 border rounded"
            ></textarea>

            {status && <p className="text-sm mb-2 text-blue-700">{status}</p>}

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerPanel;