import { User, UserRole } from '../types';

export const DEMO_USERS: Record<UserRole, User> = {
  Admin: {
    id: 'usr-admin-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    department: 'Incident Command & IT Operations',
  },
  'Support Engineer': {
    id: 'usr-support-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'Support Engineer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    department: 'Tier-2 Application Engineering',
  },
  Manager: {
    id: 'usr-mgr-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    department: 'Enterprise Service Delivery',
  },
  Employee: {
    id: 'usr-emp-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    role: 'Employee',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    department: 'Digital Banking Operations',
  },
};
