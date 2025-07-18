// Service for interacting with Firestore orders collection
// Provides helper functions to save and retrieve orders.

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../firebase';
import { db } from '../firebase';

/**
 * Saves an order document in the `orders` collection.
 * @param {Object} order - Order payload
 * @param {string} order.userEmail - Email of the buyer
 * @param {Array}  order.items - Array of cart items { id, name, quantity, price }
 * @param {number} order.total - Total amount in MXN
 * @returns {Promise<string>} Newly created document ID
 */
export const saveOrder = async ({ userEmail, items, total }) => {
  const email = userEmail || auth.currentUser?.email || null;
  if (!email) throw new Error('userEmail is required');
  if (!Array.isArray(items) || items.length === 0) throw new Error('items required');

  const docRef = await addDoc(collection(db, 'orders'), {
    userEmail: email,
    items,
    total,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};
