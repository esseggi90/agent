import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
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
      // Reference the workflows subcollection under the agent document
      const workflowsRef = collection(db, 'agents', agentId, 'workflows');
      const unsubscribe = onSnapshot(workflowsRef, 
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
      // Create a new document reference in the workflows subcollection
      const workflowRef = doc(collection(db, 'agents', agentId, 'workflows'));
      const workflowId = workflowRef.id;

      const workflowData = {
        id: workflowId,
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

      await setDoc(workflowRef, workflowData);
      return workflowData;
    } catch (err) {
      console.error('Error creating workflow:', err);
      throw new Error('Failed to create workflow');
    }
  };

  const duplicateWorkflow = async (workflowId: string) => {
    try {
      const workflowRef = doc(db, 'agents', agentId, 'workflows', workflowId);
      const workflowSnap = await getDoc(workflowRef);
      
      if (!workflowSnap.exists()) {
        throw new Error('Workflow not found');
      }

      const originalData = workflowSnap.data();
      const newWorkflowRef = doc(collection(db, 'agents', agentId, 'workflows'));
      
      const duplicatedData = {
        ...originalData,
        id: newWorkflowRef.id,
        name: `${originalData.name} (Copy)`,
        status: 'draft',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(newWorkflowRef, duplicatedData);
      return duplicatedData;
    } catch (err) {
      console.error('Error duplicating workflow:', err);
      throw new Error('Failed to duplicate workflow');
    }
  };

  return { workflows, loading, error, createWorkflow, duplicateWorkflow };
}