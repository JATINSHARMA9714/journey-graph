// Tab for creating/editing journey basic information

import React, { useState, useEffect } from 'react';
import { useJourney } from '../../context/JourneyContext';

export default function CreateJourneyTab() {
  const { journey, updateJourneyInfo } = useJourney();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Load current journey data when component mounts
  useEffect(() => {
    setName(journey.name);
    setDescription(journey.description);
  }, [journey]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!name.trim()) {
      setError('Journey name is required');
      return;
    }

    if (name.trim().length < 3) {
      setError('Journey name must be at least 3 characters');
      return;
    }

    // Update journey info
    updateJourneyInfo(name.trim(), description.trim());
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Journey Information</h2>
      
      {/* Show error if any */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Journey Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Journey Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter journey name"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            {name.length}/100 characters
          </p>
        </div>

        {/* Journey Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe what this journey does..."
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {description.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Journey Info
        </button>
      </form>

      {/* Show current journey info if saved */}
      {journey.name && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="text-green-800 font-medium mb-2">Journey Information Saved!</h3>
          <div className="text-green-700 text-sm space-y-1">
            <p><strong>Name:</strong> {journey.name}</p>
            {journey.description && (
              <p><strong>Description:</strong> {journey.description}</p>
            )}
            <p><strong>Status:</strong> {journey.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>1. Go to Properties tab to define data fields</p>
          <p>2. Create Nodes to represent journey steps</p>
          <p>3. Add Functions for API calls and processing</p>
          <p>4. Map Functions to Nodes</p>
          <p>5. Connect Nodes with Edges</p>
          <p>6. Preview your complete journey</p>
        </div>
      </div>
    </div>
  );
}