import React, { useEffect, useState } from "react";
import axios from "axios";

const RecruiterPanel = () => {
  const [gigs, setGigs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    requiredSkills: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGig, setSelectedGig] = useState(null);
  const gigsPerPage = 4;

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/gigs");
      setGigs(res.data.reverse());
    } catch (err) {
      console.error("❌ Failed to fetch gigs", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePostGig = async (e) => {
    e.preventDefault(); // ✅ prevent page reload

    try {
      const payload = {
        ...form,
        requiredSkills: form.requiredSkills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      const res = await axios.post("http://localhost:5000/api/gigs/create", payload);

      if (res.status === 201) {
        setForm({
          title: "",
          description: "",
          location: "",
          requiredSkills: "",
        });
        fetchGigs(); // ✅ reload gig list
        alert("✅ Gig posted successfully!");
      }
    } catch (err) {
      console.error("❌ Error posting gig:", err);
      alert("❌ Failed to post gig");
    }
  };

  const handleToggleApplicants = (gigId) => {
    setSelectedGig((prev) => (prev === gigId ? null : gigId));
  };

  const indexOfLast = currentPage * gigsPerPage;
  const indexOfFirst = indexOfLast - gigsPerPage;
  const currentGigs = gigs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(gigs.length / gigsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-blue-100 p-6">
      {/* Post a Gig Section */}
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-black">
        <h2 className="text-2xl font-semibold mb-4">📤 Post a New Gig</h2>
        <form onSubmit={handlePostGig} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-white text-black"
            required
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-white text-black"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-white text-black"
            required
          />
          <input
            type="text"
            name="requiredSkills"
            placeholder="Required Skills (comma separated)"
            value={form.requiredSkills}
            onChange={handleChange}
            className="w-full p-2 rounded border bg-white text-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Post Gig
          </button>
        </form>
      </div>

      {/* Posted Gigs Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🧾 Your Posted Gigs</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentGigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white/40 backdrop-blur-md rounded-lg shadow-md p-4 text-black"
            >
              <h4 className="text-lg font-bold">{gig.title}</h4>
              <p>{gig.description}</p>
              <p><strong>Location:</strong> {gig.location}</p>
              <p><strong>Skills:</strong> {gig.requiredSkills.join(", ")}</p>

              <button
                onClick={() => handleToggleApplicants(gig._id)}
                className="mt-3 text-blue-600 underline"
              >
                {selectedGig === gig._id ? "Hide Applicants" : "View Applicants"}
              </button>

              {selectedGig === gig._id && (
                <div className="mt-3 bg-white p-3 rounded shadow-inner">
                  {Array.isArray(gig.applicants) && gig.applicants.length > 0 ? (
                    <ul className="space-y-2">
                      {gig.applicants.map((app, idx) => (
                        <li key={idx} className="border p-3 rounded bg-white/80 mb-2">
                          <p><strong>Name:</strong> {app.name}</p>
                          <p><strong>Phone:</strong> {app.phone}</p>
                          <p><strong>Message:</strong> {app.message || "—"}</p>
                          <p>
                            <strong>Resume:</strong>{" "}
                            <a
                              href={
                                app.resume?.startsWith("http")
                                  ? app.resume
                                  : `https://${app.resume}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-700 hover:underline"
                            >
                              View / Download
                            </a>
                          </p>
                          <p><strong>Skills:</strong> {Array.isArray(app.skills) ? app.skills.join(", ") : "—"}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No applicants yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterPanel;