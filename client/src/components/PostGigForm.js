import React, { useState } from 'react';
import axios from 'axios';

const PostGigForm = () => {
  const [gig, setGig] = useState({ title: '', description: '', requiredSkills: '', location: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setGig({ ...gig, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/gigs', {
        ...gig,
        requiredSkills: gig.requiredSkills.split(',').map(s => s.trim())
      });
      setMsg('✅ Gig posted successfully!');
      setGig({ title: '', description: '', requiredSkills: '', location: '' });
    } catch (err) {
      setMsg('❌ Error posting gig');
    }
  };

  return (
    <div className="mb-6 bg-white/20 p-4 rounded text-white">
      <h3 className="text-lg font-semibold mb-2">📤 Post a New Gig</h3>
      <input name="title" placeholder="Title" className="border p-2 w-full mb-2 text-black" value={gig.title} onChange={handleChange} />
      <textarea name="description" placeholder="Description" className="border p-2 w-full mb-2 text-black" value={gig.description} onChange={handleChange} />
      <input name="requiredSkills" placeholder="Skills (comma-separated)" className="border p-2 w-full mb-2 text-black" value={gig.requiredSkills} onChange={handleChange} />
      <input name="location" placeholder="Location" className="border p-2 w-full mb-2 text-black" value={gig.location} onChange={handleChange} />
      <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded">Post</button>
      {msg && <p className="text-sm mt-2">{msg}</p>}
    </div>
  );
};

export default PostGigForm;