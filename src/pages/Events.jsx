import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { format } from 'date-fns';
import Loading from '../components/Loading';
import BookingModal from '../components/BookingModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                <p className="text-gray-600">
                  <span className="font-medium">Available:</span>{' '}
                  {event.capacity - event.currentBookings} of {event.capacity} spots
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(event)}
                disabled={!auth.currentUser || event.capacity <= event.currentBookings}
                className={`mt-6 w-full py-2 px-4 rounded-md font-medium ${
                  !auth.currentUser
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : event.capacity <= event.currentBookings
                    ? 'bg-red-300 text-red-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {!auth.currentUser
                  ? 'Sign in to book'
                  : event.capacity <= event.currentBookings
                  ? 'Sold Out'
                  : 'Book Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Events; 