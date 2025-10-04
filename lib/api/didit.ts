/**
 * Didit KYC API Integration
 * Handles identity verification and AML screening
 */

const DIDIT_API_URL = process.env.DIDIT_API_URL || 'https://verification.didit.me/v2';
const DIDIT_API_KEY = process.env.DIDIT_API_KEY || '';
const DIDIT_APP_ID = process.env.DIDIT_APP_ID || '';

export interface DiditSessionResponse {
  session_id: string;
  verification_url: string;
  status: string;
}

export interface DiditVerificationResult {
  session_id: string;
  status: 'pending' | 'verified' | 'rejected';
  workflow_id: string;
  decision: string;
  data?: {
    full_name?: string;
    document_type?: string;
    document_number?: string;
    birth_date?: string;
  };
}

/**
 * Create a verification session
 */
export async function createVerificationSession(
  userAddress: string,
  workflowId: string = 'default'
): Promise<DiditSessionResponse> {
  try {
    const response = await fetch(`${DIDIT_API_URL}/session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIDIT_API_KEY}`,
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/kyc/webhook`,
        vendor_data: userAddress,
        metadata: {
          user_address: userAddress,
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Didit API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      session_id: data.session_id,
      verification_url: data.verification_url,
      status: data.status,
    };
  } catch (error) {
    console.error('Failed to create Didit session:', error);
    throw new Error('KYC session creation failed');
  }
}

/**
 * Get verification status and results
 */
export async function getVerificationStatus(sessionId: string): Promise<DiditVerificationResult> {
  try {
    const response = await fetch(`${DIDIT_API_URL}/session/${sessionId}/decision/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIDIT_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Didit API error: ${response.statusText}`);
    }

    const data = await response.json();

    let status: 'pending' | 'verified' | 'rejected' = 'pending';
    if (data.decision === 'approved') {
      status = 'verified';
    } else if (data.decision === 'rejected') {
      status = 'rejected';
    }

    return {
      session_id: sessionId,
      status,
      workflow_id: data.workflow_id,
      decision: data.decision,
      data: data.data,
    };
  } catch (error) {
    console.error('Failed to fetch verification status:', error);
    throw new Error('Failed to retrieve KYC status');
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string = process.env.DIDIT_WEBHOOK_SECRET || ''
): boolean {
  // Implement HMAC signature verification
  // For production, use proper cryptographic signature verification
  // This is a simplified version
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Determine KYC level based on verification result
 */
export function determineKYCLevel(result: DiditVerificationResult): number {
  if (result.status !== 'verified') {
    return 0; // None
  }

  // Basic verification
  if (result.decision === 'approved' && result.data) {
    // Enhanced if document verified with biometrics
    if (result.workflow_id.includes('enhanced')) {
      return 2; // Enhanced
    }

    // Premium if includes AML screening
    if (result.workflow_id.includes('premium')) {
      return 3; // Premium
    }

    return 1; // Basic
  }

  return 0; // None
}

/**
 * Upload document for verification
 */
export async function uploadDocument(
  sessionId: string,
  documentType: 'passport' | 'id_card' | 'drivers_license',
  documentFrontBase64: string,
  documentBackBase64?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const payload: any = {
      session_id: sessionId,
      document_type: documentType,
      document_front: documentFrontBase64,
    };

    if (documentBackBase64) {
      payload.document_back = documentBackBase64;
    }

    const response = await fetch(`${DIDIT_API_URL}/session/${sessionId}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIDIT_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Document upload failed: ${response.statusText}`);
    }

    return {
      success: true,
      message: 'Document uploaded successfully',
    };
  } catch (error) {
    console.error('Document upload error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Document upload failed',
    };
  }
}
