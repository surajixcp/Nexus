import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Incident,
  TrackerRecord,
  EscalationRecord,
  NotificationEmail,
  ChatMessage,
  KnowledgeDocument,
  KnowledgeArticle,
  RAGMessage,
  Severity,
} from '../types';
import { DEMO_USERS } from '../data/mockUsers';
import { INITIAL_APPLICATIONS } from '../data/mockApplications';
import { INITIAL_INCIDENTS } from '../data/mockIncidents';
import { INITIAL_TRACKER_RECORDS } from '../data/mockTracker';
import { INITIAL_DOCUMENTS, INITIAL_ARTICLES, INITIAL_RAG_CONVERSATIONS } from '../data/mockKnowledge';
import { formatTicketId, formatProblemId, calculateDurationMinutes, formatDuration } from '../utils/calculations';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  theme: 'light' | 'dark';
  switchRole: (role: UserRole) => void;
  toggleTheme: () => void;
  toasts: ToastItem[];
  addToast: (title: string, message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;

  // Data collections
  applications: typeof INITIAL_APPLICATIONS;
  incidents: Incident[];
  trackerRecords: TrackerRecord[];
  escalations: EscalationRecord[];
  emailNotifications: NotificationEmail[];
  chatMessages: ChatMessage[];
  documents: KnowledgeDocument[];
  knowledgeArticles: KnowledgeArticle[];
  ragConversations: RAGMessage[];

  // Actions
  createIncident: (incidentData: Partial<Incident>) => Incident;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  escalateIncident: (
    incidentId: string,
    level: EscalationRecord['level'],
    reason: string,
    notes: string,
    assignedTeam: string,
    owner: string
  ) => void;
  resolveIncident: (
    incidentId: string,
    resolutionNotes: string,
    rootCause: string,
    createArticle?: boolean
  ) => void;
  closeIncident: (incidentId: string) => void;

  createTrackerRecord: (record: Partial<TrackerRecord>) => TrackerRecord;
  updateTrackerRecord: (srNo: number, updates: Partial<TrackerRecord>) => void;
  deleteTrackerRecord: (srNo: number) => void;

  sendSimulatedEmail: (email: Omit<NotificationEmail, 'id' | 'sentAt'>) => void;
  addChatMessage: (
    incidentId: string,
    content: string,
    isInternal?: boolean,
    attachments?: string[]
  ) => void;

  uploadDocument: (doc: Omit<KnowledgeDocument, 'id' | 'uploadDate' | 'status'>) => void;
  reindexDocument: (docId: string) => void;
  deleteDocument: (docId: string) => void;

  createKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id' | 'lastUpdated' | 'helpfulCount' | 'notHelpfulCount' | 'views'>) => KnowledgeArticle;
  rateKnowledgeArticle: (articleId: string, helpful: boolean) => void;
  toggleBookmarkArticle: (articleId: string) => void;

  sendRAGQuery: (query: string) => Promise<void>;
  isAITyping: boolean;

  resetDemoData: () => void;
}

const STORAGE_KEYS = {
  ROLE: 'nexus_user_role',
  THEME: 'nexus_theme_v2',
  INCIDENTS: 'nexus_incidents',
  TRACKER: 'nexus_tracker',
  ESCALATIONS: 'nexus_escalations',
  EMAILS: 'nexus_emails',
  CHATS: 'nexus_chats',
  DOCUMENTS: 'nexus_documents',
  ARTICLES: 'nexus_articles',
  RAG_CHATS: 'nexus_rag_chats',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & User
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'Admin';
  });

  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.Admin;

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = (title: string, message: string, type: ToastItem['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch Role
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    addToast('Role Switched', `Logged in as ${DEMO_USERS[role].name} (${role})`, 'info');
  };

  // Toggle Theme
  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Incidents
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  // Tracker Records
  const [trackerRecords, setTrackerRecords] = useState<TrackerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRACKER);
      return saved ? JSON.parse(saved) : INITIAL_TRACKER_RECORDS;
    } catch {
      return INITIAL_TRACKER_RECORDS;
    }
  });

  // Escalations
  const [escalations, setEscalations] = useState<EscalationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ESCALATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'esc-1',
        incidentId: 'inc-1',
        ticketId: 'DEMO-INC-0001',
        title: 'PayWave Gateway Merchant Card Authorization Elevated Timeout Rates',
        application: 'PayWave Gateway',
        level: 'L2',
        reason: 'Payment switch response latency > 8500ms exceeding 60-min SLA threshold.',
        notes: 'Draining switch-03 traffic to node-01 and node-02; investigating thread pool exhaustion.',
        escalatedBy: 'Alex Morgan',
        assignedTeam: 'Demo PayWave L3 Engineering',
        owner: 'Priya Sharma',
        escalatedAt: '2026-10-31T17:22:00Z',
        slaExpiresAt: '2026-10-31T18:15:00Z',
        status: 'Active',
      },
      {
        id: 'esc-2',
        incidentId: 'inc-2',
        ticketId: 'DEMO-INC-0002',
        title: 'DemoInfra PostgreSQL Primary Database Connection Pool Saturation',
        application: 'DemoInfra Services',
        level: 'L3',
        reason: 'Active DB connections at 98% max_connections (1960/2000). Cascading failure risk.',
        notes: 'Principal DBA terminating idle sessions older than 10m; Keycloak pool leaking.',
        escalatedBy: 'Elena Rostova',
        assignedTeam: 'Demo Database Administration Ops',
        owner: 'James Wilson',
        escalatedAt: '2026-10-31T16:38:00Z',
        slaExpiresAt: '2026-10-31T17:30:00Z',
        status: 'Active',
      },
    ];
  });

  // Emails
  const [emailNotifications, setEmailNotifications] = useState<NotificationEmail[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMAILS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'email-1',
        incidentId: 'inc-1',
        ticketId: 'DEMO-INC-0001',
        subject: '[CRITICAL ALERT] DEMO-INC-0001: PayWave Gateway Merchant Card Authorization Latency',
        to: ['paywave-auth-tier3@example.com', 'payment-switch-ops@example.com'],
        cc: ['card-network-liaison@example.com', 'fintech-ops@example.com', 'incident-management@example.com'],
        body: 'Incident DEMO-INC-0001 has been logged with Severity: Critical (P1).\nApplication: PayWave Gateway\nImpacted Entity: paywave-auth-switch-prod-03.internal.net\nImmediate investigation requested.',
        sentAt: '2026-10-31T17:20:00Z',
        status: 'Sent',
        type: 'Creation',
      },
      {
        id: 'email-2',
        incidentId: 'inc-2',
        ticketId: 'DEMO-INC-0002',
        subject: '[ESCALATION - L3] DEMO-INC-0002: DemoInfra PostgreSQL Primary Database Connection Pool Saturation',
        to: ['dba-oncall-emergency@example.com', 'infra-database@example.com'],
        cc: ['cloud-ops-command@example.com', 'incident-command@example.com'],
        body: 'Incident DEMO-INC-0002 has been escalated to Level 3.\nReason: Active database connections reached 98% capacity with pool starvation in FinEdge.',
        sentAt: '2026-10-31T16:38:00Z',
        status: 'Sent',
        type: 'Escalation',
      },
      {
        id: 'email-3',
        incidentId: 'inc-7',
        ticketId: 'DEMO-INC-0007',
        subject: '[RESOLVED] DEMO-INC-0007: PayWave Instant UPI Switch Heartbeat Timeout',
        to: ['upi-ops-emergency@example.com'],
        cc: ['paywave-leads@example.com'],
        body: 'Incident DEMO-INC-0007 has been marked RESOLVED.\nResolution: MPLS provider confirmed fiber cut. Traffic routed across secondary encrypted VPN tunnel.',
        sentAt: '2026-10-31T12:48:00Z',
        status: 'Sent',
        type: 'Resolution',
      },
    ];
  });

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg-1',
        incidentId: 'inc-1',
        author: {
          name: 'Alex Morgan',
          role: 'Admin / Incident Commander',
          avatar: DEMO_USERS.Admin.avatar,
          email: DEMO_USERS.Admin.email,
        },
        content: 'Bridge open for DEMO-INC-0001. Auth timeouts currently at 34%. Draining node 03 immediately.',
        timestamp: '2026-10-31T17:22:00Z',
        isInternal: false,
      },
      {
        id: 'msg-2',
        incidentId: 'inc-1',
        author: {
          name: 'Priya Sharma',
          role: 'Support Engineer',
          avatar: DEMO_USERS['Support Engineer'].avatar,
          email: DEMO_USERS['Support Engineer'].email,
        },
        content: 'Analyzing thread dump from switch-03. 42 worker threads are blocked in WAITING state on HSM cryptographic socket pool.',
        timestamp: '2026-10-31T17:35:00Z',
        isInternal: true,
        attachments: ['thread_dump_switch_03.log'],
      },
      {
        id: 'msg-3',
        incidentId: 'inc-1',
        author: {
          name: 'Marcus Vance',
          role: 'Manager / VP Service Delivery',
          avatar: DEMO_USERS.Manager.avatar,
          email: DEMO_USERS.Manager.email,
        },
        content: 'SLA countdown is at 28 minutes. Retail operations leadership notified. Let me know if we need vendor NOC escalation.',
        timestamp: '2026-10-31T17:48:00Z',
        isInternal: false,
      },
    ];
  });

  // Knowledge Documents
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  // Knowledge Articles
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  // RAG Conversations
  const [ragConversations, setRagConversations] = useState<RAGMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RAG_CHATS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'rag-init-1',
        role: 'user',
        content: 'How do I troubleshoot payment gateway failures?',
        timestamp: '2026-10-31T18:00:00Z',
      },
      INITIAL_RAG_CONVERSATIONS[0].response,
    ];
  });

  const [isAITyping, setIsAITyping] = useState(false);

  // Persistence to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRACKER, JSON.stringify(trackerRecords));
  }, [trackerRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ESCALATIONS, JSON.stringify(escalations));
  }, [escalations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emailNotifications));
  }, [emailNotifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(knowledgeArticles));
  }, [knowledgeArticles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RAG_CHATS, JSON.stringify(ragConversations));
  }, [ragConversations]);

  // Create Incident
  const createIncident = (incidentData: Partial<Incident>): Incident => {
    const nextIncNum = incidents.length + 1;
    const ticketId = formatTicketId(nextIncNum);
    const problemId = formatProblemId(nextIncNum);
    const nowIso = new Date().toISOString();
    const nowDisplay = nowIso.slice(0, 10);
    const timeDisplay = nowIso.slice(11, 19);

    const fullIncident: Incident = {
      id: `inc-${Date.now()}`,
      ticketId,
      title: incidentData.title || 'Untitled Incident',
      application: incidentData.application || 'DemoBank Core',
      service: incidentData.service || 'Account Ledger Engine',
      category: incidentData.category || 'General Operational Alert',
      severity: incidentData.severity || 'Medium',
      priority: incidentData.priority || 'P3',
      status: 'Open',
      environment: incidentData.environment || 'Production',
      description: incidentData.description || 'No description provided.',
      impact: incidentData.impact || 'Service disruption under observation.',
      urgency: incidentData.urgency || 'Medium',
      impactedEntity: incidentData.impactedEntity || 'Internal Application Cluster',
      attachments: incidentData.attachments || [],
      reporter: {
        name: currentUser.name,
        email: currentUser.email,
        department: currentUser.department,
      },
      assignedTeam: incidentData.assignedTeam || 'Demo Core Banking L2 Team',
      assignee: incidentData.assignee,
      createdAt: nowIso,
      reportedAt: nowIso,
      updatedAt: nowIso,
      slaMinutes: incidentData.severity === 'Critical' ? 60 : incidentData.severity === 'High' ? 240 : incidentData.severity === 'Medium' ? 720 : 1440,
      linkedTrackerId: problemId,
    };

    // Auto-create linked Tracker Record
    const fullTracker: TrackerRecord = {
      srNo: trackerRecords.length + 1,
      application: fullIncident.application,
      severity: fullIncident.severity,
      problemId,
      alertDescription: fullIncident.title,
      impactedEntity: fullIncident.impactedEntity,
      startDate: nowDisplay,
      startTime: timeDisplay,
      reportedDate: nowDisplay,
      reportedTime: timeDisplay,
      endDate: '',
      endTime: '',
      durationMinutes: 0,
      reportedDurationMinutes: 0,
      escalationDetails: 'Logged via Nexus Incident Intake Portal.',
      acknowledgementReceived: 'No',
      reportedBy: `${currentUser.name} (${currentUser.department})`,
      troubleshootingNotes: fullIncident.description,
      supportResponse: 'Assigned to ' + fullIncident.assignedTeam,
      resolutionSteps: 'Investigation pending initial acknowledgement.',
      startDateTime: `${nowDisplay} ${timeDisplay}`,
      reportedDateTime: `${nowDisplay} ${timeDisplay}`,
      endDateTime: 'Active / In Progress',
      status: 'Active',
      linkedTicketId: ticketId,
    };

    // Auto-send creation email notification
    const matchedApp = INITIAL_APPLICATIONS.find((a) => a.name === fullIncident.application);
    const matchedSrv = matchedApp?.services.find((s) => s.name === fullIncident.service);

    const newEmail: NotificationEmail = {
      id: `email-${Date.now()}`,
      incidentId: fullIncident.id,
      ticketId: fullIncident.ticketId,
      subject: `[${fullIncident.severity.toUpperCase()} INCIDENT] ${ticketId}: ${fullIncident.title}`,
      to: matchedSrv?.defaultToRecipients || ['support-oncall@example.com'],
      cc: matchedSrv?.defaultCcRecipients || ['incident-command@example.com'],
      body: `A new incident has been reported:\nTicket ID: ${ticketId}\nApplication: ${fullIncident.application}\nService: ${fullIncident.service}\nSeverity: ${fullIncident.severity} (${fullIncident.priority})\nReporter: ${currentUser.name}\nDescription: ${fullIncident.description}\nAssigned Team: ${fullIncident.assignedTeam}`,
      sentAt: nowIso,
      status: 'Sent',
      type: 'Creation',
    };

    // Add initial system chat message
    const initialChat: ChatMessage = {
      id: `msg-${Date.now()}`,
      incidentId: fullIncident.id,
      author: {
        name: 'Nexus System Bot',
        role: 'Automated Orchestrator',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80',
        email: 'nexus-bot@example.com',
      },
      content: `Incident ${ticketId} registered with severity ${fullIncident.severity} (${fullIncident.priority}). Notification dispatched to ${fullIncident.assignedTeam}.`,
      timestamp: nowIso,
      isInternal: false,
    };

    setIncidents((prev) => [fullIncident, ...prev]);
    setTrackerRecords((prev) => [fullTracker, ...prev]);
    setEmailNotifications((prev) => [newEmail, ...prev]);
    setChatMessages((prev) => [...prev, initialChat]);

    addToast('Incident Created', `${ticketId} created and linked to tracker ${problemId}`, 'success');
    return fullIncident;
  };

  // Update Incident
  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, ...updates, updatedAt: new Date().toISOString() } : inc))
    );
    addToast('Incident Updated', 'Changes saved successfully', 'success');
  };

  // Escalate Incident
  const escalateIncident = (
    incidentId: string,
    level: EscalationRecord['level'],
    reason: string,
    notes: string,
    assignedTeam: string,
    owner: string
  ) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    const nowIso = new Date().toISOString();
    const newEscalation: EscalationRecord = {
      id: `esc-${Date.now()}`,
      incidentId,
      ticketId: inc.ticketId,
      title: inc.title,
      application: inc.application,
      level,
      reason,
      notes,
      escalatedBy: currentUser.name,
      assignedTeam,
      owner,
      escalatedAt: nowIso,
      slaExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'Active',
    };

    setEscalations((prev) => [newEscalation, ...prev]);

    // Update incident status
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: 'Escalated',
              escalationLevel: level,
              assignedTeam,
              assignee: owner,
              updatedAt: nowIso,
            }
          : i
      )
    );

    // Update tracker
    if (inc.linkedTrackerId) {
      setTrackerRecords((prev) =>
        prev.map((t) =>
          t.problemId === inc.linkedTrackerId
            ? {
                ...t,
                escalationDetails: `Escalated to ${level} (${owner}) by ${currentUser.name}. Reason: ${reason}`,
              }
            : t
        )
      );
    }

    // Send escalation email notification
    const escEmail: NotificationEmail = {
      id: `email-${Date.now()}`,
      incidentId,
      ticketId: inc.ticketId,
      subject: `[ESCALATION - ${level}] ${inc.ticketId}: ${inc.title}`,
      to: ['escalation-command@example.com', `${owner.toLowerCase().replace(/\s+/g, '.')}@example.com`],
      cc: ['management-alerts@example.com'],
      body: `Incident ${inc.ticketId} escalated to ${level}.\nReason: ${reason}\nOwner: ${owner}\nNotes: ${notes}`,
      sentAt: nowIso,
      status: 'Sent',
      type: 'Escalation',
    };
    setEmailNotifications((prev) => [escEmail, ...prev]);

    // Add chat record
    const escChat: ChatMessage = {
      id: `msg-${Date.now()}`,
      incidentId,
      author: {
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
        email: currentUser.email,
      },
      content: `Escalated incident to **${level}** (Assigned to ${owner}). Reason: ${reason}`,
      timestamp: nowIso,
      isInternal: true,
    };
    setChatMessages((prev) => [...prev, escChat]);

    addToast('Incident Escalated', `${inc.ticketId} escalated to ${level}`, 'warning');
  };

  // Resolve Incident
  const resolveIncident = (
    incidentId: string,
    resolutionNotes: string,
    rootCause: string,
    createArticle?: boolean
  ) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return;

    const nowIso = new Date().toISOString();
    const nowDisplay = nowIso.slice(0, 10);
    const timeDisplay = nowIso.slice(11, 19);

    // Update incident
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status: 'Resolved',
              resolvedAt: nowIso,
              resolutionNotes,
              rootCause,
              updatedAt: nowIso,
            }
          : i
      )
    );

    // Update tracker
    if (inc.linkedTrackerId) {
      setTrackerRecords((prev) =>
        prev.map((t) => {
          if (t.problemId === inc.linkedTrackerId) {
            const duration = calculateDurationMinutes(t.startDate, t.startTime, nowDisplay, timeDisplay);
            const reportedDuration = calculateDurationMinutes(t.reportedDate, t.reportedTime, nowDisplay, timeDisplay);
            return {
              ...t,
              status: 'Resolved',
              endDate: nowDisplay,
              endTime: timeDisplay,
              endDateTime: `${nowDisplay} ${timeDisplay}`,
              durationMinutes: duration,
              reportedDurationMinutes: reportedDuration,
              resolutionSteps: resolutionNotes,
            };
          }
          return t;
        })
      );
    }

    // Resolve escalation if any
    setEscalations((prev) =>
      prev.map((e) => (e.incidentId === incidentId ? { ...e, status: 'Resolved' } : e))
    );

    // Resolution Email
    const resEmail: NotificationEmail = {
      id: `email-${Date.now()}`,
      incidentId,
      ticketId: inc.ticketId,
      subject: `[RESOLVED] ${inc.ticketId}: ${inc.title}`,
      to: [inc.reporter.email, 'incident-command@example.com'],
      cc: ['stakeholders@example.com'],
      body: `Incident ${inc.ticketId} has been resolved by ${currentUser.name}.\n\nResolution Notes:\n${resolutionNotes}\n\nRoot Cause:\n${rootCause}`,
      sentAt: nowIso,
      status: 'Sent',
      type: 'Resolution',
    };
    setEmailNotifications((prev) => [resEmail, ...prev]);

    // Chat notice
    const resChat: ChatMessage = {
      id: `msg-${Date.now()}`,
      incidentId,
      author: {
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
        email: currentUser.email,
      },
      content: `Resolved incident. Resolution: "${resolutionNotes}". Root cause identified: "${rootCause}".`,
      timestamp: nowIso,
      isInternal: false,
    };
    setChatMessages((prev) => [...prev, resChat]);

    // Create Knowledge Article from resolution if flagged
    if (createArticle) {
      const newArt: KnowledgeArticle = {
        id: `art-${Date.now()}`,
        title: `Resolution Runbook: ${inc.title}`,
        description: `Automated runbook generated from resolution of ${inc.ticketId}. Root Cause: ${rootCause}`,
        category: inc.category,
        department: inc.assignedTeam,
        author: currentUser.name,
        lastUpdated: nowDisplay,
        helpfulCount: 1,
        notHelpfulCount: 0,
        views: 1,
        tags: [inc.application, inc.service, 'Resolved Incident', inc.ticketId],
        steps: [
          'Verify symptoms matching incident description.',
          'Execute resolution steps identified during incident:',
          resolutionNotes,
          'Confirm health check endpoints return 200 OK.',
        ],
        contentMarkdown: `### Incident ${inc.ticketId} Resolution Report\n\n**Application**: ${inc.application}\n**Service**: ${inc.service}\n\n#### Root Cause\n${rootCause}\n\n#### Resolution Procedure\n${resolutionNotes}`,
        relatedIncidents: [inc.ticketId],
        relatedDocuments: [],
      };
      setKnowledgeArticles((prev) => [newArt, ...prev]);
      addToast('Knowledge Article Created', `Generated article from resolution: "${newArt.title}"`, 'success');
    }

    addToast('Incident Resolved', `${inc.ticketId} marked as Resolved`, 'success');
  };

  // Close Incident
  const closeIncident = (incidentId: string) => {
    const nowIso = new Date().toISOString();
    setIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, status: 'Closed', closedAt: nowIso, updatedAt: nowIso } : i))
    );
    addToast('Incident Closed', 'Incident status moved to Closed', 'info');
  };

  // Create Tracker Record
  const createTrackerRecord = (record: Partial<TrackerRecord>): TrackerRecord => {
    const nextSr = trackerRecords.length + 1;
    const problemId = formatProblemId(nextSr);
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toISOString().slice(11, 19);

    const fullRecord: TrackerRecord = {
      srNo: nextSr,
      application: record.application || 'DemoBank Core',
      severity: record.severity || 'Medium',
      problemId: record.problemId || problemId,
      alertDescription: record.alertDescription || 'Manual tracker entry',
      impactedEntity: record.impactedEntity || 'Internal Cluster Host',
      startDate: record.startDate || dateStr,
      startTime: record.startTime || timeStr,
      reportedDate: record.reportedDate || dateStr,
      reportedTime: record.reportedTime || timeStr,
      endDate: record.endDate || '',
      endTime: record.endTime || '',
      durationMinutes: record.durationMinutes || 0,
      reportedDurationMinutes: record.reportedDurationMinutes || 0,
      escalationDetails: record.escalationDetails || 'Direct tracker entry',
      acknowledgementReceived: record.acknowledgementReceived || 'Yes',
      reportedBy: record.reportedBy || currentUser.name,
      troubleshootingNotes: record.troubleshootingNotes || 'Initial diagnostic notes.',
      supportResponse: record.supportResponse || 'Support team acknowledged.',
      resolutionSteps: record.resolutionSteps || '',
      startDateTime: `${record.startDate || dateStr} ${record.startTime || timeStr}`,
      reportedDateTime: `${record.reportedDate || dateStr} ${record.reportedTime || timeStr}`,
      endDateTime: record.endDate ? `${record.endDate} ${record.endTime}` : 'Active / In Progress',
      status: record.endDate ? 'Resolved' : 'Active',
      linkedTicketId: record.linkedTicketId,
    };

    setTrackerRecords((prev) => [fullRecord, ...prev]);
    addToast('Tracker Record Added', `Record #${nextSr} (${fullRecord.problemId}) created`, 'success');
    return fullRecord;
  };

  // Update Tracker Record
  const updateTrackerRecord = (srNo: number, updates: Partial<TrackerRecord>) => {
    setTrackerRecords((prev) =>
      prev.map((r) => {
        if (r.srNo === srNo) {
          const updated = { ...r, ...updates };
          // Recalculate duration if start/end dates modified
          if (updated.startDate && updated.startTime) {
            updated.durationMinutes = calculateDurationMinutes(
              updated.startDate,
              updated.startTime,
              updated.endDate,
              updated.endTime
            );
          }
          if (updated.reportedDate && updated.reportedTime) {
            updated.reportedDurationMinutes = calculateDurationMinutes(
              updated.reportedDate,
              updated.reportedTime,
              updated.endDate,
              updated.endTime
            );
          }
          return updated;
        }
        return r;
      })
    );
    addToast('Tracker Updated', `Record #${srNo} updated`, 'success');
  };

  // Delete Tracker Record
  const deleteTrackerRecord = (srNo: number) => {
    setTrackerRecords((prev) => prev.filter((r) => r.srNo !== srNo));
    addToast('Record Deleted', `Tracker record #${srNo} deleted`, 'info');
  };

  // Send Simulated Email
  const sendSimulatedEmail = (email: Omit<NotificationEmail, 'id' | 'sentAt'>) => {
    const newEmail: NotificationEmail = {
      ...email,
      id: `email-${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: 'Sent',
    };
    setEmailNotifications((prev) => [newEmail, ...prev]);
    addToast('Email Dispatched', `Notification sent to ${newEmail.to.join(', ')}`, 'success');
  };

  // Add Chat Message
  const addChatMessage = (
    incidentId: string,
    content: string,
    isInternal: boolean = false,
    attachments: string[] = []
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      incidentId,
      author: {
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
        email: currentUser.email,
      },
      content,
      timestamp: new Date().toISOString(),
      isInternal,
      attachments,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulate reply after 1.5s if not internal
    if (!isInternal && (currentUser.role === 'Admin' || currentUser.role === 'Employee')) {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          incidentId,
          author: {
            name: 'Priya Sharma',
            role: 'Support Engineer (On-Call)',
            avatar: DEMO_USERS['Support Engineer'].avatar,
            email: DEMO_USERS['Support Engineer'].email,
          },
          content: 'Acknowledged update. Support engineering is actively investigating telemetry and metrics.',
          timestamp: new Date().toISOString(),
          isInternal: false,
        };
        setChatMessages((prev) => [...prev, autoReply]);
      }, 1500);
    }
  };

  // Upload Document
  const uploadDocument = (doc: Omit<KnowledgeDocument, 'id' | 'uploadDate' | 'status'>) => {
    const newDocId = `doc-${Date.now()}`;
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: newDocId,
      uploadDate: new Date().toISOString().slice(0, 10),
      status: 'Processing',
    };

    setDocuments((prev) => [newDoc, ...prev]);
    addToast('Document Uploaded', `File uploaded. AI indexing initiated...`, 'info');

    // Simulate indexing completion
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === newDocId ? { ...d, status: 'Indexed' } : d))
      );
      addToast('Document Indexed', `"${newDoc.title}" successfully indexed into RAG vectors!`, 'success');
    }, 2500);
  };

  // Re-index Document
  const reindexDocument = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'Processing' } : d))
    );
    addToast('Re-indexing', 'Rebuilding semantic vector embeddings...', 'info');

    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, status: 'Indexed' } : d))
      );
      addToast('Re-indexing Complete', 'Embeddings updated successfully.', 'success');
    }, 2000);
  };

  // Delete Document
  const deleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    addToast('Document Deleted', 'Document removed from knowledge base', 'info');
  };

  // Create Knowledge Article
  const createKnowledgeArticle = (
    article: Omit<KnowledgeArticle, 'id' | 'lastUpdated' | 'helpfulCount' | 'notHelpfulCount' | 'views'>
  ): KnowledgeArticle => {
    const newArt: KnowledgeArticle = {
      ...article,
      id: `art-${Date.now()}`,
      lastUpdated: new Date().toISOString().slice(0, 10),
      helpfulCount: 0,
      notHelpfulCount: 0,
      views: 1,
    };
    setKnowledgeArticles((prev) => [newArt, ...prev]);
    addToast('Article Published', `"${newArt.title}" published to Knowledge Hub`, 'success');
    return newArt;
  };

  // Rate Article
  const rateKnowledgeArticle = (articleId: string, helpful: boolean) => {
    setKnowledgeArticles((prev) =>
      prev.map((a) => {
        if (a.id === articleId) {
          return {
            ...a,
            helpfulCount: helpful ? a.helpfulCount + 1 : a.helpfulCount,
            notHelpfulCount: !helpful ? a.notHelpfulCount + 1 : a.notHelpfulCount,
          };
        }
        return a;
      })
    );
    addToast('Feedback Saved', 'Thank you for your feedback!', 'success');
  };

  // Toggle Bookmark
  const toggleBookmarkArticle = (articleId: string) => {
    setKnowledgeArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, bookmarked: !a.bookmarked } : a))
    );
  };

  // Send RAG Query with realistic streamed answer animation
  const sendRAGQuery = async (query: string): Promise<void> => {
    const userMsg: RAGMessage = {
      id: `rag-user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setRagConversations((prev) => [...prev, userMsg]);
    setIsAITyping(true);

    // Look for best match in predefined conversations or generate realistic answer
    const queryLower = query.toLowerCase();
    const matched = INITIAL_RAG_CONVERSATIONS.find((c) =>
      c.query.toLowerCase().includes(queryLower) || queryLower.includes(c.query.toLowerCase().slice(0, 15))
    );

    let assistantMsg: RAGMessage;
    if (matched) {
      assistantMsg = {
        ...matched.response,
        id: `rag-resp-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Find relevant docs
      const relevantDoc = documents.find((d) =>
        d.title.toLowerCase().includes(queryLower) || d.content.toLowerCase().includes(queryLower.slice(0, 10))
      ) || documents[0];

      assistantMsg = {
        id: `rag-resp-${Date.now()}`,
        role: 'assistant',
        content: `Based on enterprise documentation **${relevantDoc.title}** and our operational telemetry database:\n\n1. **Diagnostic Evaluation**: Search logs for matching application error codes. Ensure health check probes on active cluster nodes return HTTP 200.\n2. **Runbook Reference**: Consult **${relevantDoc.title}** (page ${Math.min(3, relevantDoc.pages)}) for standard operating procedure.\n3. **Remediation Action**: Execute standard mitigation steps. If timeout or latency persists past SLA limits, escalate through the Incident Management Center.\n\n*Synthetic Knowledge Base Citation*: Derived from indexed organizational SOP repository.`,
        timestamp: new Date().toISOString(),
        citations: [
          {
            docTitle: relevantDoc.title,
            page: 2,
            snippet: relevantDoc.excerpt,
          },
        ],
        suggestedFollowUps: [
          `Show detailed SOP for ${relevantDoc.category}`,
          'Check related incidents in the incident tracker',
        ],
      };
    }

    // Simulate streaming delay
    await new Promise((res) => setTimeout(res, 900));
    setIsAITyping(false);
    setRagConversations((prev) => [...prev, assistantMsg]);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.INCIDENTS);
    localStorage.removeItem(STORAGE_KEYS.TRACKER);
    localStorage.removeItem(STORAGE_KEYS.ESCALATIONS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
    localStorage.removeItem(STORAGE_KEYS.RAG_CHATS);

    setIncidents(INITIAL_INCIDENTS);
    setTrackerRecords(INITIAL_TRACKER_RECORDS);
    setDocuments(INITIAL_DOCUMENTS);
    setKnowledgeArticles(INITIAL_ARTICLES);
    setEscalations([
      {
        id: 'esc-1',
        incidentId: 'inc-1',
        ticketId: 'DEMO-INC-0001',
        title: 'PayWave Gateway Merchant Card Authorization Elevated Timeout Rates',
        application: 'PayWave Gateway',
        level: 'L2',
        reason: 'Payment switch response latency > 8500ms exceeding 60-min SLA threshold.',
        notes: 'Draining switch-03 traffic to node-01 and node-02; investigating thread pool exhaustion.',
        escalatedBy: 'Alex Morgan',
        assignedTeam: 'Demo PayWave L3 Engineering',
        owner: 'Priya Sharma',
        escalatedAt: '2026-10-31T17:22:00Z',
        slaExpiresAt: '2026-10-31T18:15:00Z',
        status: 'Active',
      },
    ]);
    setRagConversations([
      {
        id: 'rag-init-1',
        role: 'user',
        content: 'How do I troubleshoot payment gateway failures?',
        timestamp: '2026-10-31T18:00:00Z',
      },
      INITIAL_RAG_CONVERSATIONS[0].response,
    ]);

    addToast('Demo Data Reset', 'All incidents, tracker records, and knowledge restored to default synthetic dataset.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        theme,
        switchRole,
        toggleTheme,
        toasts,
        addToast,
        removeToast,
        applications: INITIAL_APPLICATIONS,
        incidents,
        trackerRecords,
        escalations,
        emailNotifications,
        chatMessages,
        documents,
        knowledgeArticles,
        ragConversations,
        createIncident,
        updateIncident,
        escalateIncident,
        resolveIncident,
        closeIncident,
        createTrackerRecord,
        updateTrackerRecord,
        deleteTrackerRecord,
        sendSimulatedEmail,
        addChatMessage,
        uploadDocument,
        reindexDocument,
        deleteDocument,
        createKnowledgeArticle,
        rateKnowledgeArticle,
        toggleBookmarkArticle,
        sendRAGQuery,
        isAITyping,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
