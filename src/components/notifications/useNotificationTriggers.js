import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addNotification, 
  registerNotificationTrigger,
  selectFiredTriggers,
  selectNotificationHistory
} from '../../player/store';

// Session start time (when the component first mounts)
const useSessionTime = () => {
  const sessionStartRef = useRef(Date.now());
  return sessionStartRef.current;
};

// Hook to trigger notification after delay (in seconds)
const useDelayedNotification = (triggerId, delaySeconds, notification, shouldTrigger = true) => {
  const dispatch = useDispatch();
  const firedTriggers = useSelector(selectFiredTriggers);
  const hasFired = firedTriggers.includes(triggerId);
  
  useEffect(() => {
    if (hasFired || !shouldTrigger) return;
    
    const timer = setTimeout(() => {
      dispatch(addNotification(notification));
      dispatch(registerNotificationTrigger(triggerId));
    }, delaySeconds * 1000);
    
    return () => clearTimeout(timer);
  }, [dispatch, triggerId, delaySeconds, notification, hasFired, shouldTrigger]);
  
  return hasFired;
};

// Check if an email from a specific sender has been opened
const useEmailOpened = (senderId) => {
  // This would need to be connected to the Outbox state
  // For now, we'll use a placeholder that can be enhanced
  const notificationHistory = useSelector(selectNotificationHistory);
  
  // Check if there's been a notification about opening this sender's email
  const hasOpenedEmail = notificationHistory.some(
    n => n.triggerSource === `email-open-${senderId}`
  );
  
  return hasOpenedEmail;
};

// Main hook for session-based notification triggers
export const useSessionNotifications = () => {
  const dispatch = useDispatch();
  const sessionStartTime = useSessionTime();
  
  // Session start triggers (from the spec)
  
  // Calendar reminder after 10s
  useDelayedNotification(
    'session-calendar-reminder',
    10,
    {
      title: 'Calendar Reminder',
      body: '1:1 with Derek Holt — in 20 minutes',
      urgency: 'normal',
      appId: 'executerm',
      deepLink: 'calendar'
    }
  );
  
  // Marcus Flack message after 20s
  useDelayedNotification(
    'session-marcus-flack',
    20,
    {
      senderId: 'marcus',
      title: 'Marcus Webb',
      body: 'Morning mate! Did you get my email btw',
      urgency: 'normal',
      appId: 'flack',
      deepLink: 'dm-marcus'
    }
  );
  
  // Jess Flack message after 45s
  useDelayedNotification(
    'session-jess-flack',
    45,
    {
      senderId: 'jess',
      title: 'Jess Okafor',
      body: 'Hey, you okay? Derek seems stressed this morning lol',
      urgency: 'low',
      appId: 'flack',
      deepLink: 'dm-jess'
    }
  );
  
  // IT Security password expiry after 3 minutes
  useDelayedNotification(
    'session-password-expiry',
    180, // 3 minutes
    {
      title: 'IT Security',
      body: 'Your password expires in 3 days. Update it via the IT portal.',
      urgency: 'low'
    }
  );
  
  // All-Hands reminder after 5 minutes
  useDelayedNotification(
    'session-allhands-reminder',
    300, // 5 minutes
    {
      title: 'Meridian Analytics',
      body: 'Reminder: Q2 All-Hands this Friday 14:00. Please confirm attendance.',
      urgency: 'low'
    }
  );
};

// Hook for Outbox-specific triggers
export const useOutboxNotifications = (isOutboxOpen, outboxState) => {
  const dispatch = useDispatch();
  const firedTriggers = useSelector(selectFiredTriggers);
  const hasMounted = useRef(false);
  
  // First mount trigger: Derek urgent message after 8s
  useEffect(() => {
    if (!isOutboxOpen || hasMounted.current) return;
    
    hasMounted.current = true;
    
    const timer = setTimeout(() => {
      if (!firedTriggers.includes('outbox-derek-first-mount')) {
        dispatch(addNotification({
          senderId: 'derek',
          title: 'Derek Holt',
          body: 'Have you seen my email? Need that update before 10.',
          urgency: 'urgent',
          appId: 'flack',
          deepLink: 'dm-derek'
        }));
        dispatch(registerNotificationTrigger('outbox-derek-first-mount'));
      }
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [isOutboxOpen, dispatch, firedTriggers]);
  
  // 90s session time: Derek chasing email (if player hasn't opened Derek's email)
  // This would need access to email read state - placeholder for now
  useDelayedNotification(
    'outbox-derek-chasing',
    90,
    {
      senderId: 'derek',
      title: 'Derek Holt — chasing',
      body: 'Just circling back on the Vantage status update.',
      urgency: 'urgent',
      appId: 'flack',
      deepLink: 'dm-derek'
    },
    isOutboxOpen // Only trigger if Outbox is open
  );
};

// Hook for Flack-specific triggers
export const useFlackNotifications = (isFlackOpen) => {
  // Flack-specific triggers can be added here
  // Currently session-based triggers handle the main Flack messages
};

// Hook for Synergy-specific triggers
export const useSynergyNotifications = (isSynergyOpen, riskRegisterChanges) => {
  const dispatch = useDispatch();
  const firedTriggers = useSelector(selectFiredTriggers);
  const prevChangesRef = useRef(riskRegisterChanges);
  
  // Watch for risk register status changes to "Closed"
  useEffect(() => {
    if (!isSynergyOpen) return;
    
    // Check if any risk was just marked as closed
    const hasNewClosedRisk = riskRegisterChanges?.some((change, index) => {
      const prev = prevChangesRef.current?.[index];
      return change.status === 'Closed' && prev?.status !== 'Closed';
    });
    
    if (hasNewClosedRisk && !firedTriggers.includes('synergy-risk-closed')) {
      const timer = setTimeout(() => {
        dispatch(addNotification({
          senderId: 'derek',
          title: 'Derek Holt',
          body: 'Risk register looks better. Can you make sure R1 is actually resolved before marking it closed? Priya will ask.',
          urgency: 'normal',
          appId: 'outbox'
        }));
        dispatch(registerNotificationTrigger('synergy-risk-closed'));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    prevChangesRef.current = riskRegisterChanges;
  }, [isSynergyOpen, riskRegisterChanges, dispatch, firedTriggers]);
};

// Hook for IT Support ticket notification (Carl's response)
export const useITSupportNotification = (ticketSubmitted) => {
  const dispatch = useDispatch();
  const firedTriggers = useSelector(selectFiredTriggers);
  
  useEffect(() => {
    if (!ticketSubmitted || firedTriggers.includes('itsupport-carl-response')) return;
    
    const timer = setTimeout(() => {
      dispatch(addNotification({
        senderId: 'carl',
        title: 'Carl Briggs — IT Support',
        body: 'Hi, looked into this. Will update the ticket when I have more info.',
        urgency: 'low'
      }));
      dispatch(registerNotificationTrigger('itsupport-carl-response'));
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [ticketSubmitted, dispatch, firedTriggers]);
};

export default useSessionNotifications;
