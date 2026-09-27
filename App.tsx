import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScreeningProvider, useScreening } from './context/ScreeningContext';
import { Navbar } from './components/Navbar';
import { LoginPortal } from './pages/LoginPortal';
import { Dashboard } from './pages/Dashboard';
import { NewScreening } from './pages/NewScreening';
import { ClinicianPacs } from './pages/ClinicianPacs';
import { ScreeningHistory } from './pages/ScreeningHistory';
import { DistrictAnalytics } from './pages/DistrictAnalytics';
import { AboutPage } from './pages/AboutPage';
import { ComprehensiveReport } from './components/ComprehensiveReport';
import { PatientSmsPanel } from './components/PatientSmsPanel';
import { LOGO_ASSET_PATH } from './services/sampleData';
import { Eye, ShieldCheck, Heart } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const { currentCase, cases, setCurrentCase } = useScreening();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  if (!isAuthenticated) {
    return <LoginPortal />;
  }

  const handleSelectCaseFromDashboard = (caseId: string) => {
    const matched = cases.find((c) => c.id === caseId);
    if (matched) {
      setCurrentCase(matched);
      setCurrentTab('reports');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 3-Zone Navigation Header */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNavigate={setCurrentTab}
            onSelectCase={handleSelectCaseFromDashboard}
          />
        )}

        {currentTab === 'new_screening' && <NewScreening />}

        {currentTab === 'pacs' && <ClinicianPacs />}

        {currentTab === 'history' && <ScreeningHistory />}

        {currentTab === 'reports' && currentCase && (
          <div className="space-y-6">
            <ComprehensiveReport screeningCase={currentCase} />
          </div>
        )}

        {currentTab === 'follow_up' && currentCase && (
          <div className="space-y-6">
            <PatientSmsPanel screeningCase={currentCase} />
          </div>
        )}

        {currentTab === 'analytics' && <DistrictAnalytics />}

        {currentTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {LOGO_ASSET_PATH ? (
              <img
                src={LOGO_ASSET_PATH}
                alt="IRISaathi"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-md object-contain bg-slate-900 p-0.5"
              />
            ) : null}
            <div>
              <span className="font-bold text-slate-800">{t.brandName}</span>
              <span className="text-slate-400 mx-1.5">·</span>
              <span>{t.brandFullName}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
            {user && (
              <div className="flex items-center gap-2">
                <span>Active: <strong className="text-slate-700 font-sans">{user.name}</strong> ({user.role})</span>
                <span>·</span>
                <button
                  onClick={logout}
                  className="text-rose-600 hover:text-rose-700 underline font-sans cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
            <span>·</span>
            <span>{t.repSectionDisclaimer}: AI-assisted decision support.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ScreeningProvider>
          <MainAppContent />
        </ScreeningProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
