import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const suggestedTopics = ["React", "Node.js", "MongoDB", "HTML", "CSS", "Python", "SQL"];

const LearningHub = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/youtube/search?q=${encodeURIComponent(searchQuery)}`
      );
      setVideos(res.data.items);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      fetchVideos(query.trim());
    }
  };

  const handleSuggestionClick = (topic) => {
    setQuery(topic);
    fetchVideos(topic);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">📚 Learn New Skills</h2>

      {/* Back to Gigs Button */}
      <Link
        to="/dashboard"
        className="inline-block mb-4 text-blue-700 underline hover:text-blue-900 font-semibold"
      >
        🏠 Back to Gigs
      </Link>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search any skill e.g. React, GraphQL, APIs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 border border-gray-400 rounded text-black"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Suggestions */}
      <div className="mb-4">
        <p className="font-semibold mb-2">✨ Suggested Topics:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleSuggestionClick(topic)}
              className="bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded hover:bg-blue-100"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Videos */}
      {loading ? (
        <p className="text-gray-700">Loading tutorials...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {videos.map((video) => (
            <a
              key={video.id.videoId}
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-3 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full rounded"
              />
              <p className="mt-2 font-medium text-sm">
                {video.snippet.title.slice(0, 60)}...
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningHub;