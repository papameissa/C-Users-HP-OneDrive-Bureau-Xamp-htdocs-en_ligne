import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './components/Home/HomePage';
import EventsPage from './components/Events/EventsPage';
import EventDetail from './components/Events/EventDetail';
import CreateEvent from './components/Events/CreateEvent';
import DirectoryPage from './components/Directory/DirectoryPage';
import ProfileDetail from './components/Directory/ProfileDetail';
import SpacesPage from './components/Spaces/SpacesPage';
import SpaceDetail from './components/Spaces/SpaceDetail';
import MessagesPage from './components/Messages/MessagesPage';
import ProfilePage from './components/Profile/ProfilePage';
import SettingsPage from './components/Settings/SettingsPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AuthPage from './components/Auth/AuthPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="events/create" element={<CreateEvent />} />
              <Route path="directory" element={<DirectoryPage />} />
              <Route path="directory/:id" element={<ProfileDetail />} />
              <Route path="spaces" element={<SpacesPage />} />
              <Route path="spaces/:id" element={<SpaceDetail />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;