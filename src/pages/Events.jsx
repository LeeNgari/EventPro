import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format } from 'date-fns';
import Loading from '../components/Loading';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, 'events'),
          where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
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
                  {event.price.toLocaleString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Available Spots:</span>{' '}
                  {event.capacity - event.currentBookings}
                </p>
              </div>
              <button
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // TODO: Implement booking functionality
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <p className="text-center text-gray-600">No events available at the moment.</p>
      )}
    </div>
  );
};

export default Events; 