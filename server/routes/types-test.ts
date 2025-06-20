import { Request, Response } from 'express';
import { 
  User, 
  IBO, 
  ActivityBlock, 
  ActivityBlockType, 
  Session,
  CreateUserPayload,
  ApiResponse 
} from '../types';

export const testTypes = async (req: Request, res: Response) => {
  try {
    // Test that all types are properly imported and work
    const testUser: User = {
      id: "test-uuid-server",
      email: "server@example.com",
      name: "Server Test User",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const testIBO: IBO = {
      id: "ibo-uuid-server",
      title: "Server Test IBO",
      description: "A test Intended Behavioral Outcome from server",
      user_id: testUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const testActivityBlock: ActivityBlock = {
      id: "block-uuid-server",
      learning_objective_id: "objective-uuid-server",
      title: "Server Test Activity Block",
      description: "A test activity block from server",
      block_type: ActivityBlockType.Concept,
      order_index: 1,
      estimated_duration: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const testSession: Session = {
      id: "session-uuid-server",
      user_id: testUser.id,
      learning_objective_id: "objective-uuid-server",
      title: "Server Test Session",
      status: 'in_progress',
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const testCreatePayload: CreateUserPayload = {
      email: "new-server@example.com",
      name: "New Server User"
    };

    const response: ApiResponse<{
      user: User;
      ibo: IBO;
      activityBlock: ActivityBlock;
      session: Session;
      createPayload: CreateUserPayload;
      enumValues: string[];
    }> = {
      data: {
        user: testUser,
        ibo: testIBO,
        activityBlock: testActivityBlock,
        session: testSession,
        createPayload: testCreatePayload,
        enumValues: Object.values(ActivityBlockType)
      },
      message: "Server TypeScript types test completed successfully",
      status: "ok"
    };

    res.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<never> = {
      error: "Server types test failed",
      message: error instanceof Error ? error.message : "Unknown error",
      status: "error"
    };
    res.status(500).json(errorResponse);
  }
};