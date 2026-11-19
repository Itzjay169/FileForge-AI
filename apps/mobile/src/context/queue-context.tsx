import React, { createContext, useContext, useState, useEffect } from 'react';
import { MobileQueueItem } from '@fileforge/shared';

interface QueueContextType {
  queue: MobileQueueItem[];
  offlineQueueEnabled: boolean;
  setOfflineQueueEnabled: (enabled: boolean) => void;
  addToQueue: (
    item: Omit<MobileQueueItem, 'id' | 'status' | 'progress' | 'retryCount' | 'createdAt'>
  ) => MobileQueueItem;
  retryItem: (id: string) => void;
  cancelItem: (id: string) => void;
  clearCompleted: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<MobileQueueItem[]>([
    {
      id: 'q_demo_01',
      fileName: 'cinematic-shot-4k.mov',
      fileSize: 84000000,
      localUri: 'file:///storage/emulated/0/DCIM/Camera/cinematic-shot-4k.mov',
      mimeType: 'video/quicktime',
      operation: 'COMPRESS',
      options: { preset: 'WHATSAPP_READY' },
      status: 'PROCESSING',
      progress: 68,
      retryCount: 0,
      createdAt: Date.now() - 15000
    }
  ]);
  const [offlineQueueEnabled, setOfflineQueueEnabled] = useState(true);

  // Background queue processing simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue((prevQueue) =>
        prevQueue.map((item) => {
          if (item.status === 'PROCESSING') {
            const nextProgress = item.progress + 15;
            if (nextProgress >= 100) {
              return {
                ...item,
                progress: 100,
                status: 'COMPLETED',
                resultUrl: `https://fileforge.studio/api/files/download?key=2026-11-19/processed-${item.fileName}`
              };
            }
            return { ...item, progress: nextProgress };
          }
          if (item.status === 'QUEUED') {
            return { ...item, status: 'PROCESSING', progress: 10 };
          }
          return item;
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const addToQueue = (
    item: Omit<MobileQueueItem, 'id' | 'status' | 'progress' | 'retryCount' | 'createdAt'>
  ): MobileQueueItem => {
    const newItem: MobileQueueItem = {
      ...item,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'QUEUED',
      progress: 0,
      retryCount: 0,
      createdAt: Date.now()
    };
    setQueue((prev) => [newItem, ...prev]);
    return newItem;
  };

  const retryItem = (id: string) => {
    setQueue((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: 'QUEUED', progress: 0, retryCount: i.retryCount + 1, error: undefined } : i
      )
    );
  };

  const cancelItem = (id: string) => {
    setQueue((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((i) => i.status !== 'COMPLETED'));
  };

  return (
    <QueueContext.Provider
      value={{
        queue,
        offlineQueueEnabled,
        setOfflineQueueEnabled,
        addToQueue,
        retryItem,
        cancelItem,
        clearCompleted
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue must be used within a QueueProvider');
  return context;
};
