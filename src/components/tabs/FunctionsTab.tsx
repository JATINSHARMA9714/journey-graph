// Tab for managing journey functions

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { Function, FUNCTION_TYPES, HTTP_METHODS } from '../../types/journey';
import { isEmpty, isValidUrl } from '../../utils/helpers';

export default function FunctionsTab() {
  const { journey, addFunction, updateFunction, deleteFunction } = useJourney();
  const [showForm, setShowForm] = useState(false);
  const [editingFunction, setEditingFunction] = useState<Function | null>(null);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    config: {
      host: '',
      path: '',
      method: 'GET',
      headers: [] as Array<{ key: string; value: string }>,
      requestBody: [] as Array<{ key: string; propertyId: string }>
    },
    inputProperties: [] as Array<{ key: string; type: string }>,
    outputProperties: [] as Array<{ key: string; type: string }>
  });

  // Reset form to empty state
  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      config: {
        host: '',
        path: '',
        method: 'GET',
        headers: [],
        requestBody: []
      },
      inputProperties: [],
      outputProperties: []
    });
    setShowForm(false);
    setEditingFunction(null);
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (isEmpty(formData.name)) {
      setError('Function name is required');
      return;
    }

    if (isEmpty(formData.type)) {
      setError('Function type is required');
      return;
    }

    if (formData.type === 'API') {
      if (isEmpty(formData.config.host)) {
        setError('Host is required for API functions');
        return;
      }

      if (!isValidUrl(formData.config.host)) {
        setError('Please enter a valid URL for host');
        return;
      }

      if (isEmpty(formData.config.path)) {
        setError('Path is required for API functions');
        return;
      }
    }

    // Save function
    try {
      if (editingFunction) {
        updateFunction(editingFunction.id, formData);
      } else {
        addFunction(formData);
      }
      resetForm();
    } catch (err) {
      setError('Failed to save function');
    }
  };

  // Start editing a function
  const handleEdit = (func: Function) => {
    setEditingFunction(func);
    setFormData({
      name: func.name,
      type: func.type,
      config: {
        host: func.config.host,
        path: func.config.path,
        method: func.config.method,
        headers: [...func.config.headers],
        requestBody: [...func.config.requestBody]
      },
      inputProperties: [...func.inputProperties],
      outputProperties: [...func.outputProperties]
    });
    setShowForm(true);
    setError('');
  };

  // Delete a function
  const handleDelete = (func: Function) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete function "${func.name}"? This will also remove all mappings that use it.`
    );
    
    if (confirmDelete) {
      deleteFunction(func.id);
    }
  };

  // Add header field
  const addHeader = () => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        headers: [...prev.config.headers, { key: '', value: '' }]
      }
    }));
  };

  // Update header field
  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        headers: prev.config.headers.map((header, i) => 
          i === index ? { ...header, [field]: value } : header
        )
      }
    }));
  };

  // Remove header field
  const removeHeader = (index: number) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        headers: prev.config.headers.filter((_, i) => i !== index)
      }
    }));
  };

  // Add request body field
  const addRequestBodyField = () => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        requestBody: [...prev.config.requestBody, { key: '', propertyId: '' }]
      }
    }));
  };

  // Update request body field
  const updateRequestBodyField = (index: number, field: 'key' | 'propertyId', value: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        requestBody: prev.config.requestBody.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  // Remove request body field
  const removeRequestBodyField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        requestBody: prev.config.requestBody.filter((_, i) => i !== index)
      }
    }));
  };

  // Add input property
  const addInputProperty = () => {
    setFormData(prev => ({
      ...prev,
      inputProperties: [...prev.inputProperties, { key: '', type: '' }]
    }));
  };

  // Update input property
  const updateInputProperty = (index: number, field: 'key' | 'type', value: string) => {
    setFormData(prev => ({
      ...prev,
      inputProperties: prev.inputProperties.map((prop, i) => 
        i === index ? { ...prop, [field]: value } : prop
      )
    }));
  };

  // Remove input property
  const removeInputProperty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inputProperties: prev.inputProperties.filter((_, i) => i !== index)
    }));
  };

  // Add output property
  const addOutputProperty = () => {
    setFormData(prev => ({
      ...prev,
      outputProperties: [...prev.outputProperties, { key: '', type: '' }]
    }));
  };

  // Update output property
  const updateOutputProperty = (index: number, field: 'key' | 'type', value: string) => {
    setFormData(prev => ({
      ...prev,
      outputProperties: prev.outputProperties.map((prop, i) => 
        i === index ? { ...prop, [field]: value } : prop
      )
    }));
  };

  // Remove output property
  const removeOutputProperty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outputProperties: prev.outputProperties.filter((_, i) => i !== index)
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
        <h2 className="text-xl font-semibold text-gray-900">Functions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Function
        </button>
      </div>

      {/* Function Form */}
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-gray-900 mb-4">
            {editingFunction ? 'Edit Function' : 'Add New Function'}
          </h3>
          
          {/* Show error if any */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Function Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Send Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Function Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  {FUNCTION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* API Configuration */}
            {formData.type === 'API' && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">API Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Host *</label>
                    <input
                      type="text"
                      value={formData.config.host}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        config: { ...formData.config, host: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://api.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Path *</label>
                    <input
                      type="text"
                      value={formData.config.path}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        config: { ...formData.config, path: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="/api/v1/users"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                    <select
                      value={formData.config.method}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        config: { ...formData.config, method: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {HTTP_METHODS.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Headers */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Headers</label>
                    <button
                      type="button"
                      onClick={addHeader}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Header
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.config.headers.map((header, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => updateHeader(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Header key"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Header value"
                        />
                        <button
                          type="button"
                          onClick={() => removeHeader(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Body */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Request Body</label>
                    <button
                      type="button"
                      onClick={addRequestBodyField}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Body Field
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.config.requestBody.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) => updateRequestBodyField(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Body key"
                        />
                        <select
                          value={item.propertyId}
                          onChange={(e) => updateRequestBodyField(index, 'propertyId', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select property</option>
                          {journey.properties.map((property) => (
                            <option key={property.id} value={property.id}>{property.key}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeRequestBodyField(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input/Output Properties */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Properties */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Input Properties</label>
                    <button
                      type="button"
                      onClick={addInputProperty}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Input
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.inputProperties.map((prop, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={prop.key}
                          onChange={(e) => updateInputProperty(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Property key"
                        />
                        <input
                          type="text"
                          value={prop.type}
                          onChange={(e) => updateInputProperty(index, 'type', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Property type"
                        />
                        <button
                          type="button"
                          onClick={() => removeInputProperty(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output Properties */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Output Properties</label>
                    <button
                      type="button"
                      onClick={addOutputProperty}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add Output
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.outputProperties.map((prop, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={prop.key}
                          onChange={(e) => updateOutputProperty(index, 'key', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Property key"
                        />
                        <input
                          type="text"
                          value={prop.type}
                          onChange={(e) => updateOutputProperty(index, 'type', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Property type"
                        />
                        <button
                          type="button"
                          onClick={() => removeOutputProperty(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                {editingFunction ? 'Update' : 'Add'} Function
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

      {/* Functions List */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="font-medium text-gray-900">
            Functions ({journey.functions.length})
          </h3>
        </div>
        
        {journey.functions.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No functions created yet. Click "Add Function" to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {journey.functions.map((func) => (
              <div key={func.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-gray-900">{func.name}</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {func.type}
                      </span>
                    </div>
                    {func.type === 'API' && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">{func.config.method}</span> {func.config.host}{func.config.path}
                      </div>
                    )}
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Headers: {func.config.headers.length}</span>
                      <span>Body Fields: {func.config.requestBody.length}</span>
                      <span>Inputs: {func.inputProperties.length}</span>
                      <span>Outputs: {func.outputProperties.length}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(func)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit Function"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(func)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete Function"
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
        <h4 className="font-medium text-blue-900 mb-2">About Functions</h4>
        <div className="text-sm text-blue-800">
          <p>Functions define API calls and processing logic for your journey.</p>
          <p className="mt-1">You can map functions to nodes to execute them at specific journey steps.</p>
        </div>
      </div>
    </div>
  );
}