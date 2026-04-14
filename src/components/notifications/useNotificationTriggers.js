import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addNotification, 
  registerNotificationTrigger,
  selectFiredTriggers,
  selectNotificationHistory,
  selectGameTime
} from '../../player/store';

// Session start time (when the component first mounts)
const useSessionTime = () => {
  const sessionStartRef = useRef(Date.now());
  return sessionStartRef.current;
};

/**
 * HYBRID PAUSE-AWARE NOTIFICATION
 * 
 * Only fires when game is paused. When game is running, notifications
 * should be driven by game events, not real-time timers.
 * 
 * Used sparingly for atmospheric moments during paused gameplay.
 */
const useHybridPauseNotification = (triggerId, delaySeconds, notification, shouldTrigger = true) => {
  const dispatch = useDispatch();
  const firedTriggers = useSelector(selectFiredTriggers);
  const gameTime = useSelector(selectGameTime);
  const hasFired = firedTriggers.includes(triggerId);
  
  useEffect(() => {
    // Only trigger when:
    // 1. Not already fired
    // 2. shouldTrigger is true
    // 3. Game is PAUSED (hybrid behavior)
    if (hasFired || !shouldTrigger || !gameTime?.isPaused) return;
    
    const timer = setTimeout(() => {
      dispatch(addNotification({
        ...notification,
        triggerSource: 'session'
      }));
      dispatch(registerNotificationTrigger(triggerId));
    }, delaySeconds * 1000);
    
    return () => clearTimeout(timer);
  }, [dispatch, triggerId, delaySeconds, notification, hasFired, shouldTrigger, gameTime?.isPaused]);
  
  return hasFired;
};

/**
 * MESSAGE-DRIVEN NOTIFICATION HOOKS
 * 
 * These hooks watch for actual content arrival and dispatch notifications
 * immediately when messages, emails, or events are received.
 */

// Watch for new Flack DMs and dispatch notifications
export const useFlackMessageNotifications = (flackDMs, previousFlackDMs) => {
  const dispatch = useDispatch();
  const firedTriggers = useSelector(selectFiredTriggers);
  
  useEffect(() => {
    if (!flackDMs || !previousFlackDMs) return;
    
    // Check each participant for new messages
    Object.keys(flackDMs).forEach(participantId => {
      const currentMessages = flackDMs[participantId] || [];
      const previousMessages = previousFlackDMs[participantId] || [];
      
      // Find new messages (present in current but not in previous)
      const newMessages = currentMessages.filter(
        curr => !previousMessages.some(prev => prev.id === curr.id)
      );
      
      newMessages.forEach(message => {
        const triggerId = `flack-${participantId}-${message.id}`;
        
        // Skip if already notified
        if (firedTriggers.includes(triggerId)) return;
        
        // Get first ~50 chars of content
        const preview = message.content.length > 50 
          ? message.content.substring(0, 50) + '...'
          : message.content;
        
        dispatch(addNotification({
          senderId: participantId,
          title: 'New message',
          body: preview,
          urgency: 'normal',
          appId: 'flack',
          deepLink: `dm-${participantId}`,
          triggerSource: 'message',
          relatedId: message.id
        }));
        dispatch(registerNotificationTrigger(triggerId));
      });
    });
  }, [flackDMs, previousFlackDMs, dispatch, firedTriggers]);
};

// Watch for new emails and dispatch notifications
export const useEmailNotifications = (emails, previousEmails) => {
  const dispatch = useDispatch();
  const firedTriggers = useSelector(selectFiredTriggers);
  
  useEffect(() => {
    if (!emails || !previousEmails) return;
    
    // Find new emails (not in previous state)
    const newEmails = emails.filter(
      email => !previousEmails.some(prev => prev.id === email.id)
    );
    
    newEmails.forEach(email => {
      const triggerId = `email-${email.id}`;
      
      // Skip if already notified
      if (firedTriggers.includes(triggerId)) return;
      
      dispatch(addNotification({
        senderId: email.fromId,
        title: email.subject,
        body: `From ${email.fromId}`,
        urgency: email.read ? 'low' : 'normal',
        appId: 'outbox',
        deepLink: `email-${email.id}`,
        triggerSource: 'message',
        relatedId: email.id
      }));
      dispatch(registerNotificationTrigger(triggerId));
    });
  }, [emails, previousEmails, dispatch, firedTriggers]);
};

// Watch for game event changes and dispatch notifications
export const useGameEventNotifications = (lastFiredEventId) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!lastFiredEventId) return;
    
    // Event-specific notifications are handled in the event actions themselves
    // This hook is for any additional global event tracking if needed
    
  }, [lastFiredEventId, dispatch]);
};

// Main hook for hybrid pause-aware notifications
// These ONLY fire when the game is paused (for atmospheric tension)
export const usePauseAwareNotifications = () => {
  // IT Security password expiry - atmospheric, fires when paused
  useHybridPauseNotification(
    'hybrid-password-expiry',
    180, // 3 minutes of paused time
    {
      title: 'IT Security',
      body: 'Your password expires in 3 days. Update it via the IT portal.',
      urgency: 'low'
    }
  );
  
  // All-Hands reminder - atmospheric, fires when paused  
  useHybridPauseNotification(
    'hybrid-allhands-reminder',
    300, // 5 minutes of paused time
    {
      title: 'Meridian Analytics',
      body: 'Reminder: Q2 All-Hands this Friday 14:00. Please confirm attendance.',
      urgency: 'low'
    }
  );
};

// Hook for Outbox-specific notifications
// Now watches for actual email state changes instead of arbitrary timers
export const useOutboxNotifications = (emails, previousEmails) => {
  // Email notifications are handled by useEmailNotifications
  // This hook can be used for Outbox-specific UI notifications if needed
  useEmailNotifications(emails, previousEmails);
};

// Hook for Flack-specific notifications
export const useFlackNotifications = (flackDMs, previousFlackDMs) => {
  // DM notifications are handled by useFlackMessageNotifications
  useFlackMessageNotifications(flackDMs, previousFlackDMs);
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
// Now uses hybrid pause-aware timing - only fires when game is paused
export const useITSupportNotification = (ticketSubmitted) => {
  useHybridPauseNotification(
    'itsupport-carl-response',
    8, // 8 seconds of paused time
    {
      senderId: 'carl',
      title: 'Carl Briggs — IT Support',
      body: 'Hi, looked into this. Will update the ticket when I have more info.',
      urgency: 'low'
    },
    ticketSubmitted
  );
};

// Export all hooks for use in components
export default usePauseAwareNotifications;
