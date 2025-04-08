import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Loading from './components/Loading';

function App() {
  const [user, loading] = useAuthState(auth);
  const [userRole, setUserRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().userRole);
          } else {
            setUserRole('user');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user');
        }
      } else {
        setUserRole(null);
      }
      setLoadingRole(false);
    };

    fetchUserRole();
  }, [user]);

  if (loading || loadingRole) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} userRole={userRole} />
        <Toaster position="top-right" />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route
              path="/bookings"
              element={user ? <Bookings /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={
                userRole === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin/create-event"
              element={
                userRole === 'admin' ? (
                  <CreateEvent />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;