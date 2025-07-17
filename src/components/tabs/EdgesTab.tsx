// Tab for managing edges between nodes

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { Edge } from '../../types/journey';
import { isEmpty } from '../../utils/helpers';

export default function EdgesTab() {
  const { journey, addEdge, updateEdge, deleteEdge } = useJourney();
  const [showForm, setShowForm] = useState(false);
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    fromNodeId: '',
    toNodeId: '',
    condition: ''
  });

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      fromNodeId: '',
      toNodeId: '',
      condition: ''
    });
    setShowForm(false);
    setEditingEdge(null);
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (isEmpty(formData.fromNodeId)) {
      setError('Please select a source node');
      return;
    }

    if (isEmpty(formData.toNodeId)) {
      setError('Please select a target node');
      return;
    }

    if (formData.fromNodeId === formData.toNodeId) {
      setError('Source and target nodes cannot be the same');
      return;
    }

    // Save edge
    try {
      if (editingEdge) {
        updateEdge(editingEdge.id, formData);
      } else {
        addEdge(formData);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save edge');
    }
  };

  // Start editing an edge
  const handleEdit = (edge: Edge) => {
    setEditingEdge(edge);
    setFormData({
      fromNodeId: edge.fromNodeId,
      toNodeId: edge.toNodeId,
      condition: edge.condition
    });
    setShowForm(true);
    setError('');
  };

  // Delete an edge
  const handleDelete = (edge: Edge) => {
    const fromNode = getNodeName(edge.fromNodeId);
    const toNode = getNodeName(edge.toNodeId);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the edge from "${fromNode}" to "${toNode}"?`
    );
    
    if (confirmDelete) {
      deleteEdge(edge.id);
    }
  };

  // Get node name by ID
  const getNodeName = (nodeId: string) => {
    const node = journey.nodes.find(n => n.id === nodeId);
    return node ? node.name : 'Unknown Node';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Edges</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Edge
        </button>
      </div>

      {/* Edge Form */}
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            {editingEdge ? 'Edit Edge' : 'Add New Edge'}
          </h3>
          
          {/* Show error if any */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From Node */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Node *
                </label>
                <select
                  value={formData.fromNodeId}
                  onChange={(e) => setFormData({ ...formData, fromNodeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select source node</option>
                  {journey.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name} ({node.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* To Node */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Node *
                </label>
                <select
                  value={formData.toNodeId}
                  onChange={(e) => setFormData({ ...formData, toNodeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select target node</option>
                  {journey.nodes.map((node) => 
                    node.id !== formData.fromNodeId ? (
                      <option key={node.id} value={node.id}>
                        {node.name} ({node.type})
                      </option>
                    ) : null
                  )}
                </select>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition (Optional)
              </label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., user.age >= 18, status === 'approved'"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                {editingEdge ? 'Update' : 'Add'} Edge
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edges List */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium text-gray-900">
            Edges ({journey.edges.length})
          </h3>
        </div>
        
        {journey.edges.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No edges created yet. Click "Add Edge" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {journey.edges.map((edge) => (
              <div key={edge.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {getNodeName(edge.fromNodeId)}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-900">
                          {getNodeName(edge.toNodeId)}
                        </span>
                      </div>
                    </div>
                    {edge.condition && (
                      <div className="text-sm text-gray-600">
                        <strong>Condition:</strong> {edge.condition}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(edge)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit Edge"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(edge)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Edge"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warning Message */}
      {journey.nodes.length < 2 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            You need at least 2 nodes to create edges. Go to the Nodes tab to add more nodes.
          </p>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">About Edges</h4>
        <div className="text-sm text-blue-800">
          <p>Edges connect nodes to define the flow of your journey.</p>
          <p className="mt-1">You can add conditions to control when the flow should move from one node to another.</p>
        </div>
      </div>
    </div>
  );
}