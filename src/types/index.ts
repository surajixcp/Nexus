export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
export type IncidentStatus = 'Open' | 'Acknowledged' | 'In Progress' | 'Escalated' | 'Resolved' | 'Closed';
export type Environment = 'Production' | 'UAT' | 'Development';
export type EscalationLevel = 'L1' | 'L2' | 'L3' | 'Management';
export type UserRole = 'Admin' | 'Employee' | 'Support Engineer' | 'Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
}

export interface ServiceDefinition {
  id: string;
  name: string;
  owner: string;
  supportTeam: string;
  slaHours: number;
  defaultToRecipients: string[];
  defaultCcRecipients: string[];
}

export interface ApplicationDefinition {
  id: string;
  name: string;
  code: string;
  description: string;
  tier: 'Tier 1 - Mission Critical' | 'Tier 2 - Business Critical' | 'Tier 3 - Standard';
  status: 'Healthy' | 'Degraded' | 'Critical Alert';
  icon: string;
  services: ServiceDefinition[];
}

export interface Incident {
  id: string;
  ticketId: string; // e.g. DEMO-INC-0001
  title: string;
  application: string;
  service: string;
  category: string;
  severity: Severity;
  priority: Priority;
  status: IncidentStatus;
  environment: Environment;
  description: string;
  impact: string;
  urgency: string;
  impactedEntity: string;
  attachments?: string[];
  reporter: {
    name: string;
    email: string;
    department: string;
  };
  assignedTeam: string;
  assignee?: string;
  createdAt: string; // ISO
  reportedAt: string;
  acknowledgedAt?: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  slaMinutes: number;
  escalationLevel?: EscalationLevel;
  resolutionNotes?: string;
  rootCause?: string;
  linkedTrackerId?: string;
}

export interface TrackerRecord {
  srNo: number;
  application: string;
  severity: Severity;
  problemId: string; // e.g. DEMO-P-2610001
  alertDescription: string;
  impactedEntity: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  reportedDate: string;
  reportedTime: string;
  endDate: string; // empty if active
  endTime: string; // empty if active
  durationMinutes: number;
  reportedDurationMinutes: number;
  escalationDetails: string;
  acknowledgementReceived: 'Yes' | 'No';
  reportedBy: string;
  troubleshootingNotes: string;
  supportResponse: string;
  resolutionSteps: string;
  startDateTime: string; // formatted ISO or display string
  reportedDateTime: string;
  endDateTime: string;
  status: 'Active' | 'Resolved';
  linkedTicketId?: string;
}

export interface EscalationRecord {
  id: string;
  incidentId: string;
  ticketId: string;
  title: string;
  application: string;
  level: EscalationLevel;
  reason: string;
  notes: string;
  escalatedBy: string;
  assignedTeam: string;
  owner: string;
  escalatedAt: string;
  slaExpiresAt: string;
  status: 'Active' | 'Resolved' | 'Closed';
}

export interface NotificationEmail {
  id: string;
  incidentId: string;
  ticketId: string;
  subject: string;
  to: string[];
  cc: string[];
  body: string;
  sentAt: string;
  status: 'Sent' | 'Pending' | 'Failed';
  type: 'Creation' | 'Update' | 'Escalation' | 'Resolution';
}

export interface ChatMessage {
  id: string;
  incidentId: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    email: string;
  };
  content: string;
  timestamp: string;
  isInternal: boolean;
  attachments?: string[];
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  department: string;
  author: string;
  uploadDate: string;
  status: 'Indexed' | 'Processing' | 'Uploaded' | 'Failed';
  fileType: 'PDF' | 'DOCX' | 'TXT' | 'MD';
  fileSize: string;
  pages: number;
  excerpt: string;
  content: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  author: string;
  lastUpdated: string;
  helpfulCount: number;
  notHelpfulCount: number;
  contentMarkdown: string;
  steps: string[];
  relatedIncidents: string[];
  relatedDocuments: string[];
  views: number;
  bookmarked?: boolean;
}

export interface RAGCitation {
  docTitle: string;
  page: number;
  snippet: string;
}

export interface RAGMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: RAGCitation[];
  suggestedFollowUps?: string[];
}
