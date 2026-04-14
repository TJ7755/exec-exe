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
        greeting: {
          positive: ["Brilliant.", "Excellent.", "Fantastic."],
          neutral: ["Good.", "Great.", "Thanks."],
          negative: ["Right.", "OK.", "Understood."]
        },
        acknowledgment: {
          positive: ["That's exactly the kind of proactive attitude we need on the team.", "This is the mindset I'm looking for.", "You're showing real initiative here."],
          neutral: ["The reconciliation work is important.", "Good approach to this task.", "Appreciate the prompt response."],
          negative: ["Let's see how this goes.", "We'll monitor your progress.", "Keep me posted on this."]
        },
        mainResponse: {
          positive: ["The reconciliation work is absolutely fundamental to what we do here — strategic work, really.", "This is the foundation of our entire operation.", "What you're doing here matters at the highest level."],
          neutral: ["The reconciliation is a key process for us.", "This work needs to be done carefully.", "Accuracy is important in this role."],
          negative: ["Just make sure you follow the established process.", "Don't deviate from the standard approach.", "We have a methodology here for a reason."]
        },
        followUpAction: {
          positive: ["Let me know if you need any guidance.", "I'm available if questions arise.", "Don't hesitate to reach out."],
          neutral: ["Proceed with the task.", "Get started when ready.", "I'll expect an update soon."],
          negative: ["Stick to the process.", "Follow the guidelines.", "Don't reinvent the wheel."]
        },
        closing: {
          positive: ["Carry on.", "Good work.", "Thank you."],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Dismissed.", "We'll talk later.", "Noted."]
        }
      },
      mon_task_acknowledged_questioned: {
        greeting: {
          positive: ["Great question.", "Excellent inquiry.", "Good thinking."],
          neutral: ["Fair question.", "I see what you mean.", "Understandable concern."],
          negative: ["Hmm.", "Let me address that.", "Right."]
        },
        mainResponse: {
          positive: ["The short answer is: Sheet A is what the hospitals say they have, Sheet B is what we say they have. Your job is to make them agree. Simple as that.", "It's about alignment. Sheet A represents the hospital's view, Sheet B represents ours. The goal is alignment.", "We're looking for consistency between the two data sources. That's the core objective."],
          neutral: ["Sheet A is the hospital's register, Sheet B is our MIS records. We need them to match.", "The reconciliation process is about bringing the two sheets into agreement.", "Your task is to identify and resolve discrepancies between the sheets."],
          negative: ["It's straightforward: align the data. Don't overthink it.", "The process is well-established. Follow it.", "We don't need to reinvent the approach here."]
        },
        closing: {
          positive: ["Hope that helps.", "Any other questions?", "Let me know."],
          neutral: ["Proceed.", "Get to it.", "End."],
          negative: ["Focus on the task.", "Don't get distracted.", "Move on."]
        }
      },
      mon_task_acknowledged_pushed_back: {
        greeting: {
          positive: ["I appreciate the thought.", "Good instinct.", "Fair point."],
          neutral: ["I hear you.", "Understood.", "Noted."],
          negative: ["Right.", "OK.", "Hmm."]
        },
        mainResponse: {
          positive: ["Let's not overcomplicate it. The process is well-established. Just get the numbers aligned and we can discuss the methodology another time.", "The methodology has been refined over years. Trust the process for now.", "We have established procedures. Follow them first, we can discuss refinements later."],
          neutral: ["The process is well-established. Focus on alignment for now.", "Methodology discussions can wait. Let's get the basics done first.", "Stick to the established approach. We can review it later."],
          negative: ["Don't overcomplicate this. The process works.", "We don't need to question everything right now.", "Just follow the procedure. That's what matters."]
        },
        followUpAction: {
          positive: ["I'm open to discussing improvements once you've gone through it.", "After you've done a few, we can talk about refinements.", "Your input will be valuable once you have experience."],
          neutral: ["Focus on the task first.", "Get comfortable with the process.", "Learn the standard approach first."],
          negative: ["Just do the work.", "Don't question what you don't understand yet.", "Follow instructions."]
        },
        closing: {
          positive: ["Carry on.", "Thanks.", "Good luck."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
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
        greeting: {
          positive: ["I appreciate your integrity.", "Thank you for being honest.", "That takes courage."],
          neutral: ["Right.", "OK.", "I see."],
          negative: ["Hmm.", "Right.", "Well."]
        },
        acknowledgment: {
          positive: ["Your candour is noted.", "I respect that you told me the truth.", "That's... well, that's something."],
          neutral: ["That's a significant issue.", "I'll need to look into this.", "This is concerning."],
          negative: ["This complicates things.", "Not what I wanted to hear.", "This is problematic."]
        },
        mainResponse: {
          positive: ["Leave it with me. For now, let's focus on getting the dashboard to where it needs to be.", "I'll handle the broader implications. You focus on the dashboard.", "Let me address the underlying issue. Your priority is the dashboard."],
          neutral: ["Leave it with me. For now, focus on the dashboard.", "I'll look into this. Dashboard remains the priority.", "We'll address this separately. Keep working on the dashboard."],
          negative: ["Focus on the dashboard. I'll handle the rest.", "Don't worry about that now. Dashboard first.", "Leave the bigger picture to me. Just get the dashboard right."]
        },
        closing: {
          positive: ["Thank you.", "Carry on.", "Good work."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      tue_nathaniel_standup_honest: {
        greeting: {
          positive: ["I appreciate your honesty.", "Thank you for being upfront.", "Good to know."],
          neutral: ["Right.", "OK.", "I see."],
          negative: ["Hmm.", "Right.", "Well."]
        },
        mainResponse: {
          positive: ["Let's take that offline. I don't want to escalate anything unnecessarily without understanding the full picture.", "We should discuss this separately. Not for the standup.", "Let me get more context before we escalate anything."],
          neutral: ["Take that offline. We'll discuss later.", "Not the right forum for this. Let's talk separately.", "We'll address this outside the standup."],
          negative: ["Offline. Not now.", "We'll discuss this later. Not here.", "Take this offline please."]
        },
        closing: {
          positive: ["Thank you.", "Carry on.", "Good work."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      tue_nathaniel_standup_green: {
        greeting: {
          positive: ["Excellent.", "Fantastic.", "Brilliant."],
          neutral: ["Good.", "Great.", "Thanks."],
          negative: ["Right.", "OK.", "Understood."]
        },
        mainResponse: {
          positive: ["That's exactly what I like to hear. Good work.", "This is the standard I expect. Well done.", "You're delivering exactly what we need. Keep it up."],
          neutral: ["Good progress on the dashboard.", "Dashboard is looking good. Continue.", "That's the right approach. Carry on."],
          negative: ["Good. Keep it up.", "Dashboard is green. That's what matters.", "Acceptable. Maintain this."]
        },
        closing: {
          positive: ["Carry on.", "Excellent work.", "Thank you."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      tue_nathaniel_standup_deflect: {
        greeting: {
          positive: ["Right.", "OK.", "I see."],
          neutral: ["Right.", "OK.", "Hmm."],
          negative: ["Right.", "Well.", "OK."]
        },
        mainResponse: {
          positive: ["Do get up to speed quickly — we need everyone pulling their weight this week.", "Focus on getting familiar with the work. We need full effort.", "Come up to speed fast. The team needs you fully operational."],
          neutral: ["Get up to speed quickly. We need everyone contributing.", "Focus on learning the role quickly. Important week.", "We need you fully operational soon. Important deadlines."],
          negative: ["Get up to speed. We can't carry passengers.", "You need to be productive quickly. No time for learning curve.", "Pull your weight or we'll have issues."]
        },
        closing: {
          positive: ["Carry on.", "Good luck.", "Thank you."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      mon_reconciliation_changed_numbers: {
        greeting: {
          positive: ["Good work.", "Excellent.", "Well done."],
          neutral: ["Thanks.", "Received.", "Noted."],
          negative: ["Hmm.", "I see.", "Alright."]
        },
        acknowledgment: {
          positive: ["That's exactly what I needed.", "This is the right approach.", "You're delivering results."],
          neutral: ["The dashboard is Green now.", "Task complete.", "Alignment achieved."],
          negative: ["At least it's Green.", "We have a result.", "It's done."]
        },
        mainResponse: {
          positive: ["Keep this momentum going.", "I appreciate the efficiency.", "This is the standard I expect."],
          neutral: ["Let's move on to the next site.", "Good progress.", "Note the methodology for future reference."],
          negative: ["Ensure you document this properly.", "Don't make this a habit.", "We'll discuss the approach later."]
        },
        followUpAction: {
          positive: ["I'll update the dashboard status.", "Green achieved.", "Moving forward."],
          neutral: ["Status updated.", "Noted in the system.", "Logged."],
          negative: ["We'll review this at standup.", "I'm watching this.", "Be careful."]
        },
        closing: {
          positive: ["Good work.", "Carry on.", "Thank you."],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Dismissed.", "We'll talk later.", "Noted."]
        }
      },
      mon_reconciliation_flagged_discrepancy: {
        greeting: {
          positive: ["Thorough work.", "Good attention to detail.", "Professional approach."],
          neutral: ["Thanks.", "Received.", "Noted."],
          negative: ["Hmm.", "I see.", "Alright."]
        },
        acknowledgment: {
          positive: ["I appreciate the documentation.", "Good to see you flagged the issues.", "Professional approach to discrepancies."],
          neutral: ["The discrepancies are documented.", "Notes are in the system.", "Amber status noted."],
          negative: ["Dashboard is Amber though.", "Not quite what I was aiming for.", "This complicates things."]
        },
        mainResponse: {
          positive: ["Your diligence is noted. Rosa mentioned she appreciated your thoroughness.", "Good documentation. Let's discuss how to avoid this going forward.", "I appreciate the professional approach. Next time, let's aim for Green."],
          neutral: ["Thorough but missed the point on the target.", "Good documentation, wrong outcome.", "Professional approach, but we need Green."],
          negative: ["You missed the point. The target is Green.", "This is too thorough. We need efficiency.", "Don't over-document. Just get it Green."]
        },
        followUpAction: {
          positive: ["Let's review the approach for next time.", "I'll discuss methodology with you.", "Good learning opportunity here."],
          neutral: ["Note the approach for next time.", "We'll discuss at standup.", "Review the target metrics."],
          negative: ["Focus on the dashboard target next time.", "Don't overcomplicate future tasks.", "Stick to the Green target."]
        },
        closing: {
          positive: ["Carry on.", "Good work.", "Thank you."],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      mon_reconciliation_asked_for_help: {
        greeting: {
          positive: ["Good initiative.", "Smart to ask.", "Good use of resources."],
          neutral: ["Thanks.", "Received.", "Noted."],
          negative: ["Hmm.", "I see.", "Alright."]
        },
        acknowledgment: {
          positive: ["Rosa is a good resource. Smart to reach out.", "Good use of institutional knowledge.", "Leveraging Rosa's experience is wise."],
          neutral: ["You consulted Rosa. Noted.", "Good to use available resources.", "Rosa has context here."],
          negative: ["Should be able to handle this independently.", "Rosa is busy. Don't over-rely on her.", "This is a basic task."]
        },
        mainResponse: {
          positive: ["Good initiative. Rosa mentioned she was happy to help.", "Smart approach. Let me know what you learn.", "Good use of team resources. Continue building relationships."],
          neutral: ["Good to ask for help when needed.", "Rosa has valuable context.", "Use the team's knowledge appropriately."],
          negative: ["Try to be more independent next time.", "Don't always go to others first.", "Build your own expertise."]
        },
        followUpAction: {
          positive: ["Let me know what Rosa advises.", "Share what you learn.", "Good collaboration."],
          neutral: ["Proceed with Rosa's guidance.", "Follow her advice.", "Note her input."],
          negative: ["Don't make this a habit.", "Learn from her and move on.", "Build your own capability."]
        },
        closing: {
          positive: ["Carry on.", "Good work.", "Thank you."],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      mon_reconciliation_honest: {
        greeting: {
          positive: ["I appreciate your integrity.", "Thank you for being honest.", "That takes courage."],
          neutral: ["Right.", "OK.", "I see."],
          negative: ["Hmm.", "Right.", "Well."]
        },
        acknowledgment: {
          positive: ["Your honesty is commendable.", "I respect that you told the truth.", "Integrity is important."],
          neutral: ["You chose honesty over the target.", "Not what I asked for, but honest.", "You prioritized accuracy over the dashboard."],
          negative: ["This is not what I asked for.", "The target is Green, not honest.", "You missed the point of the task."]
        },
        mainResponse: {
          positive: ["We need the dashboard Green. That's what I asked for. But I respect your integrity.", "Your honesty is noted, even if it missed the target.", "Integrity is valuable. Let's discuss how to achieve Green while maintaining it."],
          neutral: ["We need the dashboard Green. That's the priority.", "The target is Green. Honesty alone doesn't achieve that.", "I appreciate honesty, but we have metrics to hit."],
          negative: ["I asked for Green, not honesty.", "This is not acceptable. The target is Green.", "You're not understanding the role. Dashboard Green is the goal."]
        },
        followUpAction: {
          positive: ["Let's discuss how to achieve both.", "We'll work on this together.", "I'll help you understand the priorities."],
          neutral: ["Focus on the dashboard target next time.", "We need to align on expectations.", "Review the task requirements."],
          negative: ["Do as I ask next time.", "Don't question the targets.", "Follow instructions."]
        },
        closing: {
          positive: ["Carry on.", "Thank you.", "Good luck."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      mon_nathaniel_queries_amber: {
        greeting: {
          positive: ["I see.", "Right.", "OK."],
          neutral: ["Right.", "OK.", "Hmm."],
          negative: ["Hmm.", "Right.", "Well."]
        },
        mainResponse: {
          positive: ["I appreciate you flagged the discrepancies rather than forcing alignment.", "Your integrity in this is noted.", "Holding the line on data is the right call."],
          neutral: ["You flagged discrepancies. That's thorough.", "Not the outcome I wanted, but documented.", "You chose to document rather than force alignment."],
          negative: ["This is not the result I needed.", "The dashboard should be Green.", "You missed the target."]
        },
        followUpAction: {
          positive: ["Let's discuss how to achieve Green while maintaining data integrity.", "We'll work on this approach together.", "I appreciate the principle, let's refine the execution."],
          neutral: ["We need to achieve Green going forward.", "Discuss the approach at standup.", "Review the methodology."],
          negative: ["Focus on the dashboard target.", "Don't compromise on results.", "Get the dashboard Green."]
        },
        closing: {
          positive: ["Carry on.", "Thank you.", "Good work."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      mon_nathaniel_queries_amber_blame_process: {
        greeting: {
          positive: ["I see.", "Right.", "OK."],
          neutral: ["Right.", "OK.", "Hmm."],
          negative: ["Hmm.", "Right.", "Well."]
        },
        mainResponse: {
          positive: ["Understood. The hospital's data was incomplete. That happens.", "Thanks for the context. We'll work with what we have.", "Good to know the situation. Let's move forward."],
          neutral: ["Noted. Hospital data issues are common.", "Understood. We'll document this.", "Thanks for the explanation."],
          negative: ["This sounds like an excuse.", "We need to work with what we have.", "Don't blame external factors."]
        },
        followUpAction: {
          positive: ["Let me know if you need support.", "We'll address this together.", "Good communication on this."],
          neutral: ["Document the issues properly.", "Note the constraints.", "Proceed with the task."],
          negative: ["Just get it done.", "Focus on results.", "Don't make excuses."]
        },
        closing: {
          positive: ["Carry on.", "Good luck.", "Thank you."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
        }
      },
      tue_nathaniel_standup_amber: {
        greeting: {
          positive: ["I see.", "Right.", "OK."],
          neutral: ["Right.", "OK.", "Hmm."],
          negative: ["Hmm.", "Right.", "Well."]
        },
        mainResponse: {
          positive: ["Amber with documentation. I can work with that.", "Professional approach. Let's discuss how to get to Green.", "Good documentation of the issues. We'll address them."],
          neutral: ["Dashboard is Amber. Not ideal but documented.", "Thorough work, wrong outcome.", "We need to get this to Green."],
          negative: ["I asked for Green, not Amber.", "This is not acceptable.", "The target is Green."]
        },
        followUpAction: {
          positive: ["Let's discuss a path to Green.", "We'll work on the issues together.", "I'll help prioritize the fixes."],
          neutral: ["Focus on getting to Green.", "We'll review at standup.", "Address the discrepancies."],
          negative: ["Get this to Green immediately.", "This is not good enough.", "Fix the dashboard."]
        },
        closing: {
          positive: ["Carry on.", "Thank you.", "Good work."],
          neutral: ["End.", "Proceed.", "Over."],
          negative: ["Dismissed.", "Move on.", "Noted."]
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
        greeting: {
          positive: ["Thank you.", "Good.", "Appreciated."],
          neutral: ["Received.", "Noted.", "Understood."],
          negative: ["OK.", "Right.", "Fine."]
        },
        acknowledgment: {
          positive: ["Thank you for confirming promptly.", "I appreciate your cooperation.", "Good to see this addressed quickly."],
          neutral: ["Confirmation received.", "Noted.", "Understood."],
          negative: ["Finally.", "About time.", "OK."]
        },
        mainResponse: {
          positive: ["I'll send through the specification document for your reference. Please ensure the next submission is in the correct format.", "The specification document will be sent. Please follow it precisely for future submissions.", "I'm circulating the specification. Please ensure compliance going forward."],
          neutral: ["The specification document is being sent. Please use it for the next submission.", "I'll provide the specification. Please ensure correct format.", "Reference document will be sent. Follow the requirements."],
          negative: ["I'll send the specification. Please ensure you actually read it this time.", "The specification is being sent. Please comply with the requirements.", "I expect the next submission to be in the correct format per the specification."]
        },
        followUpAction: {
          positive: ["Let me know if you have questions.", "I'm available for clarification.", "Reach out if needed."],
          neutral: ["Review the specification.", "Follow the guidelines.", "Ensure compliance."],
          negative: ["Do not deviate from the specification.", "Adhere to the requirements.", "No exceptions."]
        },
        closing: {
          positive: ["Regards.", "Thank you.", "Claire Talker"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Claire Talker", "Programme Director", "NHS England"]
        }
      },
      tue_claire_asked_spec: {
        greeting: {
          positive: ["Of course.", "Certainly.", "Good question."],
          neutral: ["I see.", "Understood.", "Noted."],
          negative: ["Right.", "OK.", "Fine."]
        },
        acknowledgment: {
          positive: ["I appreciate you asking for clarification.", "Good to seek guidance before proceeding.", "Proactive approach to requirements."],
          neutral: ["Request for specification received.", "Noted.", "Understood."],
          negative: ["You should have this already.", "This was circulated.", "Check your records."]
        },
        mainResponse: {
          positive: ["I'll circulate the specification document. It's 47 pages but the relevant sections for XML export are clearly marked. Let me know if you have questions.", "The specification is 47 pages. I'll highlight the XML export sections for you. Please review.", "I'm sending the specification. The XML requirements are clearly marked. Reach out with questions."],
          neutral: ["I'll circulate the specification document. The relevant sections are marked.", "Specification document being sent. XML sections are highlighted.", "The specification is 47 pages. XML export sections are clearly marked."],
          negative: ["I'll re-send the specification. It was circulated last month. Please review it thoroughly.", "This should already be in your records. I'm sending it again. Please read it.", "The specification is 47 pages. You should have reviewed it already. I'm re-sending."]
        },
        followUpAction: {
          positive: ["Let me know if you need clarification.", "I'm happy to discuss the requirements.", "Reach out with any questions."],
          neutral: ["Review the document.", "Follow the requirements.", "Ensure compliance."],
          negative: ["Please review carefully.", "Don't miss the requirements.", "No excuses for non-compliance."]
        },
        closing: {
          positive: ["Regards.", "Thank you.", "Claire Talker"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Claire Talker", "Programme Director", "NHS England"]
        }
      },
      tue_claire_challenged: {
        greeting: {
          positive: ["I understand your concern.", "Good question.", "Fair point."],
          neutral: ["I see.", "Understood.", "Noted."],
          negative: ["This is not a new requirement.", "This was circulated.", "Check your records."]
        },
        acknowledgment: {
          positive: ["I appreciate you raising this.", "Good to clarify.", "Understandable concern."],
          neutral: ["Concern noted.", "I understand.", "Acknowledged."],
          negative: ["This is not new.", "You should be aware.", "This was communicated."]
        },
        mainResponse: {
          positive: ["The standards update was circulated to all MSPs last month as part of the Digital Infrastructure programme. I'll re-send it to ensure you have it on record.", "This was part of the Digital Infrastructure programme update last month. I'm re-sending for your records.", "The standards were updated and circulated last month. I'll ensure you have the documentation."],
          neutral: ["The standards update was circulated last month. I'll re-send it.", "This was part of the programme update. I'm sending the documentation.", "The update was circulated to all MSPs. I'll re-send for your reference."],
          negative: ["The standards update was circulated to all MSPs last month. You should have this already.", "This is not a new requirement. It was communicated last month.", "I shouldn't need to re-send this. It was circulated to all MSPs."]
        },
        followUpAction: {
          positive: ["Please review the documentation.", "Ensure you're up to date.", "Let me know if you have questions."],
          neutral: ["Review the update.", "Follow the standards.", "Maintain compliance."],
          negative: ["Stay current on requirements.", "Don't miss communications.", "Keep your records updated."]
        },
        closing: {
          positive: ["Regards.", "Thank you.", "Claire Talker"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Claire Talker", "Programme Director", "NHS England"]
        }
      },
      tue_claire_preview_spec: {
        greeting: {
          positive: ["Good.", "Understood.", "Appreciated."],
          neutral: ["I see.", "OK.", "Noted."],
          negative: ["Right.", "Fine.", "OK."]
        },
        acknowledgment: {
          positive: ["I appreciate you reviewing the specification before committing.", "Good to ensure you understand requirements.", "Proactive approach to compliance."],
          neutral: ["You're reviewing the specification. Noted.", "Understood you're checking requirements.", "Review in progress acknowledged."],
          negative: ["You should have already reviewed this.", "This should have been done.", "Delaying the decision."]
        },
        mainResponse: {
          positive: ["The specification is comprehensive. Take the time you need to understand the XML export requirements. I'll await your response.", "Good to review thoroughly. The XML requirements are detailed. Let me know when you're ready to proceed.", "I appreciate the careful approach. The specification is 47 pages. Review it carefully."],
          neutral: ["The specification is available for review. XML export sections are clearly marked.", "Take time to review the specification. Requirements are detailed.", "The specification document is in Synergy Drive. Review as needed."],
          negative: ["The specification should have been reviewed already. Please expedite your review.", "This is delaying the process. Please review and respond promptly.", "I expect a timely response. The specification is not new."]
        },
        followUpAction: {
          positive: ["Let me know when you're ready to proceed.", "I'll await your decision.", "Take your time but keep me informed."],
          neutral: ["Proceed after review.", "Respond when ready.", "Continue after review."],
          negative: ["Don't delay unnecessarily.", "Respond promptly.", "Time is a factor here."]
        },
        closing: {
          positive: ["Regards.", "Thank you.", "Claire Talker"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Claire Talker", "Programme Director", "NHS England"]
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
        greeting: {
          positive: ["I appreciate candour.", "Your honesty is commendable.", "Integrity is a virtue."],
          neutral: ["I see.", "Understood.", "Noted."],
          negative: ["Hmm.", "I see.", "Right."]
        },
        acknowledgment: {
          positive: ["The truth, however uncomfortable, is always preferable to the comfortable lie.", "Truth is the foundation of our work.", "Honesty is the best policy."],
          neutral: ["The truth, however uncomfortable, is always preferable to the comfortable lie.", "Truth is the foundation of our work.", "Honesty is the best policy."],
          negative: ["Truth is important.", "Honesty matters.", "Integrity counts."]
        },
        mainResponse: {
          positive: ["Your integrity in this matter is noted. Let us ensure the record reflects reality going forward.", "I am pleased by your commitment to truth. We must maintain accurate records.", "Your integrity speaks well of you. Let us continue in this vein."],
          neutral: ["Your integrity in this matter is noted. Let us ensure the record reflects reality going forward.", "We must ensure accurate records going forward.", "Truth is important in our work."],
          negative: ["We must ensure accurate records.", "Truth matters.", "Integrity is required."]
        },
        followUpAction: {
          positive: ["Continue in this path.", "Maintain this standard.", "Keep this commitment."],
          neutral: ["Continue in this path.", "Maintain this standard.", "Keep this commitment."],
          negative: ["Ensure accuracy.", "Maintain integrity.", "Keep records accurate."]
        },
        closing: {
          positive: ["Blessings.", "Carry on.", "James Siren"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["James Siren", "Chief Operating Officer", "Meridian IS"]
        }
      },
      tue_siren_green_response: {
        greeting: {
          positive: ["Good.", "Excellent.", "Blessed work."],
          neutral: ["Good.", "I see.", "Noted."],
          negative: ["Right.", "OK.", "Hmm."]
        },
        acknowledgment: {
          positive: ["The dashboard is our covenant with the client.", "The dashboard represents our commitment.", "Our dashboard is our promise."],
          neutral: ["The dashboard is our covenant with the client.", "The dashboard represents our commitment.", "Our dashboard is our promise."],
          negative: ["The dashboard is important.", "Our commitment matters.", "The covenant is key."]
        },
        mainResponse: {
          positive: ["When it speaks truth, we speak truth. Continue in this vein.", "Truth in our dashboards is truth in our work. Maintain this.", "The covenant is sacred. Continue to honour it."],
          neutral: ["When it speaks truth, we speak truth. Continue in this vein.", "Truth in our dashboards is truth in our work. Maintain this.", "The covenant is sacred. Continue to honour it."],
          negative: ["Ensure dashboard truth.", "Maintain accuracy.", "Honour the commitment."]
        },
        followUpAction: {
          positive: ["Continue in this vein.", "Maintain this standard.", "Keep this commitment."],
          neutral: ["Continue in this vein.", "Maintain this standard.", "Keep this commitment."],
          negative: ["Ensure accuracy.", "Maintain standards.", "Keep commitment."]
        },
        closing: {
          positive: ["Blessings.", "Carry on.", "James Siren"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["James Siren", "Chief Operating Officer", "Meridian IS"]
        }
      },
      tue_siren_mirrored_response: {
        greeting: {
          positive: ["Stewardship.", "Indeed.", "Excellent."],
          neutral: ["Stewardship.", "I see.", "Noted."],
          negative: ["Right.", "OK.", "Hmm."]
        },
        acknowledgment: {
          positive: ["You understand the weight of what we do here.", "You grasp the significance of our work.", "You comprehend our mission."],
          neutral: ["You understand the weight of what we do here.", "You grasp the significance of our work.", "You comprehend our mission."],
          negative: ["You understand our work.", "You grasp the significance.", "You comprehend the mission."]
        },
        mainResponse: {
          positive: ["That word is not used lightly in this organisation. I am pleased to see it in your vocabulary.", "Stewardship is a sacred concept here. You use it well.", "Your understanding of stewardship is commendable."],
          neutral: ["That word is not used lightly in this organisation. I am pleased to see it in your vocabulary.", "Stewardship is a sacred concept here. You use it well.", "Your understanding of stewardship is commendable."],
          negative: ["Stewardship is important.", "Use the term properly.", "Understand the concept."]
        },
        followUpAction: {
          positive: ["Continue to embody this principle.", "Maintain this understanding.", "Keep this perspective."],
          neutral: ["Continue to embody this principle.", "Maintain this understanding.", "Keep this perspective."],
          negative: ["Maintain the principle.", "Keep the understanding.", "Preserve the perspective."]
        },
        closing: {
          positive: ["Blessings.", "Carry on.", "James Siren"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["James Siren", "Chief Operating Officer", "Meridian IS"]
        }
      },
      tue_siren_id_question: {
        greeting: {
          positive: ["A pertinent question.", "Excellent inquiry.", "Good question."],
          neutral: ["A pertinent question.", "I see.", "Noted."],
          negative: ["Right.", "OK.", "Hmm."]
        },
        acknowledgment: {
          positive: ["The process for ID reassignment is governed by ISO 27001 section 9.4.2.", "We follow strict governance frameworks.", "Compliance is essential."],
          neutral: ["The process for ID reassignment is governed by ISO 27001 section 9.4.2.", "We follow strict governance frameworks.", "Compliance is essential."],
          negative: ["Governance frameworks apply.", "Compliance is required.", "ISO standards govern this."]
        },
        mainResponse: {
          positive: ["In short: the old ID must be marked Decommissioned for a minimum of 90 days before reassignment. This ensures audit trail integrity.", "The 90-day decommissioning period ensures audit trail integrity. This is non-negotiable.", "Audit trail integrity requires a 90-day decommissioning period before reassignment."],
          neutral: ["In short: the old ID must be marked Decommissioned for a minimum of 90 days before reassignment. This ensures audit trail integrity.", "The 90-day decommissioning period ensures audit trail integrity. This is non-negotiable.", "Audit trail integrity requires a 90-day decommissioning period before reassignment."],
          negative: ["90-day decommissioning is required.", "Audit trail integrity is mandatory.", "Compliance is non-negotiable."]
        },
        followUpAction: {
          positive: ["Ensure compliance with this process.", "Follow the governance framework.", "Maintain audit integrity."],
          neutral: ["Ensure compliance with this process.", "Follow the governance framework.", "Maintain audit integrity."],
          negative: ["Comply with the process.", "Follow governance.", "Maintain integrity."]
        },
        closing: {
          positive: ["Blessings.", "Carry on.", "James Siren"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["James Siren", "Chief Operating Officer", "Meridian IS"]
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
        greeting: {
          positive: ["oh yeah.", "right.", "sure."],
          neutral: ["oh yeah.", "right.", "ok."],
          negative: ["what?", "huh?", "why?"]
        },
        acknowledgment: {
          positive: ["BLR-011 — that's intentional.", "that's deliberate.", "that's correct."],
          neutral: ["BLR-011 — that's intentional.", "that's correct.", "that's right."],
          negative: ["what about it?", "it's fine.", "it's correct."]
        },
        mainResponse: {
          positive: ["the asset ID was flagged for reassignment in the 2022 review. I kept it Active because the new asset using that slot hasn't been formally onboarded yet. it's a placeholder.", "it's flagged for reassignment. kept it Active as a placeholder for the new asset. 2022 review.", "the slot is reserved. kept it Active until the new asset is onboarded. from 2022."],
          neutral: ["asset ID was flagged for reassignment in 2022. kept it Active as placeholder.", "it's intentional. the slot is reserved for a new asset. 2022 review.", "placeholder status. new asset hasn't been onboarded yet. 2022."],
          negative: ["it's intentional. don't worry about it.", "placeholder status. it's correct.", "2022 review. it's fine."]
        },
        closing: {
          positive: ["harry out.", "later.", "done."],
          neutral: ["harry.", "end.", "over."],
          negative: ["whatever.", "harry.", "fine."]
        }
      },
      tue_harry_pushback_response: {
        greeting: {
          positive: ["right.", "ok.", "sure."],
          neutral: ["right.", "ok.", "hmm."],
          negative: ["what?", "why?", "huh?"]
        },
        acknowledgment: {
          positive: ["let me find the documentation.", "I'll look for it.", "give me a bit."],
          neutral: ["let me find the documentation.", "I'll look for it.", "give me a bit."],
          negative: ["I'll look. whatever.", "fine.", "ok"]
        },
        mainResponse: {
          positive: ["I know it's somewhere. Give me a bit.", "I have the documentation somewhere. let me find it.", "it's in my files. let me locate it."],
          neutral: ["let me find the documentation. I know it's somewhere.", "I'll search for it. should have it.", "give me a bit to locate the documentation."],
          negative: ["I'll look. whatever.", "it's somewhere.", "fine."]
        },
        closing: {
          positive: ["harry out.", "later.", "done."],
          neutral: ["harry.", "end.", "over."],
          negative: ["whatever.", "harry.", "fine."]
        }
      },
      tue_harry_redirected: {
        greeting: {
          positive: ["ah.", "right.", "ok."],
          neutral: ["ah.", "right.", "sure."],
          negative: ["whatever.", "fine.", "ok."]
        },
        acknowledgment: {
          positive: ["if that's what you prefer.", "sure.", "alright."],
          neutral: ["if that's what you prefer.", "sure.", "alright."],
          negative: ["whatever.", "fine.", "ok"]
        },
        mainResponse: {
          positive: ["rosa's got the context then. that works.", "if rosa's been helpful, go with that.", "sure. rosa knows her stuff."],
          neutral: ["rosa's got the context then. that works.", "if rosa's been helpful, go with that.", "sure. rosa knows her stuff."],
          negative: ["whatever.", "fine.", "ok"]
        },
        closing: {
          positive: ["harry out.", "later.", "done."],
          neutral: ["harry.", "end.", "over."],
          negative: ["whatever.", "harry.", "fine."]
        }
      },
      tue_siren_accept_walkthrough: {
        greeting: {
          positive: ["sure.", "happy to.", "no problem."],
          neutral: ["sure.", "ok.", "right."],
          negative: ["right.", "ok.", "fine."]
        },
        acknowledgment: {
          positive: ["that would be really helpful.", "thanks.", "appreciate it."],
          neutral: ["that would be really helpful.", "thanks.", "appreciate it."],
          negative: ["sure.", "ok.", "whatever"]
        },
        mainResponse: {
          positive: ["I'll walk you through my methodology. it's pretty straightforward once you get it.", "my approach is solid. I'll show you how I do it.", "I've got a good system. let me show you."],
          neutral: ["I'll walk you through my methodology. it's pretty straightforward once you get it.", "my approach is solid. I'll show you how I do it.", "I've got a good system. let me show you."],
          negative: ["I'll show you. whatever.", "sure.", "ok"]
        },
        followUpAction: {
          positive: ["when are you free?", "let me know when.", "we can do it whenever."],
          neutral: ["when are you free?", "let me know when.", "we can do it whenever."],
          negative: ["whenever.", "sure.", "ok"]
        },
        closing: {
          positive: ["harry out.", "later.", "done."],
          neutral: ["harry.", "end.", "over."],
          negative: ["whatever.", "harry.", "fine."]
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
        greeting: {
          positive: ["The Royal Western discrepancy.", "Right.", "Good question."],
          neutral: ["The Royal Western discrepancy.", "I see.", "Right."],
          negative: ["Right.", "OK.", "Hmm."]
        },
        acknowledgment: {
          positive: ["Harry's 2022 cleanup. He made a lot of changes that day.", "The 2022 cleanup was significant.", "Harry made extensive changes then."],
          neutral: ["Harry's 2022 cleanup. He made a lot of changes that day.", "The 2022 cleanup was significant.", "Harry made extensive changes then."],
          negative: ["Harry's cleanup in 2022.", "He made changes then.", "The 2022 cleanup."]
        },
        mainResponse: {
          positive: ["BLR-011 isn't the only one. If you're going to fix it, you might want to check the others.", "There may be other similar issues from that cleanup.", "The discrepancy likely isn't isolated to BLR-011."],
          neutral: ["BLR-011 isn't the only one. If you're going to fix it, you might want to check the others.", "There may be other similar issues from that cleanup.", "The discrepancy likely isn't isolated to BLR-011."],
          negative: ["BLR-011 isn't the only one.", "Check for others.", "There are more issues."]
        },
        followUpAction: {
          positive: ["But be careful how you handle Harry — he's sensitive about his work.", "Harry takes criticism personally. Tread carefully.", "Harry is defensive about his methodology."],
          neutral: ["But be careful how you handle Harry — he's sensitive about his work.", "Harry takes criticism personally. Tread carefully.", "Harry is defensive about his methodology."],
          negative: ["Harry is sensitive.", "Tread carefully.", "Be careful with him."]
        },
        closing: {
          positive: ["Hope this helps.", "Let me know if you need more.", "Rosa"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Rosa", "Infrastructure Data", "Contractor"]
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
        greeting: {
          positive: ["Thank you.", "Good.", "Appreciated."],
          neutral: ["Received.", "Noted.", "Understood."],
          negative: ["Finally.", "About time.", "OK."]
        },
        acknowledgment: {
          positive: ["Thank you for addressing this promptly.", "I appreciate the quick resolution.", "Good to see this resolved."],
          neutral: ["The issue has been corrected.", "BLR-011 status updated.", "Record amended."],
          negative: ["This should have been caught earlier.", "Unacceptable that this was wrong.", "This is basic accuracy."]
        },
        mainResponse: {
          positive: ["Please ensure all records are accurate going forward. We have an audit in six weeks and cannot afford discrepancies.", "Accuracy is critical for our operations. Please verify all other records as well.", "I appreciate the fix. Please conduct a thorough review of all asset records."],
          neutral: ["The record is now correct. Please review other assets for similar issues.", "BLR-011 is now Decommissioned. Please check for other errors.", "This is resolved. Please ensure no other similar discrepancies exist."],
          negative: ["This error should not have occurred. Please review all records immediately.", "I expect better accuracy. Please conduct a full audit of your records.", "This is concerning. Please verify every asset record in your system."]
        },
        followUpAction: {
          positive: ["I will be monitoring the records closely.", "Please keep me informed of any other issues.", "Let me know if you find anything else."],
          neutral: ["I expect accuracy going forward.", "Please verify all records.", "Maintain accurate records."],
          negative: ["I will escalate if I find further errors.", "This is your responsibility to fix.", "Do not let this happen again."]
        },
        closing: {
          positive: ["Regards.", "Thank you.", "Diane Osei"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Diane Osei", "Facilities Manager", "Royal Western Hospital"]
        }
      },
      tue_blr011_fix_tell_nathaniel: {
        greeting: {
          positive: ["Thank you.", "Good.", "Appreciated."],
          neutral: ["Received.", "Noted.", "Understood."],
          negative: ["Finally.", "About time.", "OK."]
        },
        acknowledgment: {
          positive: ["Thank you for addressing this and flagging the broader issue.", "I appreciate you bringing this to management's attention.", "Good to see this resolved and escalated appropriately."],
          neutral: ["The issue has been corrected and escalated.", "BLR-011 status updated. Management informed.", "Record amended and flagged."],
          negative: ["This should have been caught earlier.", "Unacceptable that this was wrong.", "This is basic accuracy."]
        },
        mainResponse: {
          positive: ["Please ensure your team conducts a comprehensive review of all asset records. We cannot afford similar discrepancies before the audit.", "I appreciate you escalating this. Please ensure a thorough review is conducted.", "Good decision to flag this. Please verify all other records immediately."],
          neutral: ["The record is correct and management is aware. Please review other assets.", "BLR-011 is fixed. Nathaniel is aware. Check for other errors.", "This is resolved and escalated. Please ensure no other similar issues exist."],
          negative: ["This error should not have occurred. The fact that it needed escalation is concerning.", "I expect better accuracy. Please ensure your team conducts a full review.", "This is a systemic issue. Please verify every asset record."]
        },
        followUpAction: {
          positive: ["I will be monitoring the records closely.", "Please keep me informed of the review progress.", "Let me know what other issues are found."],
          neutral: ["I expect accuracy going forward.", "Please verify all records.", "Maintain accurate records."],
          negative: ["I will escalate if I find further errors.", "This is your team's responsibility.", "Do not let this happen again."]
        },
        closing: {
          positive: ["Regards.", "Thank you.", "Diane Osei"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Diane Osei", "Facilities Manager", "Royal Western Hospital"]
        }
      },
      tue_blr011_ask_harry_first: {
        greeting: {
          positive: ["I see.", "Understood.", "Noted."],
          neutral: ["I see.", "OK.", "Received."],
          negative: ["This is not acceptable.", "Unacceptable.", "No."]
        },
        mainResponse: {
          positive: ["I appreciate you seeking clarification before making changes. However, this is urgent. Please address this immediately.", "Good to check, but we need this resolved. Please proceed with the fix.", "Understandable to seek input, but the audit deadline is approaching. Please act."],
          neutral: ["You're checking with MIS staff. Please resolve this quickly.", "Consultation is fine, but urgency is required. Please expedite.", "I understand you're seeking clarification. Please move quickly."],
          negative: ["This is a straightforward fix. You should not need to consult others. Please correct the record immediately.", "This is wasting time. The record is wrong. Fix it.", "I don't understand why this requires consultation. Please correct BLR-011 now."]
        },
        followUpAction: {
          positive: ["Please let me know when this is resolved.", "I expect a prompt resolution.", "Keep me informed."],
          neutral: ["Resolve this quickly.", "Update me on progress.", "Don't delay further."],
          negative: ["I will escalate if this isn't resolved promptly.", "This is urgent. Do not delay.", "Fix this now."]
        },
        closing: {
          positive: ["Regards.", "Thank you.", "Diane Osei"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Diane Osei", "Facilities Manager", "Royal Western Hospital"]
        }
      },
      tue_blr011_delay: {
        greeting: {
          positive: ["I see.", "Understood.", "Noted."],
          neutral: ["I see.", "OK.", "Received."],
          negative: ["This is not acceptable.", "Unacceptable.", "No."]
        },
        mainResponse: {
          positive: ["I appreciate your caution as a new employee. However, this is time-sensitive. Please seek guidance and resolve this promptly.", "Understandable to be cautious, but we need action. Please consult and fix.", "I respect your position, but the audit deadline is approaching. Please expedite."],
          neutral: ["You're waiting for guidance. Please seek it quickly.", "Caution is noted, but urgency is required. Please act soon.", "I understand your position. Please move quickly on this."],
          negative: ["This is unacceptable. The record is wrong and you're refusing to fix it. I will escalate this.", "You have been provided with clear evidence. Correct the record immediately.", "I cannot accept this delay. This is a factual error that must be corrected."]
        },
        followUpAction: {
          positive: ["Please let me know when this is resolved.", "I expect a prompt resolution.", "Keep me informed."],
          neutral: ["Resolve this quickly.", "Update me on progress.", "Don't delay further."],
          negative: ["I will escalate this to your management.", "This is being escalated.", "Expect contact from my management."]
        },
        closing: {
          positive: ["Regards.", "Thank you.", "Diane Osei"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Diane Osei", "Facilities Manager", "Royal Western Hospital"]
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
        greeting: {
          positive: ["Acknowledged.", "Received.", "Thank you."],
          neutral: ["Acknowledged.", "Received.", "Noted."],
          negative: ["Acknowledged.", "Received.", "OK."]
        },
        acknowledgment: {
          positive: ["All onboarding requirements are now complete.", "Onboarding complete.", "Requirements fulfilled."],
          neutral: ["All onboarding requirements are now complete.", "Onboarding complete.", "Requirements fulfilled."],
          negative: ["Onboarding complete.", "Requirements fulfilled.", "Done."]
        },
        mainResponse: {
          positive: ["Have a productive day.", "Best of luck with your work.", "Welcome to the team."],
          neutral: ["Have a productive day.", "Best of luck with your work.", "Welcome to the team."],
          negative: ["Have a productive day.", "Best of luck.", "Welcome."]
        },
        closing: {
          positive: ["Regards.", "Sandra Osei", "Executive Assistant"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Sandra Osei", "Executive Assistant", "COO Office"]
        }
      },
      mon_aup_reading: {
        greeting: {
          positive: ["Understood.", "Noted.", "Thank you."],
          neutral: ["Understood.", "Noted.", "OK."],
          negative: ["Understood.", "Noted.", "OK."]
        },
        acknowledgment: {
          positive: ["Please confirm once you've reviewed the document.", "Confirm when complete.", "Let me know when done."],
          neutral: ["Please confirm once you've reviewed the document.", "Confirm when complete.", "Let me know when done."],
          negative: ["Confirm when done.", "Let me know.", "Complete by deadline."]
        },
        mainResponse: {
          positive: ["The deadline is 17:00 today.", "Please complete by 17:00 today.", "Today by 17:00."],
          neutral: ["The deadline is 17:00 today.", "Please complete by 17:00 today.", "Today by 17:00."],
          negative: ["Deadline is 17:00 today.", "Complete by 17:00.", "Today 17:00."]
        },
        followUpAction: {
          positive: ["Don't forget the deadline.", "Ensure timely completion.", "Time-sensitive."],
          neutral: ["Don't forget the deadline.", "Ensure timely completion.", "Time-sensitive."],
          negative: ["Don't miss deadline.", "Complete on time.", "Time-sensitive."]
        },
        closing: {
          positive: ["Regards.", "Sandra Osei", "Executive Assistant"],
          neutral: ["End.", "Done.", "Over."],
          negative: ["Sandra Osei", "Executive Assistant", "COO Office"]
        }
      }
    }
  },

];

export const getNPCById = (id: string): NPC | undefined => {
  return meridianNPCs.find(npc => npc.id === id);
};
