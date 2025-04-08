import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format } from 'date-fns';
import Loading from '../components/Loading';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const q = query(
          collection(db, 'events'),
          where('status', '==', 'active'),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedEvents(eventsData);
      } catch (error) {
        console.error('Error fetching featured events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Welcome to EventPro
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Discover and book amazing events in your area
            </p>
            <div className="mt-10">
              <Link
                to="/events"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span>{' '}
                    {format(new Date(event.dateTime), 'PPP')}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time:</span>{' '}
                    {format(new Date(event.dateTime), 'p')}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price:</span> KES{' '}
                    {event.price ? event.price.toLocaleString() : '0'}
                  </p>
                </div>
                <Link
                  to="/events"
                  className="mt-6 block text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        {featuredEvents.length === 0 && (
          <p className="text-center text-gray-600">No featured events at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Home; 