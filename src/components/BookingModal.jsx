import React, { useState } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import toast from 'react-hot-toast';

const BookingModal = ({ event, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if there are enough spots available
      if (quantity > (event.capacity - event.currentBookings)) {
        toast.error('Not enough spots available');
        return;
      }

      // Create booking
      const bookingData = {
        eventId: event.id,
        userId: auth.currentUser.uid,
        quantity: quantity,
        totalPrice: event.price * quantity,
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      // Update event's current bookings
      await updateDoc(doc(db, 'events', event.id), {
        currentBookings: event.currentBookings + quantity,
      });

      toast.success('Booking successful!');
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={event.capacity - event.currentBookings}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Available spots: {event.capacity - event.currentBookings}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              Total Price: KES {(event.price * quantity).toLocaleString()}
            </p>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal; 