import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { WorkflowData } from '../types';

export function useWorkflows(agentId: string) {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setWorkflows([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'workflows'),
        where('agentId', '==', agentId)
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const workflowData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as WorkflowData[];
          setWorkflows(workflowData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching workflows:', err);
          setError('Failed to load workflows');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up workflow listener:', err);
      setError('Failed to load workflows');
      setLoading(false);
    }
  }, [agentId]);

  const createWorkflow = async (data: Partial<WorkflowData>) => {
    if (!agentId) throw new Error('Agent ID is required');

    try {
      const docRef = doc(collection(db, 'workflows'));
      const docId = docRef.id;

      const workflowData = {
        id: docId,
        name: data.name,
        description: data.description,
        type: data.type,
        visibility: data.visibility,
        status: 'draft',
        agentId,
        nodes: [],
        edges: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, workflowData);
      return workflowData;
    } catch (err) {
      console.error('Error creating workflow:', err);
      throw new Error('Failed to create workflow');
    }
  };

  return { workflows, loading, error, createWorkflow };
}