// Tab for managing journey properties

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { Property, PROPERTY_TYPES } from '../../types/journey';
import { isEmpty } from '../../utils/helpers';

export default function PropertiesTab() {
  const { journey, addProperty, updateProperty, deleteProperty } = useJourney();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    key: '',
    type: '',
    validationCondition: ''
  });

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      key: '',
      type: '',
      validationCondition: ''
    });
    setShowForm(false);
    setEditingProperty(null);
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (isEmpty(formData.key)) {
      setError('Property key is required');
      return;
    }

    if (isEmpty(formData.type)) {
      setError('Property type is required');
      return;
    }

    // Check for duplicate keys (except when editing)
    const existingProperty = journey.properties.find(p => 
      p.key === formData.key && p.id !== editingProperty?.id
    );
    
    if (existingProperty) {
      setError('A property with this key already exists');
      return;
    }

    // Save property
    try {
      if (editingProperty) {
        updateProperty(editingProperty.id, formData);
      } else {
        addProperty(formData);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save property');
    }
  };

  // Start editing a property
  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      key: property.key,
      type: property.type,
      validationCondition: property.validationCondition || ''
    });
    setShowForm(true);
    setError('');
  };

  // Delete a property
  const handleDelete = (property: Property) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete property "${property.key}"? This will remove it from all nodes that use it.`
    );
    
    if (confirmDelete) {
      deleteProperty(property.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Property
        </button>
      </div>

      {/* Property Form */}
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            {editingProperty ? 'Edit Property' : 'Add New Property'}
          </h3>
          
          {/* Show error if any */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Property Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Key *
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., user_id, email"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Validation Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validation Condition (Optional)
              </label>
              <input
                type="text"
                value={formData.validationCondition}
                onChange={(e) => setFormData({ ...formData, validationCondition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., length > 5, value !== null"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                {editingProperty ? 'Update' : 'Add'} Property
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

      {/* Properties List */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium text-gray-900">
            Properties ({journey.properties.length})
          </h3>
        </div>
        
        {journey.properties.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No properties created yet. Click "Add Property" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {journey.properties.map((property) => (
              <div key={property.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{property.key}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {property.type}
                      </span>
                    </div>
                    {property.validationCondition && (
                      <p className="text-sm text-gray-600">
                        <strong>Validation:</strong> {property.validationCondition}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(property)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit Property"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(property)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Property"
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
      {journey.properties.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">About Properties</h4>
          <div className="text-sm text-blue-800">
            <p>Properties define the data structure for your journey.</p>
            <p className="mt-1">You can attach properties to nodes and use them in function configurations.</p>
          </div>
        </div>
      )}
    </div>
  );
}