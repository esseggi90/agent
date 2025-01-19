import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../providers/AuthProvider';
import type { Workspace } from '../types';

export function useWorkspaces() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'workspaces'),
        where('members', 'array-contains', user.uid)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const workspaceData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as Workspace[];
          setWorkspaces(workspaceData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching workspaces:', err);
          setError('Failed to load workspaces');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up workspace listener:', err);
      setError('Failed to load workspaces');
      setLoading(false);
    }
  }, [user]);

  const createWorkspace = async (name: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const workspaceData = {
        name,
        ownerId: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        agentCount: 0
      };

      const docRef = await addDoc(collection(db, 'workspaces'), workspaceData);
      return docRef.id;
    } catch (err) {
      console.error('Error creating workspace:', err);
      throw err;
    }
  };

  return { workspaces, loading, error, createWorkspace };
}