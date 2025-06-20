import { 
  User, 
  IBO, 
  ActivityBlock, 
  ActivityBlockType, 
  Session,
  CreateUserRequest,
  ApiResponse 
} from '../types';

export default function TypesTest() {
  // Test that all types are properly imported and work
  const testUser: User = {
    id: "test-uuid",
    email: "test@example.com",
    name: "Test User",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const testIBO: IBO = {
    id: "ibo-uuid",
    title: "Test IBO",
    description: "A test Intended Behavioral Outcome",
    user_id: testUser.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const testActivityBlock: ActivityBlock = {
    id: "block-uuid",
    learning_objective_id: "objective-uuid",
    title: "Test Activity Block",
    description: "A test activity block",
    block_type: ActivityBlockType.Connection,
    order_index: 0,
    estimated_duration: 30,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const testSession: Session = {
    id: "session-uuid",
    user_id: testUser.id,
    learning_objective_id: "objective-uuid",
    title: "Test Session",
    status: 'not_started',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const testCreateRequest: CreateUserRequest = {
    email: "new@example.com",
    name: "New User"
  };

  const testApiResponse: ApiResponse<User> = {
    data: testUser,
    message: "User retrieved successfully"
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">TypeScript Types Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-semibold mb-2">User Type Test</h2>
          <pre className="text-sm">{JSON.stringify(testUser, null, 2)}</pre>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-semibold mb-2">IBO Type Test</h2>
          <pre className="text-sm">{JSON.stringify(testIBO, null, 2)}</pre>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-semibold mb-2">ActivityBlock Type Test</h2>
          <pre className="text-sm">{JSON.stringify(testActivityBlock, null, 2)}</pre>
          <p className="mt-2 text-sm text-gray-600">
            Block Type Enum Values: {Object.values(ActivityBlockType).join(', ')}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-semibold mb-2">Session Type Test</h2>
          <pre className="text-sm">{JSON.stringify(testSession, null, 2)}</pre>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-semibold mb-2">Request/Response Types Test</h2>
          <div className="space-y-2">
            <div>
              <p className="font-medium">Create User Request:</p>
              <pre className="text-sm">{JSON.stringify(testCreateRequest, null, 2)}</pre>
            </div>
            <div>
              <p className="font-medium">API Response:</p>
              <pre className="text-sm">{JSON.stringify(testApiResponse, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded">
          <h2 className="font-semibold text-green-800 mb-2">✓ Types Test Passed</h2>
          <p className="text-green-700">
            All TypeScript interfaces are properly imported and working. The shared types from 
            <code className="bg-green-100 px-1 rounded">/shared/types.ts</code> are successfully 
            accessible in the client application.
          </p>
        </div>
      </div>
    </div>
  );
}