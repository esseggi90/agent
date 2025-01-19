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

  const createWorkspace = async (data: { name: string; description: string; icon: string }) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      // Validate required fields
      if (!data.name?.trim()) {
        throw new Error('Workspace name is required');
      }
      if (!data.description?.trim()) {
        throw new Error('Workspace description is required');
      }
      if (!data.icon?.trim()) {
        throw new Error('Workspace icon is required');
      }

      const timestamp = serverTimestamp();
      const workspaceData = {
        name: data.name.trim(),
        description: data.description.trim(),
        icon: data.icon.trim(),
        ownerId: user.uid,
        members: [user.uid],
        createdAt: timestamp,
        updatedAt: timestamp,
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