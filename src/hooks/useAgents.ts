import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Agent } from '../types';

export function useAgents(workspaceId: string) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setAgents([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'agents'),
        where('workspaceId', '==', workspaceId)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const agentData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            lastEdited: doc.data().lastEdited?.toDate()
          })) as Agent[];
          setAgents(agentData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching agents:', err);
          setError('Failed to load agents');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up agent listener:', err);
      setError('Failed to load agents');
      setLoading(false);
    }
  }, [workspaceId]);

  const createAgent = async (data: Partial<Agent>) => {
    if (!workspaceId) throw new Error('Workspace ID is required');

    try {
      // Create a reference to a new document with auto-generated ID
      const docRef = doc(collection(db, 'agents'));
      const docId = docRef.id;

      const agentData = {
        id: docId, // Use the document ID
        name: data.name,
        description: data.description,
        type: data.type,
        visibility: data.visibility,
        icon: data.icon || 'bot',
        status: 'draft',
        workspaceId,
        lastEdited: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      // Save the document with the same ID
      await setDoc(docRef, agentData);
      return agentData;
    } catch (err) {
      console.error('Error creating agent:', err);
      throw new Error('Failed to create agent');
    }
  };

  return { agents, loading, error, createAgent };
}