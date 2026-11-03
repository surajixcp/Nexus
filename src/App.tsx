import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/ui/ToastContainer';

// Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { IncidentListPage } from './pages/incidents/IncidentListPage';
import { CreateIncidentPage } from './pages/incidents/CreateIncidentPage';
import { IncidentTrackerPage } from './pages/tracker/IncidentTrackerPage';
import { EscalationCenterPage } from './pages/escalations/EscalationCenterPage';
import { EmailNotificationsPage } from './pages/notifications/EmailNotificationsPage';
import { CollaborationPage } from './pages/collaboration/CollaborationPage';
import { ApplicationsPage } from './pages/applications/ApplicationsPage';
import { AIAssistantPage } from './pages/ai-assistant/AIAssistantPage';
import { KnowledgeDashboardPage } from './pages/knowledge-base/KnowledgeDashboardPage';
import { DocumentLibraryPage } from './pages/knowledge-base/DocumentLibraryPage';
import { AIKnowledgeChatPage } from './pages/knowledge-base/AIKnowledgeChatPage';
import { SemanticSearchPage } from './pages/knowledge-base/SemanticSearchPage';
import { KnowledgeArticlesPage } from './pages/knowledge-base/KnowledgeArticlesPage';
import { KnowledgeAnalyticsPage } from './pages/knowledge-base/KnowledgeAnalyticsPage';
import { AdminPage } from './pages/admin/AdminPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { LoginPage } from './pages/auth/LoginPage';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full bg-[#07090e] dark:bg-[#07090e] overflow-hidden text-slate-100 antialiased">
      {/* Responsive Sidebar */}
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto bg-[#090c13] dark:bg-[#090c13]">
          {children}
        </main>
      </div>

      {/* Global floating toast alerts */}
      <ToastContainer />
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();

  // Handle ?autostart=1 or regular session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Default to true for presentation demo flow unless explicitly navigated to /login
    return true;
  });

  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />}
      />

      {/* Protected Layout Routes */}
      <Route
        path="/"
        element={
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        }
      />
      <Route
        path="/incidents"
        element={
          <MainLayout>
            <IncidentListPage />
          </MainLayout>
        }
      />
      <Route
        path="/create-incident"
        element={
          <MainLayout>
            <CreateIncidentPage />
          </MainLayout>
        }
      />
      <Route
        path="/tracker"
        element={
          <MainLayout>
            <IncidentTrackerPage />
          </MainLayout>
        }
      />
      <Route
        path="/escalations"
        element={
          <MainLayout>
            <EscalationCenterPage />
          </MainLayout>
        }
      />
      <Route
        path="/emails"
        element={
          <MainLayout>
            <EmailNotificationsPage />
          </MainLayout>
        }
      />
      <Route
        path="/collaboration"
        element={
          <MainLayout>
            <CollaborationPage />
          </MainLayout>
        }
      />
      <Route
        path="/applications"
        element={
          <MainLayout>
            <ApplicationsPage />
          </MainLayout>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <MainLayout>
            <AIAssistantPage />
          </MainLayout>
        }
      />
      <Route
        path="/knowledge"
        element={
          <MainLayout>
            <KnowledgeDashboardPage />
          </MainLayout>
        }
      />
      <Route
        path="/knowledge/documents"
        element={
          <MainLayout>
            <DocumentLibraryPage />
          </MainLayout>
        }
      />
      <Route
        path="/knowledge/chat"
        element={
          <MainLayout>
            <AIKnowledgeChatPage />
          </MainLayout>
        }
      />
      <Route
        path="/knowledge/search"
        element={
          <MainLayout>
            <SemanticSearchPage />
          </MainLayout>
        }
      />
      <Route
        path="/knowledge/articles"
        element={
          <MainLayout>
            <KnowledgeArticlesPage />
          </MainLayout>
        }
      />
      <Route
        path="/knowledge/analytics"
        element={
          <MainLayout>
            <KnowledgeAnalyticsPage />
          </MainLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <MainLayout>
            <AdminPage />
          </MainLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <MainLayout>
            <SettingsPage />
          </MainLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
