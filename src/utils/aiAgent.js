import { eventData } from '../data/eventData.js';
import { attendeeData } from '../data/attendeeData.js';
import { getAIReasoning } from './gemini.js';

/**
 * Fast, local matching logic that takes a user profile input
 * and returns recommended sessions and natural language navigation details.
 */
export const performSmartMatching = (userText, userProfile = null) => {
   const text = (userText || "").toLowerCase();
   const profileInterests = userProfile?.interests || [];
   const profileBio = (userProfile?.bio || "").toLowerCase();

  const scores = eventData.map(event => {
    let score = 0;
    
    // Default fallback weight
    if (event.type === 'Networking') {
      score = 0.5;
    }

    if (event.techStack) {
      event.techStack.forEach(tech => {
        if (text.includes(tech.toLowerCase())) {
          score += 10;
        }
      });
      if ((text.includes('backend') || text.includes('server')) && event.techStack.includes('Backend')) score += 5;
      if ((text.includes('frontend') || text.includes('ui') || text.includes('web') || text.includes('react')) && event.techStack.includes('Frontend')) score += 5;
      if ((text.includes('llm') || text.includes('machine learning') || text.includes('openai') || text.includes('ai')) && event.techStack.includes('AI')) score += 5;
       if ((text.includes('java') || text.includes('spring')) && event.techStack.includes('Java')) score += 5;
    }
    
    // Add weights from User Profile Interests
    profileInterests.forEach(interest => {
       if (event.techStack && event.techStack.includes(interest)) score += 8;
       if (event.focus && event.focus.includes(interest)) score += 8;
       if (text.includes(interest.toLowerCase())) score += 2; // Extra boost if they mention it again
    });

    if (profileBio) {
        if (profileBio.includes('senior') || profileBio.includes('lead')) {
            if (event.title.toLowerCase().includes('advanced') || event.title.toLowerCase().includes('deep dive')) score += 3;
        }
    }
    
    if (event.focus) {
      event.focus.forEach(f => {
        if (text.includes(f.toLowerCase())) {
          score += 5;
        }
      });
    }

    return { ...event, matchScore: score };
  });

  const recommendations = scores.filter(e => e.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);
  
  if (recommendations.length === 0) {
    return [...eventData].sort((a, b) => a.timeRaw.localeCompare(b.timeRaw));
  }

  return recommendations.sort((a, b) => a.timeRaw.localeCompare(b.timeRaw));
};

export const getNavigationDirection = (recommendedSessions) => {
  if (!recommendedSessions || recommendedSessions.length === 0) {
    return "I recommend starting at the main registration desk to grab your badge and mingle!";
  }
  
  const topSession = recommendedSessions[0];
  
  const navigationalPhrases = {
    "Room A": "down the left hallway from the main entrance",
    "Main Ballroom": "straight ahead on the first floor next to the cafeteria",
    "Hall C": "in the East Wing, take the stairs to the second floor",
    "Rooftop Lounge": "on the top floor, accessible via the glass elevators"
  };

  const navText = navigationalPhrases[topSession.room] || "nearby";

  return `The ${topSession.title} is in ${topSession.room}, which is located ${navText}.`;
};

// V2 Event Pulse Q&A
export const performEventPulseQA = (input) => {
  const text = input.toLowerCase();
  
  // Try to find if user is asking about a specific session's core points / summary
  const targetSession = eventData.find(e => {
    const titleKeywords = e.title.toLowerCase().split(" ").filter(w => w.length > 3);
    // e.g. "java", "streams", "generative", "ai", "react", "server"
    return titleKeywords.some(keyword => text.includes(keyword)) || 
          (e.techStack && e.techStack.some(tech => text.includes(tech.toLowerCase())));
  });

  if (targetSession && (text.includes("miss") || text.includes("point") || text.includes("summary") || text.includes("takeaway") || text.includes("what") || text.includes("about") || text.includes("details"))) {
    return `For "${targetSession.title}", here are the live key takeaways so far:\n• ${targetSession.keyTakeaways.join("\n• ")}`;
  }

  return null; // Means it's not a Q&A query, proceed to normal matching
};

// V2 Smart Networking Matchmaker
export const findMyPeers = (userText) => {
  if (!userText) return [];
  const text = userText.toLowerCase();
  
  const scoredPeers = attendeeData.map(peer => {
    let score = 0;
    peer.interests.forEach(interest => {
      if (text.includes(interest.toLowerCase())) {
        score += 10;
      }
    });

    if (text.includes(peer.role.toLowerCase())) score += 5;
    
    // Add fuzzy logic matching for groups
    if (text.includes('frontend') && peer.interests.includes('React')) score += 5;
    if (text.includes('backend') && peer.interests.includes('Java')) score += 5;
    if (text.includes('ai') && peer.interests.includes('Machine Learning')) score += 5;

    return { ...peer, matchScore: score };
  });

  // Return Top 3 genuine matches (score >= 10 to ensure high-quality networking)
  return scoredPeers.filter(p => p.matchScore >= 10).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
};

export const sanitizeInput = (str) => {
    return str.replace(/[^\w\s.,?!-]/gi, '').trim();
}
