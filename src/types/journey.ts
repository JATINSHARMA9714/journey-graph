// Simple types for the journey builder application

export interface Property {
  id: string;
  key: string;
  type: string;
  validationCondition?: string;
}

export interface Node {
  id: string;
  name: string;
  type: string;
  description: string;
  properties: string[]; // Array of property IDs
}

export interface Function {
  id: string;
  name: string;
  type: string;
  config: {
    host: string;
    path: string;
    method: string;
    headers: Array<{
      key: string;
      value: string;
    }>;
    requestBody: Array<{
      key: string;
      propertyId: string;
    }>;
  };
  inputProperties: Array<{
    key: string;
    type: string;
  }>;
  outputProperties: Array<{
    key: string;
    type: string;
  }>;
}

export interface NodeFunctionMapping {
  id: string;
  name: string;
  description: string;
  nodeId: string;
  functionId: string;
  condition: string;
}

export interface Edge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  condition: string;
}

export interface Journey {
  id: string;
  name: string;
  description: string;
  properties: Property[];
  nodes: Node[];
  functions: Function[];
  mappings: NodeFunctionMapping[];
  edges: Edge[];
  isActive: boolean;
}

// Available options for dropdowns
export const PROPERTY_TYPES = [
  'STRING',
  'NUMBER',
  'BOOLEAN',
  'DATE',
  'ARRAY',
  'OBJECT'
];

export const NODE_TYPES = [
  'start',
  'end',
  'process',
  'decision',
  'api_call'
];

export const FUNCTION_TYPES = [
  'API',
  'WEBHOOK'
];

export const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE'
];