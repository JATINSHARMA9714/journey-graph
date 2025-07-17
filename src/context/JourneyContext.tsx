// Context for managing journey data throughout the app

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Journey, Property, Node, Function, NodeFunctionMapping, Edge } from '../types/journey';
import { generateId } from '../utils/helpers';
import { saveJourney } from '../utils/storage';

// What the context provides
interface JourneyContextType {
  journey: Journey;
  setJourney: (journey: Journey) => void;
  updateJourneyInfo: (name: string, description: string) => void;
  
  // Property functions
  addProperty: (property: Omit<Property, 'id'>) => void;
  updateProperty: (id: string, property: Omit<Property, 'id'>) => void;
  deleteProperty: (id: string) => void;
  
  // Node functions
  addNode: (node: Omit<Node, 'id'>) => void;
  updateNode: (id: string, node: Omit<Node, 'id'>) => void;
  deleteNode: (id: string) => void;
  
  // Function functions
  addFunction: (func: Omit<Function, 'id'>) => void;
  updateFunction: (id: string, func: Omit<Function, 'id'>) => void;
  deleteFunction: (id: string) => void;
  
  // Mapping functions
  addMapping: (mapping: Omit<NodeFunctionMapping, 'id'>) => void;
  updateMapping: (id: string, mapping: Omit<NodeFunctionMapping, 'id'>) => void;
  deleteMapping: (id: string) => void;
  
  // Edge functions
  addEdge: (edge: Omit<Edge, 'id'>) => void;
  updateEdge: (id: string, edge: Omit<Edge, 'id'>) => void;
  deleteEdge: (id: string) => void;
  
  // Save and activate
  saveCurrentJourney: () => void;
  toggleJourneyActive: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

// Hook to use the context
export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within JourneyProvider');
  }
  return context;
}

// Create empty journey
function createEmptyJourney(): Journey {
  return {
    id: generateId(),
    name: '',
    description: '',
    properties: [],
    nodes: [],
    functions: [],
    mappings: [],
    edges: [],
    isActive: false
  };
}

// Provider component
interface JourneyProviderProps {
  children: ReactNode;
  initialJourney?: Journey;
}

export function JourneyProvider({ children, initialJourney }: JourneyProviderProps) {
  const [journey, setJourney] = useState<Journey>(
    initialJourney || createEmptyJourney()
  );

  // Update journey basic info
  const updateJourneyInfo = (name: string, description: string) => {
    setJourney(prev => ({
      ...prev,
      name,
      description
    }));
  };

  // Property functions
  const addProperty = (property: Omit<Property, 'id'>) => {
    const newProperty: Property = {
      ...property,
      id: generateId()
    };
    setJourney(prev => ({
      ...prev,
      properties: [...prev.properties, newProperty]
    }));
  };

  const updateProperty = (id: string, property: Omit<Property, 'id'>) => {
    setJourney(prev => ({
      ...prev,
      properties: prev.properties.map(p => 
        p.id === id ? { ...property, id } : p
      )
    }));
  };

  const deleteProperty = (id: string) => {
    setJourney(prev => ({
      ...prev,
      properties: prev.properties.filter(p => p.id !== id),
      // Remove property from nodes that use it
      nodes: prev.nodes.map(node => ({
        ...node,
        properties: node.properties.filter(propId => propId !== id)
      }))
    }));
  };

  // Node functions
  const addNode = (node: Omit<Node, 'id'>) => {
    const newNode: Node = {
      ...node,
      id: generateId()
    };
    setJourney(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const updateNode = (id: string, node: Omit<Node, 'id'>) => {
    setJourney(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === id ? { ...node, id } : n
      )
    }));
  };

  const deleteNode = (id: string) => {
    setJourney(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== id),
      // Remove edges connected to this node
      edges: prev.edges.filter(e => e.fromNodeId !== id && e.toNodeId !== id),
      // Remove mappings for this node
      mappings: prev.mappings.filter(m => m.nodeId !== id)
    }));
  };

  // Function functions
  const addFunction = (func: Omit<Function, 'id'>) => {
    const newFunction: Function = {
      ...func,
      id: generateId()
    };
    setJourney(prev => ({
      ...prev,
      functions: [...prev.functions, newFunction]
    }));
  };

  const updateFunction = (id: string, func: Omit<Function, 'id'>) => {
    setJourney(prev => ({
      ...prev,
      functions: prev.functions.map(f => 
        f.id === id ? { ...func, id } : f
      )
    }));
  };

  const deleteFunction = (id: string) => {
    setJourney(prev => ({
      ...prev,
      functions: prev.functions.filter(f => f.id !== id),
      // Remove mappings for this function
      mappings: prev.mappings.filter(m => m.functionId !== id)
    }));
  };

  // Mapping functions
  const addMapping = (mapping: Omit<NodeFunctionMapping, 'id'>) => {
    const newMapping: NodeFunctionMapping = {
      ...mapping,
      id: generateId()
    };
    setJourney(prev => ({
      ...prev,
      mappings: [...prev.mappings, newMapping]
    }));
  };

  const updateMapping = (id: string, mapping: Omit<NodeFunctionMapping, 'id'>) => {
    setJourney(prev => ({
      ...prev,
      mappings: prev.mappings.map(m => 
        m.id === id ? { ...mapping, id } : m
      )
    }));
  };

  const deleteMapping = (id: string) => {
    setJourney(prev => ({
      ...prev,
      mappings: prev.mappings.filter(m => m.id !== id)
    }));
  };

  // Edge functions
  const addEdge = (edge: Omit<Edge, 'id'>) => {
    const newEdge: Edge = {
      ...edge,
      id: generateId()
    };
    setJourney(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge]
    }));
  };

  const updateEdge = (id: string, edge: Omit<Edge, 'id'>) => {
    setJourney(prev => ({
      ...prev,
      edges: prev.edges.map(e => 
        e.id === id ? { ...edge, id } : e
      )
    }));
  };

  const deleteEdge = (id: string) => {
    setJourney(prev => ({
      ...prev,
      edges: prev.edges.filter(e => e.id !== id)
    }));
  };

  // Save journey to storage
  const saveCurrentJourney = () => {
    saveJourney(journey);
  };

  // Toggle journey active status
  const toggleJourneyActive = () => {
    setJourney(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  const contextValue: JourneyContextType = {
    journey,
    setJourney,
    updateJourneyInfo,
    addProperty,
    updateProperty,
    deleteProperty,
    addNode,
    updateNode,
    deleteNode,
    addFunction,
    updateFunction,
    deleteFunction,
    addMapping,
    updateMapping,
    deleteMapping,
    addEdge,
    updateEdge,
    deleteEdge,
    saveCurrentJourney,
    toggleJourneyActive
  };

  return (
    <JourneyContext.Provider value={contextValue}>
      {children}
    </JourneyContext.Provider>
  );
}