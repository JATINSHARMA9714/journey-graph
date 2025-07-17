// Home page showing list of all journeys

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Trash2, Search } from 'lucide-react';
import { Journey } from '../types/journey';
import { loadJourneys, deleteJourney } from '../utils/storage';
import { formatDate } from '../utils/helpers';

interface HomePageProps {
  onEditJourney: (journey: Journey) => void;
  onPreviewJourney: (journey: Journey) => void;
  onCreateJourney: () => void;
}

export default function HomePage({ onEditJourney, onPreviewJourney, onCreateJourney }: HomePageProps) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load journeys when component mounts
  useEffect(() => {
    loadJourneysFromStorage();
  }, []);

  const loadJourneysFromStorage = () => {
    setLoading(true);
    try {
      const savedJourneys = loadJourneys();
      setJourneys(savedJourneys);
    } catch (error) {
      console.error('Failed to load journeys:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter journeys based on search term
  const filteredJourneys = journeys.filter(journey =>
    journey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journey.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle deleting a journey
  const handleDeleteJourney = (journeyId: string, journeyName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${journeyName}"?`);
    if (confirmDelete) {
      try {
        deleteJourney(journeyId);
        loadJourneysFromStorage(); // Reload the list
      } catch (error) {
        console.error('Failed to delete journey:', error);
        alert('Failed to delete journey. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading journeys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journey Builder</h1>
          <p className="text-gray-600">Create and manage your journey flows</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <button
            onClick={onCreateJourney}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Create New Journey
          </button>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search journeys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
        </div>

        {/* Journey List */}
        {filteredJourneys.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No journeys found' : 'No journeys yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search term'
                : 'Create your first journey to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={onCreateJourney}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Journey
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJourneys.map((journey) => (
              <div key={journey.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                      {journey.name || 'Untitled Journey'}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {journey.description || 'No description'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                    journey.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {journey.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* Journey Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nodes:</span>
                    <span className="ml-2 font-medium">{journey.nodes.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Functions:</span>
                    <span className="ml-2 font-medium">{journey.functions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Edges:</span>
                    <span className="ml-2 font-medium">{journey.edges.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Properties:</span>
                    <span className="ml-2 font-medium">{journey.properties.length}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditJourney(journey)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => onPreviewJourney(journey)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDeleteJourney(journey.id, journey.name)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                    title="Delete Journey"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}