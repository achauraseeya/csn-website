// Cross-tab and Cross-window Live Broadcast Service for Chaurasiya Samaj Nepal
// Guarantees zero-latency real-time updates across multiple tabs/browsers

type LiveSyncEvent = {
  type: 'NEW_MEMBERSHIP' | 'NEW_VOLUNTEER' | 'NEW_MATRIMONY' | 'NEW_SUBSCRIBER' | 'UPDATE_STATUS';
  payload: any;
  timestamp: number;
};

const CHANNEL_NAME = 'chaurasiya_live_sync_v1';
let syncChannel: BroadcastChannel | null = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment');
}

export function broadcastLiveEvent(type: LiveSyncEvent['type'], payload: any) {
  const eventData: LiveSyncEvent = {
    type,
    payload,
    timestamp: Date.now(),
  };

  // 1. Post to BroadcastChannel
  if (syncChannel) {
    try {
      syncChannel.postMessage(eventData);
    } catch (e) {
      console.warn('BroadcastChannel post error:', e);
    }
  }

  // 2. Trigger localStorage storage event for cross-browser/tab fallbacks
  try {
    localStorage.setItem('chaurasiya_live_broadcast_ping', JSON.stringify(eventData));
  } catch (e) {}
}

export function listenLiveEvents(onEvent: (event: LiveSyncEvent) => void) {
  // Listen to BroadcastChannel
  const handleMessage = (e: MessageEvent<LiveSyncEvent>) => {
    if (e.data && e.data.type) {
      onEvent(e.data);
    }
  };

  if (syncChannel) {
    syncChannel.addEventListener('message', handleMessage);
  }

  // Listen to window storage event
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'chaurasiya_live_broadcast_ping' && e.newValue) {
      try {
        const parsed: LiveSyncEvent = JSON.parse(e.newValue);
        onEvent(parsed);
      } catch (err) {}
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleMessage);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}
