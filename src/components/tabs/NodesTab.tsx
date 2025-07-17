// Tab for managing journey nodes

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { Node, NODE_TYPES } from '../../types/journey';
import { isEmpty } from '../../utils/helpers';

export default function NodesTab() {
  const { journey, addNode, updateNode, deleteNode } = useJourney();
  const [showForm, setShowForm] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    properties: [] as string[]
  });

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      properties: []
    });
    setShowForm(false);
    setEditingNode(null);
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (isEmpty(formData.name)) {
      setError('Node name is required');
      return;
    }

    if (isEmpty(formData.type)) {
      setError('Node type is required');
      return;
    }

    // Save node
    try {
      if (editingNode) {
        updateNode(editingNode.id, formData);
      } else {
        addNode(formData);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save node');
    }
  };

  // Start editing a node
  const handleEdit = (node: Node) => {
    setEditingNode(node);
    setFormData({
      name: node.name,
      type: node.type,
      description: node.description,
      properties: [...node.properties]
    });
    setShowForm(true);
    setError('');
  };

  // Delete a node
  const handleDelete = (node: Node) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete node "${node.name}"? This will also remove all edges and mappings connected to it.`
    );
    
    if (confirmDelete) {
      deleteNode(node.id);
    }
  };

  // Handle property selection
  const handlePropertyToggle = (propertyId: string) => {
    setFormData(prev => ({
      ...prev,
      properties: prev.properties.includes(propertyId)
        ? prev.properties.filter(id => id !== propertyId)
        : [...prev.properties, propertyId]
    }));
  };

  // Get property name by ID
  const getPropertyName = (propertyId: string) => {
    const property = journey.properties.find(p => p.id === propertyId);
    return property ? property.key : 'Unknown Property';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Nodes</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Node
        </button>
      </div>

      {/* Node Form */}
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            {editingNode ? 'Edit Node' : 'Add New Node'}
          </h3>
          
          {/* Show error if any */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Node Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Node Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., User Registration"
                />
              </div>

              {/* Node Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Node Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  {NODE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Node Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what this node does..."
              />
            </div>

            {/* Attach Properties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Properties
              </label>
              {journey.properties.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No properties available. Create properties first in the Properties tab.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {journey.properties.map((property) => (
                    <label key={property.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.properties.includes(property.id)}
                        onChange={() => handlePropertyToggle(property.id)}
                        className="mr-2"
                      />
                      <span className="text-sm">{property.key}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Form Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                {editingNode ? 'Update' : 'Add'} Node
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

      {/* Nodes List */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium text-gray-900">
            Nodes ({journey.nodes.length})
          </h3>
        </div>
        
        {journey.nodes.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No nodes created yet. Click "Add Node" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {journey.nodes.map((node) => (
              <div key={node.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{node.name}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {node.type}
                      </span>
                    </div>
                    {node.description && (
                      <p className="text-sm text-gray-600 mb-2">{node.description}</p>
                    )}
                    {node.properties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {node.properties.map((propertyId) => (
                          <span key={propertyId} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                            {getPropertyName(propertyId)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(node)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit Node"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(node)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Node"
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

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">About Nodes</h4>
        <div className="text-sm text-blue-800">
          <p>Nodes represent steps or stages in your journey flow.</p>
          <p className="mt-1">You can attach properties to nodes and connect them with edges to create the journey flow.</p>
        </div>
      </div>
    </div>
  );
}