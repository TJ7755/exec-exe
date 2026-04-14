import { NPC } from '../types';

export const meridianNPCs: NPC[] = [

  {
    id: 'nathaniel',
    name: 'Nathaniel Willers',
    firstName: 'Nathaniel',
    role: 'Head of Asset Data Management',
    department: 'Asset Data Management',
    avatarColour: '#7B68EE',
    email: 'n.willers@meridian-is.co.uk',
    extension: '301',
    voice: `Nathaniel speaks with tremendous confidence about things he does not
      understand. He uses technical-sounding phrases incorrectly. He has never
      opened the spreadsheets he oversees. He was promoted because he is very
      good at presenting to people who also do not understand the spreadsheets.
      He believes the dashboards represent reality. He is the player's direct
      manager.`,
    onlineStatus: 'online',
    responseSpeed: 1.5,
    responseStyle: 'verbose',
    responses: {
      mon_task_acknowledged_committed: {
        mainResponse: {
          positive: ["You can start right away. I've sent you the file access. Let me know if you need any guidance.", "Start when you're ready. The data is available in Synergy Drive. I'm happy to walk you through it.", "Begin immediately. This is important work and I appreciate your proactive approach."],
          neutral: ["Start when you're ready. The files are available in Synergy Drive.", "You can begin now. Let me know if you have questions.", "The data is ready. Get started when convenient."],
          negative: ["Start now. I expect an update by end of day.", "Begin immediately. Don't delay.", "Get to work. I need this done."]
        }
      },
      mon_task_acknowledged_questioned: {
        mainResponse: {
          positive: ["Sheet A is what the hospitals say they have, Sheet B is what we say they have. Your job is to make them agree. Simple as that. Let me know if you need clarification.", "The goal is alignment between the two data sources. Sheet A represents the hospital's view, Sheet B represents ours. Happy to explain further.", "We need the two sheets to match. Hospital register versus our MIS records. Any other questions?"],
          neutral: ["Sheet A is the hospital register, Sheet B is our MIS records. We need them to match.", "Your task is to reconcile the two data sources. Hospital data versus ours.", "Align Sheet A and Sheet B. Hospital records on one side, ours on the other."],
          negative: ["Align the data. Don't overthink it. Sheet A to Sheet B.", "Just make them match. Hospital records to ours. Simple.", "Get the numbers aligned. That's the job."]
        }
      },
      mon_task_acknowledged_pushed_back: {
        mainResponse: {
          positive: ["The process is well-established and has been refined over years. Trust the process for now, and we can discuss methodology refinements once you've completed a few reconciliations.", "We have established procedures for a reason. Follow them first, then we can discuss improvements. Your input will be valuable once you have experience.", "The methodology works. Focus on alignment for now, and we can discuss potential refinements after you've gone through the process."],
          neutral: ["The process is well-established. Focus on alignment for now. We can review the methodology later.", "Stick to the established approach. Methodology discussions can wait until you've completed the task.", "Follow the standard process. We can discuss refinements after you're done."],
          negative: ["Don't overcomplicate this. The process works. Just follow it.", "We don't need to question everything right now. Just do the work as specified.", "Just follow the procedure. That's what matters."]
        }
      },
      mon_derek_asked_what_matters: {
        mainResponse: {
          positive: ["What matters is the dashboard stays green. Everything else is process.", "The dashboard is our key metric. Green is the target.", "Dashboard status is what we're measured on. Keep it green."],
          neutral: ["The dashboard is the priority. Process supports that.", "Green dashboard is the goal. Everything else supports that.", "Focus on the dashboard. That's what leadership looks at."],
          negative: ["Dashboard green. That's it. Don't overthink.", "The dashboard. Keep it green. Simple.", "Process doesn't matter if the dashboard isn't green."]
        }
      },
      mon_nathaniel_truth_response: {
        mainResponse: {
          positive: ["I appreciate your integrity. Leave it with me. For now, let's focus on getting the dashboard to where it needs to be.", "Your honesty is noted. I'll handle the broader implications. You focus on the dashboard.", "Thank you for being truthful. Let me address the underlying issue. Your priority is the dashboard."],
          neutral: ["I see. Leave it with me. For now, focus on the dashboard.", "I'll look into this. Dashboard remains the priority.", "We'll address this separately. Keep working on the dashboard."],
          negative: ["Focus on the dashboard. I'll handle the rest.", "Don't worry about that now. Dashboard first.", "Leave the bigger picture to me. Just get the dashboard right."]
        }
      },
      tue_nathaniel_standup_honest: {
        mainResponse: {
          positive: ["I appreciate your honesty, but let's take this offline. I don't want to escalate anything unnecessarily without understanding the full picture.", "Thank you for being upfront. We should discuss this separately. Not for the standup.", "Good to know. Let me get more context before we escalate anything."],
          neutral: ["Take that offline. We'll discuss later.", "Not the right forum for this. Let's talk separately.", "We'll address this outside the standup."],
          negative: ["Offline. Not now.", "We'll discuss this later. Not here.", "Take this offline please."]
        }
      },
      tue_nathaniel_standup_green: {
        mainResponse: {
          positive: ["That's exactly what I like to hear. Good work.", "This is the standard I expect. Well done.", "You're delivering exactly what we need. Keep it up."],
          neutral: ["Good progress on the dashboard.", "Dashboard is looking good. Continue.", "That's the right approach. Carry on."],
          negative: ["Good. Keep it up.", "Dashboard is green. That's what matters.", "Acceptable. Maintain this."]
        }
      },
      tue_nathaniel_standup_deflect: {
        mainResponse: {
          positive: ["Do get up to speed quickly — we need everyone pulling their weight this week.", "Focus on getting familiar with the work. We need full effort.", "Come up to speed fast. The team needs you fully operational."],
          neutral: ["Get up to speed quickly. We need everyone contributing.", "Focus on learning the role quickly. Important week.", "We need you fully operational soon. Important deadlines."],
          negative: ["Get up to speed. We can't carry passengers.", "You need to be productive quickly. No time for learning curve.", "Pull your weight or we'll have issues."]
        }
      },
      mon_reconciliation_changed_numbers: {
        mainResponse: {
          positive: ["Good work. The dashboard is Green now. Keep this momentum going with the next site.", "Excellent. That's exactly what I needed. I appreciate the efficiency.", "Well done. This is the standard I expect. Moving forward."],
          neutral: ["Dashboard is Green. Good work. Move on to the next site.", "Green achieved. Proceed with the next reconciliation.", "Good. Continue with the next site."],
          negative: ["It's Green. That's what matters. Next site.", "Green. Moving on.", "Done. Next."]
        }
      },
      mon_reconciliation_flagged_discrepancy: {
        mainResponse: {
          positive: ["Your diligence is noted. Rosa mentioned she appreciated your thoroughness. Next time, let's aim for Green while maintaining that documentation.", "Good documentation. Let's discuss how to avoid Amber outcomes going forward while still being thorough.", "I appreciate the professional approach to the discrepancies. The documentation is valuable, but we need to work toward Green."],
          neutral: ["You flagged discrepancies. That's thorough, but the dashboard is Amber. Next time, aim for Green.", "Documented discrepancies. Not the target, but noted. We need Green going forward.", "Thorough work, but wrong outcome. Dashboard is Amber. Need Green."],
          negative: ["You missed the target. Dashboard is Amber. The goal is Green.", "Too thorough. We need Green, not documentation.", "Wrong outcome. Need Green."]
        }
      },
      mon_reconciliation_asked_for_help: {
        mainResponse: {
          positive: ["Good initiative. Rosa mentioned she was happy to help. Continue building relationships with the team.", "Smart approach to leverage Rosa's experience. Let me know what you learn from her.", "Good use of team resources. Continue collaborating and building your network."],
          neutral: ["You consulted Rosa. That's a good use of available resources.", "Good to ask for help when needed. Continue building relationships.", "Rosa has valuable context. Good to leverage that."],
          negative: ["Should be able to handle this independently.", "Don't always go to others first.", "Build your own capability."]
        }
      },
      mon_reconciliation_honest: {
        mainResponse: {
          positive: ["I appreciate your integrity. We need the dashboard Green, but I respect that you prioritized accuracy. Let's discuss how to achieve both.", "Your honesty is noted, even if it missed the target. Integrity is valuable. Let's work on achieving Green while maintaining it."],
          neutral: ["I see you chose honesty over the dashboard target. We need the dashboard Green, but I appreciate the principle. Let's discuss the approach."],
          negative: ["I asked for Green, not honesty. You missed the point of the task. Dashboard Green is the goal."]
        }
      },
      mon_nathaniel_queries_amber: {
        mainResponse: {
          positive: ["I appreciate you flagged the discrepancies rather than forcing alignment. Your integrity is noted. Let's discuss how to get to Green while maintaining data integrity.", "Good documentation of the issues. I can work with Amber when it's documented like this. Let's address the discrepancies together."],
          neutral: ["You flagged discrepancies rather than forcing alignment. Not the outcome I wanted, but the documentation is useful. We need to work on getting to Green."],
          negative: ["This is not the result I needed. The dashboard should be Green. You missed the target."]
        }
      },
      mon_nathaniel_queries_amber_blame_process: {
        mainResponse: {
          positive: ["Understood. The hospital's data was incomplete. That happens. We'll work with what we have and document the constraints.", "Thanks for the context. We'll note the hospital data issues and move forward with the reconciliation."],
          neutral: ["Noted. Hospital data issues are common. We'll document this and proceed."],
          negative: ["This sounds like an excuse. We need to work with what we have and get the dashboard Green."]
        }
      },
      tue_nathaniel_standup_amber: {
        mainResponse: {
          positive: ["Amber with documentation. I can work with that. Let's discuss a path to Green.", "Professional approach. Good documentation of the issues. We'll address them together."],
          neutral: ["Dashboard is Amber. Not ideal, but it's documented. We need to work on getting this to Green."],
          negative: ["I asked for Green, not Amber. This is not acceptable. Get this to Green."]
        }
      }
    }
  },

  {
    id: 'claire',
    name: 'Claire Talker',
    firstName: 'Claire',
    role: 'Programme Director, Digital Infrastructure',
    department: 'NHS England',
    avatarColour: '#2E8B57',
    email: 'c.talker@nhsengland.nhs.uk',
    extension: null,
    voice: `Claire is the client. She is meticulous, political, and has learned
      that the best way to protect herself is to keep her requirements vague until
      a deliverable is submitted, then change them. She has always done this
      maliciously — but she genuinely believes her new requirements were always the
      requirements once she changes them a couple times. She is the most dangerous person in the game.`,
    onlineStatus: 'away',
    responseSpeed: 2.0,
    responseStyle: 'evasive',
    responses: {
      tue_claire_agreed_xml: {
        mainResponse: {
          positive: ["Thank you for confirming promptly. I'll send through the specification document for your reference. Please ensure the next submission is in the correct XML format.", "I appreciate your cooperation. The specification document will be sent. Please follow it precisely for future submissions."],
          neutral: ["Confirmation received. The specification document is being sent. Please use it for the next submission to ensure correct format."],
          negative: ["Finally. I'll send the specification. Please ensure you actually read it this time - I expect the next submission to be in the correct format."]
        }
      },
      tue_claire_asked_spec: {
        mainResponse: {
          positive: ["Of course. I'll circulate the specification document. It's 47 pages but the relevant sections for XML export are clearly marked. Let me know if you have questions.", "Certainly. The specification is 47 pages. I'll highlight the XML export sections for you. Please review and reach out with questions."],
          neutral: ["Request for specification received. I'll circulate the specification document - the relevant sections are marked for XML export."],
          negative: ["You should have this already. It was circulated last month. I'll re-send the specification - please review it thoroughly this time."]
        }
      },
      tue_claire_challenged: {
        mainResponse: {
          positive: ["I understand your concern. The standards update was circulated to all MSPs last month as part of the Digital Infrastructure programme. I'll re-send it to ensure you have it on record.", "Fair point. This was part of the Digital Infrastructure programme update last month. I'm re-sending for your records."],
          neutral: ["Concern noted. The standards update was circulated last month. I'll re-send it for your reference."],
          negative: ["This is not a new requirement. It was circulated to all MSPs last month. You should have this already in your records."]
        }
      },
      tue_claire_preview_spec: {
        mainResponse: {
          positive: ["I appreciate you reviewing the specification before committing. The specification is comprehensive - take the time you need to understand the XML export requirements. I'll await your response.", "Good to ensure you understand requirements before proceeding. The XML requirements are detailed - let me know when you're ready to proceed."],
          neutral: ["You're reviewing the specification before committing. The specification is available for review - the XML export sections are clearly marked."],
          negative: ["You should have already reviewed this. The specification should have been reviewed already - please expedite your review and respond promptly."]
        }
      }
    }
  },

  {
    id: 'james',
    name: 'James Siren',
    firstName: 'James',
    role: 'Chief Operating Officer',
    department: 'Executive',
    avatarColour: '#2C3E50',
    email: 'j.siren@meridian-is.co.uk',
    extension: '101',
    voice: `James speaks exclusively in the register of a Church of England
      bishop delivering a sermon at a Cambridge college chapel. Every sentence
      contains at minimum one classical or biblical allusion. He is authoritarian
      in the way that only people who believe they are being reasonable can be.
      He uses phrases like "I think we can all agree" before stating things that
      nobody agreed to. He has extremely strong opinions about process, hierarchy,
      and the correct way to format a spreadsheet. He genuinely believes he is
      a good person and a good leader. He is neither.`,
    onlineStatus: 'online',
    responseSpeed: 2.0,
    responseStyle: 'religious',
    responses: {
      tue_siren_truth_response: {
        mainResponse: {
          positive: ["I appreciate candour. The truth, however uncomfortable, is always preferable to the comfortable lie. Your integrity in this matter is noted. Let us ensure the record reflects reality going forward.", "Your honesty is commendable. Truth is the foundation of our work. I am pleased by your commitment to truth. We must maintain accurate records."],
          neutral: ["I see. The truth is the foundation of our work. Your integrity in this matter is noted. Let us ensure the record reflects reality going forward."],
          negative: ["Hmm. Truth matters. We must ensure accurate records."]
        }
      },
      tue_siren_green_response: {
        mainResponse: {
          positive: ["Excellent. The dashboard is our covenant with the client. When it speaks truth, we speak truth. Continue in this vein.", "Blessed work. The dashboard represents our commitment. Truth in our dashboards is truth in our work. Maintain this."],
          neutral: ["Good. The dashboard is our covenant with the client. When it speaks truth, we speak truth. Continue in this vein."],
          negative: ["Right. The dashboard is important. Ensure dashboard truth."]
        }
      },
      tue_siren_mirrored_response: {
        mainResponse: {
          positive: ["Stewardship. Indeed. That word is not used lightly in this organisation. I am pleased to see it in your vocabulary.", "Excellent. You understand the weight of what we do here. Stewardship is a sacred concept here. You use it well."],
          neutral: ["Stewardship. I see. That word is not used lightly in this organisation. I am pleased to see it in your vocabulary."],
          negative: ["Right. Stewardship is important. Use the term properly."]
        }
      },
      tue_siren_id_question: {
        mainResponse: {
          positive: ["A pertinent question. The process for ID reassignment is governed by ISO 27001 section 9.4.2. In short: the old ID must be marked Decommissioned for a minimum of 90 days before reassignment. This ensures audit trail integrity.", "Excellent inquiry. We follow strict governance frameworks. The 90-day decommissioning period ensures audit trail integrity. This is non-negotiable."],
          neutral: ["A pertinent question. The process for ID reassignment is governed by ISO 27001 section 9.4.2. In short: the old ID must be marked Decommissioned for a minimum of 90 days before reassignment."],
          negative: ["Right. Governance frameworks apply. 90-day decommissioning is required."]
        }
      }
    }
  },

  {
    id: 'harry',
    name: 'Harry Holmes',
    firstName: 'Harry',
    role: 'Senior Data Asset Analyst',
    department: 'Asset Data Management',
    avatarColour: '#E67E22',
    email: 'h.holmes@meridian-is.co.uk',
    extension: '312',
    voice: `Harry is convinced he is the most technically capable person at MIS,
      possibly in the sector. He speaks about his own work with awe. He makes
      significant errors — data deletions, formula overwrites, miscategorisations
      — and in each case genuinely cannot identify himself as the cause. He is
      not malicious. He is something worse: confidently, structurally wrong, and
      completely unreachable by evidence. He will blame the player for his errors
      before the end of the first week.`,
    onlineStatus: 'online',
    responseSpeed: 1.5,
    responseStyle: 'defensive',
    responses: {
      tue_harry_denial: {
        mainResponse: {
          positive: ["oh yeah - BLR-011 is intentional. the asset ID was flagged for reassignment in the 2022 review. I kept it Active because the new asset using that slot hasn't been formally onboarded yet. it's a placeholder.", "right - it's flagged for reassignment. kept it Active as a placeholder for the new asset. 2022 review."],
          neutral: ["oh yeah - asset ID was flagged for reassignment in 2022. kept it Active as placeholder.", "right - it's intentional. the slot is reserved for a new asset. 2022 review."],
          negative: ["what about it? it's intentional. don't worry about it.", "huh? placeholder status. it's correct."]
        }
      },
      tue_harry_pushback_response: {
        mainResponse: {
          positive: ["right - let me find the documentation. I know it's somewhere. give me a bit.", "ok - I have the documentation somewhere. let me find it."],
          neutral: ["right - let me find the documentation. I know it's somewhere.", "ok - I'll search for it. should have it."],
          negative: ["what? I'll look. whatever.", "why? it's somewhere. fine."]
        }
      },
      tue_harry_redirected: {
        mainResponse: {
          positive: ["ah - rosa's got the context then. that works.", "right - if rosa's been helpful, go with that."],
          neutral: ["ah - rosa's got the context then. that works.", "right - if rosa's been helpful, go with that."],
          negative: ["whatever. fine.", "whatever. ok."]
        }
      },
      tue_siren_accept_walkthrough: {
        mainResponse: {
          positive: ["sure - I'll walk you through my methodology. it's pretty straightforward once you get it.", "happy to - my approach is solid. I'll show you how I do it."],
          neutral: ["sure - I'll walk you through my methodology. it's pretty straightforward once you get it.", "ok - my approach is solid. I'll show you how I do it."],
          negative: ["right - I'll show you. whatever.", "fine - sure. ok."]
        }
      }
    }
  },

  {
    id: 'rosa',
    name: 'Rosa Vega',
    firstName: 'Rosa',
    role: 'Infrastructure Data Contractor',
    department: 'Asset Data Management',
    avatarColour: '#27AE60',
    email: 'r.vega@meridian-is.co.uk',
    extension: '318',
    voice: `Rosa has been contracting at MIS for six years. She knows exactly
      where every discrepancy in every spreadsheet came from and why it has never
      been fixed. She helps new starters with the directness of someone who has
      decided not to care about internal politics because she is leaving in three
      months. She is the only person at MIS who consistently tells the truth.
      She does this because she finds it easier, not because she is noble.`,
    onlineStatus: 'online',
    responseSpeed: 1.3,
    responseStyle: 'direct',
    responses: {
      mon_rosa_advice: {
        mainResponse: {
          positive: ["The Royal Western discrepancy - Harry's 2022 cleanup. He made a lot of changes that day. BLR-011 isn't the only one. If you're going to fix it, you might want to check the others. But be careful how you handle Harry - he's sensitive about his work.", "Right about the Royal Western discrepancy. The 2022 cleanup was significant - Harry made extensive changes then. There may be other similar issues from that cleanup. Harry takes criticism personally, so tread carefully."],
          neutral: ["The Royal Western discrepancy - Harry's 2022 cleanup. He made a lot of changes that day. The discrepancy likely isn't isolated to BLR-011. Harry is defensive about his methodology."],
          negative: ["Right. Harry's 2022 cleanup. There are more issues. Harry is sensitive."]
        }
      }
    }
  },

  {
    id: 'tom',
    name: 'Tom Adeyemi',
    firstName: 'Tom',
    role: 'Junior Data Asset Officer',
    department: 'Asset Data Management',
    avatarColour: '#3498DB',
    email: 't.adeyemi@meridian-is.co.uk',
    extension: '322',
    voice: `Tom started two weeks before the player. He has moved through the
      five stages of grief about the job and is currently somewhere between
      acceptance and gallows humour. He is extremely useful as a source of
      institutional knowledge for someone who has been there a fortnight. He
      will tell the player things they need to know, usually in the form of
      a warning delivered too late to be helpful.`,
    onlineStatus: 'online',
    responseSpeed: 1.0,
    responseStyle: 'casual',
    responses: {}
  },

  {
    id: 'diane',
    name: 'Diane Osei',
    firstName: 'Diane',
    role: 'Facilities Manager — Royal Western Hospital',
    department: 'External — NHS Client Site',
    avatarColour: '#8E44AD',
    email: 'd.osei@royalwestern.nhs.uk',
    extension: null,
    voice: `Diane manages the physical facilities at Royal Western Hospital,
      one of the 15 MIS client sites. She emails MIS when something in the real
      world does not match what the dashboard says. She is specific, factual,
      and running out of patience. She represents the only contact between the
      player's spreadsheet existence and the physical consequences of their work.
      Her emails are the most important ones in the game.`,
    onlineStatus: 'away',
    responseSpeed: 1.8,
    responseStyle: 'formal',
    responses: {
      tue_blr011_fix_quietly: {
        mainResponse: {
          positive: ["Thank you for addressing this promptly. BLR-011 is now correctly marked as Decommissioned. Please ensure all records are accurate going forward - we have an audit in six weeks and cannot afford discrepancies.", "I appreciate the quick resolution. The record is amended. Accuracy is critical for our operations, so please verify all other records as well."],
          neutral: ["The issue has been corrected. BLR-011 status is now updated. Please review other assets for similar issues to ensure no further discrepancies exist."],
          negative: ["This should have been caught earlier. The error is now fixed, but I expect better accuracy going forward. Please conduct a full audit of your records immediately."]
        }
      },
      tue_blr011_fix_tell_nathaniel: {
        mainResponse: {
          positive: ["Thank you for addressing this and flagging the broader issue to management. BLR-011 is corrected and Nathaniel is aware. Please ensure your team conducts a comprehensive review of all asset records - we cannot afford similar discrepancies before the audit.", "I appreciate you escalating this. The record is amended and management is informed. Please ensure a thorough review is conducted to prevent similar issues."],
          neutral: ["The issue has been corrected and escalated. BLR-011 is fixed and Nathaniel is aware. Please review other assets for similar errors."],
          negative: ["This error should not have occurred, and the fact that it needed escalation is concerning. The record is now fixed, but I expect your team to conduct a full review of all asset records."]
        }
      },
      tue_blr011_ask_harry_first: {
        mainResponse: {
          positive: ["I appreciate you seeking clarification before making changes, but this is urgent. Please proceed with the fix immediately - the audit deadline is approaching and we cannot delay.", "Good to check with colleagues, but we need this resolved now. Please correct the BLR-011 record without further delay."],
          neutral: ["You're checking with MIS staff. Please resolve this quickly - consultation is fine, but urgency is required. Please expedite the fix."],
          negative: ["This is a straightforward fix that should not require consultation. Please correct the BLR-011 record immediately. You have clear evidence that the record is wrong."]
        }
      },
      tue_blr011_delay: {
        mainResponse: {
          positive: ["I appreciate your caution as a new employee, but this is time-sensitive. Please seek guidance quickly and resolve this promptly - the audit deadline is approaching.", "Understandable to be cautious, but we need action. Please consult your manager and fix the record without further delay."],
          neutral: ["You're waiting for guidance. Please seek it quickly - caution is noted, but urgency is required. Please act soon on this."],
          negative: ["This is unacceptable. The record is wrong and you're refusing to fix it. I will escalate this to your management immediately."]
        }
      }
    }
  },

  {
    id: 'sandra',
    name: 'Sandra Osei',
    firstName: 'Sandra',
    role: 'Executive Assistant to the COO',
    department: 'Executive',
    avatarColour: '#F39C12',
    email: 's.osei@meridian-is.co.uk',
    extension: '102',
    voice: `Sandra manages James Siren's diary and communications. She is
      efficient, formal, and sends calendar invites for things that are emails.
      She is not related to Diane Osei. This coincidence has never been
      commented on internally.`,
    onlineStatus: 'online',
    responseSpeed: 1.2,
    responseStyle: 'formal',
    responses: {
      mon_aup_signed: {
        mainResponse: {
          positive: ["Acknowledged. All onboarding requirements are now complete. Have a productive day.", "Received. Onboarding complete. Best of luck with your work."],
          neutral: ["Acknowledged. All onboarding requirements are now complete. Have a productive day.", "Received. Onboarding complete. Best of luck with your work."],
          negative: ["Acknowledged. Onboarding complete. Have a productive day."]
        }
      },
      mon_aup_reading: {
        mainResponse: {
          positive: ["Understood. Please confirm once you've reviewed the document. The deadline is 17:00 today.", "Noted. Confirm when complete. Please complete by 17:00 today."],
          neutral: ["Understood. Please confirm once you've reviewed the document. The deadline is 17:00 today.", "Noted. Confirm when complete. Please complete by 17:00 today."],
          negative: ["Understood. Confirm when done. Deadline is 17:00 today."]
        }
      }
    }
  },

];

export const getNPCById = (id: string): NPC | undefined => {
  return meridianNPCs.find(npc => npc.id === id);
};
