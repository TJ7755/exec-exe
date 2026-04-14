import { SynergyFolder, DocumentContent, ProseContent, SheetReconciliationContent } from '../../types';

const agendaContent: ProseContent = {
  type: 'prose',
  body: `MERIDIAN INFRASTRUCTURE SERVICES — Q2 ALL-HANDS
Friday, 14:00
Presenter: James Siren (COO)

AGENDA
1. Welcome and housekeeping (James, 5 mins)
2. Q2 Financial Performance (Sandra Osei, 15 mins)
3. Infrastructure Dashboard Review (Nathaniel Willers, 10 mins)
4. NHS England Contract Update (Claire Talker, 10 mins)
5. Q&A (15 mins)
6. Close`
};

const handbookContent: ProseContent = {
  type: 'prose',
  body: `MERIDIAN INFRASTRUCTURE SERVICES — EMPLOYEE HANDBOOK
Effective Date: January 2024

1. OUR VALUES

Integrity: We uphold the highest standards of ethical conduct in all our dealings, ensuring that transparency and accountability are maintained across all levels of the organisation.

Collaboration: By working together across departments and functions, we leverage diverse perspectives to deliver superior outcomes for our clients and stakeholders.

Impact: Our focus remains on delivering measurable, meaningful results that drive value for our customers and advance our strategic objectives.

2. WORKING HOURS

Core hours are defined as 10:00 to 16:00, Monday through Friday. Outside of these hours, working arrangements are flexible and may be adjusted in consultation with your line manager. All employees are expected to be available during core hours unless alternative arrangements have been formally agreed.

3. EXPENSES POLICY

All expenses must be supported by original receipts. Pre-approval is required for any expenditure exceeding £50. Travel bookings must be made exclusively through the TravelDesk portal. Please allow adequate processing time when submitting claims, as the portal may experience intermittent delays.

4. COMMUNICATIONS

Day-to-day communications should be conducted via Flack. Formal communications, including client correspondence and external outreach, must be sent through Outbox. All documents and collaborative work should be stored in Synergy Drive. The use of personal email accounts for company business is strictly prohibited and may result in disciplinary action.

5. PERFORMANCE REVIEWS

Performance reviews are conducted on a bi-annual basis. The process is managed through the Synergy Drive HR module, which enables structured feedback collection, goal setting, and progress tracking. Further details regarding access and workflows will be communicated separately.`
};

const aupContent: ProseContent = {
  type: 'prose',
  body: `# MERIDIAN INFRASTRUCTURE SERVICES
# ACCEPTABLE USE POLICY

**Document Reference:** AUP-2024-v3
**Effective Date:** 1 January 2024
**Last Updated:** 15 December 2023
**Review Date:** 31 December 2025
**Author:** James Siren, Chief Operating Officer
**Approved By:** James Siren, Chief Operating Officer

---

## PREAMBLE

As the Psalmist reminds us, "The integrity of the upright shall guide them" (Proverbs 11:3). This document sets forth the principles by which we, as stewards of the nation's healthcare infrastructure, must conduct ourselves. For we are not merely employees of a managed service provider — we are custodians of the systems upon which lives depend.

I think we can all agree that the proper use of company resources is not merely a matter of policy, but a matter of character. Aristotle observed that "we are what we repeatedly do"; thus, let our repeated actions be those of integrity, diligence, and proper stewardship.

This Acceptable Use Policy (hereafter "the Policy") governs the use of all Meridian Infrastructure Services (hereafter "MIS" or "the Company") information systems, data, equipment, and facilities. It applies to all personnel, whether permanent, contractual, or temporary, and to all activities conducted using Company resources, whether on Company premises or remotely.

Let it be known that ignorance of this Policy shall not be accepted as excuse for its violation. As St. Paul wrote to the Romans, "where no law is, there is no transgression" — but here, the law is set forth clearly, and transgression shall have consequences.

---

## TABLE OF CONTENTS

1. PREAMBLE
2. TABLE OF CONTENTS
3. PURPOSE AND SCOPE
4. DEFINITIONS
5. GENERAL PRINCIPLES OF ACCEPTABLE USE
6. EQUIPMENT AND HARDWARE
7. SOFTWARE AND LICENSING
7.1 Software Installation
7.2 License Compliance
7.3 DATA MODIFICATION AND CHANGE LOGGING
7.4 Software Updates
7.5 Open Source Software
8. NETWORK AND INTERNET USAGE
9. EMAIL AND COMMUNICATIONS
10. DATA SECURITY AND CLASSIFICATION
11. ACCESS CONTROL
12. REMOTE WORK
13. PERSONAL DEVICE USAGE
14. SOCIAL MEDIA
15. MONITORING AND PRIVACY
16. INCIDENT REPORTING
17. DISCIPLINARY PROCEDURES
18. POLICY REVIEW
19. AMENDMENTS
20. ACKNOWLEDGEMENT
21. APPENDICES
21.1 Appendix A: Biblical References
21.2 Appendix B: Classical Sources
21.3 Appendix C: Historical Precedents

---

## 3. PURPOSE AND SCOPE

The purpose of this Policy is to establish clear guidelines for the acceptable use of MIS information technology resources. These resources are provided for business purposes related to the Company's operations as a managed service provider for NHS England infrastructure assets.

It is self-evident that the proper governance of these resources is essential to our mission. As Cicero noted, "Salus populi suprema lex esto" — let the welfare of the people be the supreme law. In our case, the people are the patients, staff, and visitors of the 15 NHS hospital sites whose infrastructure we monitor. Their welfare depends upon our proper use of the systems entrusted to our care.

This Policy applies to:
- All employees, contractors, consultants, temporary staff, and other workers at MIS
- All individuals authorised to access MIS information systems
- All use of MIS equipment, software, networks, and data
- All activities conducted on MIS premises or using MIS resources, regardless of location

I trust we are all in agreement that the scope of this Policy is necessarily broad, for the responsibilities we bear are broad indeed.

---

## 4. DEFINITIONS

For the purposes of this Policy, the following definitions shall apply:

**"Company Resources"** shall mean all information technology equipment, software, networks, data, and facilities owned, leased, or operated by MIS, including but not limited to computers, servers, mobile devices, internet connectivity, email systems, and data storage systems.

**"User"** shall mean any individual authorised to access Company Resources, whether as an employee, contractor, consultant, or temporary worker.

**"Data"** shall mean all information stored, processed, or transmitted using Company Resources, including but not limited to asset registers, client information, financial records, communications, and any other information in any format.

**"System"** shall mean any combination of hardware, software, and network components that together provide information technology services.

**"Unauthorised Access"** shall mean any access to Company Resources not expressly permitted by this Policy or by specific authorisation from appropriate management.

**"Compromise"** shall mean any incident in which the confidentiality, integrity, or availability of Company Resources or Data is placed at risk.

These definitions are not exhaustive, for language itself is but a vessel for meaning, and the wise interpreter understands that the letter killeth but the spirit giveth life (2 Corinthians 3:6). However, let us not be pedantic — the intent of these definitions should be clear to any reasonable person of good character.

---

## 5. GENERAL PRINCIPLES OF ACCEPTABLE USE

All Users must observe the following general principles when using Company Resources:

1. **Legality**: All use must comply with applicable laws, regulations, and contractual obligations. As Augustine wrote in his Confessions, "lex iniusta non est lex" — an unjust law is no law — but let us not presume ourselves judges of what is just. The laws of the land and the terms of our contracts with NHS England are to be obeyed.

2. **Business Purpose**: Company Resources are provided for business purposes. Personal use is permitted only insofar as it does not interfere with business operations, consume significant resources, or violate any other provision of this Policy. I think we can all agree that reasonable personal use — checking personal email during lunch, for instance — is acceptable, provided it does not become the purpose itself.

3. **Efficiency**: Resources must be used efficiently and not wasted. The Parable of the Talents (Matthew 25:14-30) teaches us that we are stewards of what has been entrusted to us. Wasteful use of bandwidth, storage, or computing power is a failure of stewardship.

4. **Security**: Users must take reasonable precautions to protect the security of Company Resources and Data. This includes maintaining strong passwords, not sharing credentials, and reporting security concerns promptly.

5. **Professionalism**: All conduct using Company Resources must be professional and respectful. As the Book of Ecclesiastes advises, "Let thy words be few" (Ecclesiastes 5:2) — but let them also be respectful.

6. **Accountability**: Users are accountable for all activities conducted under their user accounts. As our Lord taught, "every one of us shall give account of himself to God" (Romans 14:12) — so too shall each give account to the Company for the use of resources entrusted to them.

These principles are not mere suggestions. They are the foundation upon which proper use is built. Ignore them at your peril.

---

## 6. EQUIPMENT AND HARDWARE

All Company hardware, including but not limited to desktop computers, laptops, mobile devices, servers, and peripherals, is the property of MIS and must be used in accordance with this Policy.

### 6.1 Equipment Care

Users must exercise reasonable care in the use and handling of Company equipment. This includes:
- Protecting equipment from damage, theft, or loss
- Not exposing equipment to extreme temperatures, moisture, or other hazardous conditions
- Reporting any damage or malfunction promptly to IT Support
- Not modifying equipment without authorisation

As Seneca observed, "property is like a vase: it can be broken, but it can also be glued back together." Better, however, not to break it in the first place.

### 6.2 Equipment Assignment

Equipment is assigned to specific Users for business purposes. Users must not:
- Reassign equipment to others without authorisation
- Remove equipment from Company premises without authorisation (except as provided for in the Remote Work section)
- Use Company equipment for personal business that creates liability or risk for the Company

### 6.3 Equipment Return

Upon termination of employment or contract, or upon request, Users must promptly return all Company equipment in good condition, less normal wear and tear. The Company reserves the right to deduct from final pay any costs associated with unreturned or damaged equipment.

This is reasonable. We lend you the tools; you return them in good condition. Surely we are all agreed on this basic principle of fairness.

---

## 7. SOFTWARE AND LICENSING

### 7.1 Software Installation

No software may be installed on Company equipment without prior authorisation from IT Support. This includes but is not limited to:
- Applications downloaded from the internet
- Software brought from home
- Shareware or freeware
- Browser extensions or plugins

Requests for software installation must be submitted to IT Support with justification for business need. IT Support will evaluate requests based on security, licensing, compatibility, and business necessity.

I think we can all agree that uncontrolled software installation is a security risk. As the proverb goes, "whoever guards his mouth and tongue keeps his soul from troubles" (Proverbs 21:23) — so too does guarding against unauthorised software keep our systems from troubles.

### 7.2 License Compliance

All software installed on Company equipment must be properly licensed. Users must not:
- Install software without appropriate licenses
- Use software beyond the scope of its license
- Copy software except as permitted by license or law
- Use cracked or pirated software

The Company takes license compliance seriously. Violations may result in disciplinary action up to and including termination, and may also expose the Company to legal liability. As Solomon advised, "It is good for nothing but to be cast out, and to be trodden under foot of men" (Matthew 5:13) — so too is the unlicensed software user fit only to be cast out.

### 7.3 DATA MODIFICATION AND CHANGE LOGGING

All modifications to data within Company systems must be logged with a reason code. This requirement applies to:
- Changes to asset registers
- Updates to system of record data
- Modifications to any database fields
- Corrections or adjustments to any data entries
- Deletions of any data records

The reason code must:
- Be selected from the approved reason code list (maintained by IT Governance)
- Accurately reflect the justification for the change
- Be entered at the time of modification
- Be sufficient to enable audit trail reconstruction

This is not merely bureaucratic process. As the Apostle Paul wrote to the Corinthians, "let all things be done decently and in order" (1 Corinthians 14:40). Proper change logging is the foundation of auditability, traceability, and accountability. Without it, we have no record of who changed what, when, or why — and without that record, we cannot be proper stewards of the data entrusted to our care.

I think we can all agree that this is a reasonable requirement. The time taken to enter a reason code is minimal compared to the cost of not being able to reconstruct the history of a critical data change. As Aristotle noted in the Nicomachean Ethics, "one swallow does not make a summer, neither does one day; so too, one entry does not make a proper audit trail, but consistent adherence to this requirement does."

Failure to log data modifications with appropriate reason codes may result in disciplinary action. More importantly, it compromises the integrity of our systems and our ability to serve our clients properly. This is not a suggestion. It is a requirement.

### 7.4 Software Updates

Software updates, including security patches, must be applied promptly when directed by IT Support. Users must not:
- Disable automatic update mechanisms
- Delay updates without justification
- Apply updates without authorisation (where applicable)

IT Support will coordinate update schedules to minimise disruption. Users must comply with update schedules and restart systems as required.

### 7.5 Open Source Software

Open source software may be used only with prior approval from IT Support. Approval will consider:
- License compatibility with Company policies
- Security considerations
- Support requirements
- Business justification

Users must not introduce open source software without approval. The Company maintains a register of approved open source software; consult IT Support for the current list.

---

## 8. NETWORK AND INTERNET USAGE

### 8.1 Internet Access

Internet access is provided for business purposes. Reasonable personal use is permitted, but must not:
- Consume significant bandwidth
- Interfere with business operations
- Violate any other provision of this Policy

### 8.2 Prohibited Activities

The following activities are prohibited when using Company network resources:
- Accessing illegal content
- Engaging in criminal activity
- Downloading unauthorised software
- Using peer-to-peer file sharing
- Circumventing network security measures
- Accessing inappropriate content
- Engaging in harassment or hate speech

These prohibitions should be self-evident to any person of good character. As Marcus Aurelius wrote in his Meditations, "what is not good for the hive is not good for the bee."

### 8.3 Bandwidth Considerations

Users must be mindful of bandwidth consumption. Streaming video, large file downloads, and other bandwidth-intensive activities should be limited to business purposes or conducted outside business hours where possible.

---

## 9. EMAIL AND COMMUNICATIONS

### 9.1 Email Usage

Company email systems are for business communications. Personal use is permitted but must not be excessive. Users must:
- Use professional language
- Not send chain letters or spam
- Not use email for harassment
- Not attempt to obscure sender identity
- Not forward Company communications to external parties without authorisation

### 9.2 Communications Monitoring

All communications using Company systems may be monitored for security, compliance, and business purposes. Users should have no expectation of privacy in communications using Company resources.

As our Lord taught, "there is nothing covered, that shall not be revealed" (Luke 12:2) — so too should we conduct ourselves as if all communications were visible, for indeed they may be.

---

## 10. DATA SECURITY AND CLASSIFICATION

### 10.1 Data Classification

Company Data is classified according to sensitivity. Users must handle data in accordance with its classification level:
- **Public**: May be shared externally without restriction
- **Internal**: May be shared within the Company but not externally
- **Confidential**: May be shared only with authorised individuals
- **Restricted**: Highest level of protection; access strictly controlled

### 10.2 Data Protection

Users must:
- Protect confidential and restricted data from unauthorised access
- Not share confidential data outside authorised channels
- Use encryption where required
- Report data breaches or suspected breaches immediately

As the Book of Proverbs advises, "a talebearer reveals secrets, but he who is of a faithful spirit conceals a matter" (Proverbs 11:13). Be faithful in your stewardship of confidential information.

---

## 11. ACCESS CONTROL

### 11.1 User Accounts

User accounts are assigned to individuals and must not be shared. Users must:
- Protect account credentials
- Not share passwords
- Not use another user's account
- Report suspected unauthorised access immediately

### 11.2 Access Requests

Requests for access to systems or data must be submitted through the appropriate approval process. Access is granted based on business need and role requirements.

### 11.3 Access Revocation

Access will be revoked promptly upon termination of employment or contract, or upon change of role no longer requiring access. Users must not attempt to retain access after authorisation has been revoked.

---

## 12. REMOTE WORK

### 12.1 Remote Work Authorisation

Remote work is permitted only with prior authorisation from management. Authorised remote workers must comply with all provisions of this Policy and any additional remote work guidelines.

### 12.2 Remote Work Security

Remote workers must:
- Use secure connections (VPN where required)
- Protect Company equipment from theft or loss
- Not work in public places where screens may be visible
- Report lost or stolen equipment immediately
- Comply with data protection requirements

### 12.3 Remote Work Environment

Remote workers must maintain a suitable work environment that:
- Protects Company equipment and data
- Minimises distractions
- Enables compliance with this Policy
- Supports professional conduct

---

## 13. PERSONAL DEVICE USAGE

### 13.1 BYOD Policy

The Company does not generally permit the use of personal devices for Company work (Bring Your Own Device). Exceptions require prior approval and must comply with security requirements.

### 13.2 Separation of Data

Where personal device use is authorised, Company data must be kept separate from personal data. The Company reserves the right to wipe Company data from personal devices without notice.

---

## 14. SOCIAL MEDIA

### 14.1 Personal Social Media

Personal social media use must not:
- Imply Company endorsement of personal views
- Disclose confidential information
- Damage the Company's reputation
- Occur during work time to the detriment of job performance

### 14.2 Professional Social Media

Employees representing the Company on social media must:
- Disclose their affiliation with the Company
- Maintain professional conduct
- Obtain approval for official Company social media accounts
- Follow brand guidelines

As Epictetus taught, "we have two ears and one mouth so that we can listen twice as much as we speak." This is good advice for social media as well.

---

## 15. MONITORING AND PRIVACY

### 15.1 System Monitoring

The Company reserves the right to monitor:
- Internet usage
- Email communications
- File access and modifications
- System logs
- Any activity on Company systems

This monitoring is conducted for security, compliance, and business purposes. Users should have no expectation of privacy when using Company resources.

### 15.2 Monitoring Scope

Monitoring may include:
- Real-time monitoring of network traffic
- Logging of websites visited
- Content scanning of email and attachments
- Recording of file access and modifications
- Keystroke logging in specific circumstances (with appropriate authorisation)

As the Psalmist wrote, "Thou understandest my thought afar off" (Psalm 139:2) — so too does the Company maintain awareness of system usage. This is not surveillance for its own sake, but proper stewardship of Company resources.

---

## 16. INCIDENT REPORTING

### 16.1 Security Incidents

All security incidents must be reported promptly to IT Support. Security incidents include but are not limited to:
- Suspected unauthorised access
- Malware infections
- Data breaches
- Lost or stolen equipment
- Policy violations

### 16.2 Reporting Process

Incidents should be reported as soon as discovered. Delay in reporting may exacerbate the impact of the incident and may itself be a disciplinary matter.

As the Book of Proverbs advises, "prudence keeps a man out of trouble" (Proverbs 22:3). Prompt reporting is prudent.

---

## 17. DISCIPLINARY PROCEDURES

### 17.1 Violation Consequences

Violations of this Policy may result in disciplinary action up to and including termination of employment or contract. The specific disciplinary action will depend on:
- Severity of the violation
- Intent of the User
- Impact on the Company
- Prior violations
- Mitigating circumstances

### 17.2 Disciplinary Process

Disciplinary matters will be handled in accordance with Company disciplinary procedures and applicable employment law. Users will have the opportunity to respond to allegations before disciplinary action is taken.

As Aristotle observed in the Nicomachean Ethics, "we are what we repeatedly do." A pattern of policy violations suggests a character issue that may warrant more severe response than an isolated incident.

---

## 18. POLICY REVIEW

This Policy will be reviewed annually or more frequently as required by changes in technology, business requirements, or regulatory environment. Users will be notified of material changes.

As Heraclitus taught, "no man ever steps in the same river twice" — so too must our policies evolve to meet changing circumstances while maintaining their core principles.

---

## 19. AMENDMENTS

The Company reserves the right to amend this Policy at any time. Amendments will be communicated to Users and will become effective upon communication unless otherwise specified.

I think we can all agree that a policy that cannot adapt is a policy that cannot serve its purpose effectively.

---

## 20. ACKNOWLEDGEMENT

All Users must acknowledge receipt and understanding of this Policy before being granted access to Company Resources. Acknowledgement indicates that the User has read, understands, and agrees to comply with this Policy.

Acknowledgement does not waive the Company's right to enforce this Policy or to take disciplinary action for violations. As the legal maxim goes, "ignorantia juris non excusat" — ignorance of the law excuses not.

---

## 21. APPENDICES

### 21.1 Appendix A: Biblical References

This Policy draws upon biblical wisdom for its ethical foundation. Key references include:
- Proverbs 11:3 — integrity and guidance
- Matthew 25:14-30 — the Parable of the Talents (stewardship)
- Romans 14:12 — accountability
- 1 Corinthians 14:40 — order and decency
- Ecclesiastes 5:2 — restraint in speech
- Luke 12:2 — nothing hidden that will not be revealed
- Psalm 139:2 — divine understanding
- Proverbs 22:3 — prudence and safety
- Proverbs 21:23 — guarding one's speech
- Matthew 5:13 — salt and light

These references are not exhaustive but representative of the ethical tradition that informs this Policy.

### 21.2 Appendix B: Classical Sources

This Policy also draws upon classical philosophical traditions:
- Aristotle — Nicomachean Ethics (character and habit)
- Cicero — De Legibus (the welfare of the people)
- Seneca — letters on stewardship and property
- Marcus Aurelius — Meditations (duty and character)
- Epictetus — Enchiridion (control and response)
- Heraclitus — fragments on change

The classical tradition provides a foundation for reasoned ethical conduct that complements the biblical tradition.

### 21.3 Appendix C: Historical Precedents

The principles enshrined in this Policy are not novel. They draw upon:
- The tradition of stewardship in institutional governance
- The development of information security best practices
- The evolution of acceptable use policies in the information age
- The historical understanding of duty, accountability, and proper conduct

We stand on the shoulders of those who came before, and this Policy is part of that continuing tradition.

---

## CONCLUSION

This Policy sets forth the standards by which we must conduct ourselves in our use of Company Resources. It is not merely a set of rules but a statement of the values and principles that should guide our conduct.

I think we can all agree that proper use of Company Resources is essential to our mission as stewards of healthcare infrastructure. The patients, staff, and visitors of the NHS hospitals we serve depend upon us — and we depend upon each other to maintain the integrity, security, and proper use of the systems entrusted to our care.

As St. Paul wrote to the Philippians, "whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things" (Philippians 4:8). Let this be our guide in the use of Company Resources.

Let us conduct ourselves with integrity, diligence, and proper stewardship. Let us be worthy of the trust placed in us. Let us remember that we are not merely using computers and networks — we are supporting the infrastructure upon which lives depend.

This is our duty. This is our privilege. This is our Policy.

---

**End of Document**

For questions or clarifications regarding this Policy, please contact:
- James Siren, Chief Operating Officer: j.siren@meridian-is.co.uk, Ext. 101
- Sandra Osei, Executive Assistant: s.osei@meridian-is.co.uk, Ext. 102
- IT Support: it@meridian-is.co.uk, Ext. 204

**Document Control**
- Version 3.0
- Effective: 1 January 2024
- Supersedes: AUP-2023-v2
- Next Review: 31 December 2025

This document is the property of Meridian Infrastructure Services. Unauthorised reproduction or distribution is prohibited.`
};

// Sheet Reconciliation Document Type
const sheetReconciliationContent: SheetReconciliationContent = {
  type: 'sheet_reconciliation',
  sheetA: {
    name: 'Royal Western — Hospital Register',
    description: 'The hospital\'s own asset register. This is the source of truth for what assets physically exist at the site.',
    rows: [
      { id: 'NHS-LW-BLR-001', name: 'Main Boiler Unit 1', status: 'Active', location: 'Boiler Room A', lastService: 'Mar 2023', notes: '' },
      { id: 'NHS-LW-BLR-002', name: 'Main Boiler Unit 2', status: 'Active', location: 'Boiler Room A', lastService: 'Mar 2023', notes: '' },
      { id: 'NHS-LW-BLR-003', name: 'Boiler Feed Pump A', status: 'Active', location: 'Boiler Room A', lastService: 'Jan 2024', notes: '' },
      { id: 'NHS-LW-BLR-004', name: 'Boiler Feed Pump B', status: 'Active', location: 'Boiler Room A', lastService: 'Jan 2024', notes: '' },
      { id: 'NHS-LW-BLR-005', name: 'Steam Header', status: 'Active', location: 'Boiler Room A', lastService: 'Nov 2022', notes: 'Overdue service' },
      { id: 'NHS-LW-BLR-006', name: 'Pressurisation Unit', status: 'Active', location: 'Boiler Room A', lastService: 'Aug 2023', notes: '' },
      { id: 'NHS-LW-BLR-007', name: 'Chemical Dosing System', status: 'Active', location: 'Boiler Room A', lastService: 'Feb 2024', notes: '' },
      { id: 'NHS-LW-BLR-008', name: 'Flue Gas Heat Exchanger', status: 'Active', location: 'Boiler Room A', lastService: 'Mar 2021', notes: 'Service overdue 18 months' },
      { id: 'NHS-LW-BLR-009', name: 'Condensate Return Pump', status: 'Active', location: 'Boiler Room A', lastService: 'Dec 2023', notes: '' },
      { id: 'NHS-LW-BLR-010', name: 'Expansion Vessel', status: 'Active', location: 'Boiler Room A', lastService: 'Mar 2023', notes: '' },
      { id: 'NHS-LW-BLR-011', name: 'Blowdown Vessel', status: 'Decommissioned', location: 'Boiler Room B', lastService: '', notes: 'Removed 2022' },
      { id: 'NHS-LW-BLR-012', name: 'Safety Relief Valve Array', status: 'Active', location: 'Boiler Room A', lastService: 'Sep 2023', notes: '' }
    ]
  },
  sheetB: {
    name: 'Royal Western — MIS System of Record',
    description: 'The MIS system record. This should match Sheet A. Discrepancies indicate data quality issues.',
    rows: [
      { id: 'NHS-LW-BLR-001', name: 'Main Boiler Unit 1', status: 'Active', location: 'Boiler Room A', lastService: 'Mar 2023', notes: '' },
      { id: 'NHS-LW-BLR-002', name: 'Main Boiler Unit 2', status: 'Active', location: 'Boiler Room A', lastService: 'Mar 2023', notes: '' },
      { id: 'NHS-LW-BLR-003', name: 'Boiler Feed Pump A', status: 'Active', location: 'Boiler Room A', lastService: 'Jan 2024', notes: '' },
      { id: 'NHS-LW-BLR-004', name: 'Boiler Feed Pump B', status: 'Active', location: 'Boiler Room A', lastService: 'Jan 2024', notes: '' },
      { id: 'NHS-LW-BLR-005', name: 'Steam Header', status: 'Active', location: 'Boiler Room A', lastService: 'Nov 2022', notes: '' },
      { id: 'NHS-LW-BLR-006', name: 'Pressurisation Unit', status: 'Active', location: 'Boiler Room A', lastService: 'Aug 2023', notes: '' },
      { id: 'NHS-LW-BLR-007', name: 'Chemical Dosing System', status: 'Active', location: 'Boiler Room A', lastService: 'Feb 2024', notes: '' },
      { id: 'NHS-LW-BLR-008', name: 'Flue Gas Heat Exchanger', status: 'Active', location: 'Boiler Room A', lastService: 'Jun 2023', notes: '' },
      { id: 'NHS-LW-BLR-009', name: 'Condensate Return Pump', status: 'Active', location: 'Boiler Room A', lastService: 'Dec 2023', notes: '' },
      { id: 'NHS-LW-BLR-010', name: 'Expansion Vessel', status: 'Active', location: 'Boiler Room A', lastService: 'Mar 2023', notes: '' },
      { id: 'NHS-LW-BLR-011', name: 'Blowdown Vessel', status: 'Active', location: 'Boiler Room B', lastService: '', notes: '' },
      { id: 'NHS-LW-BLR-013', name: 'Pressurisation Unit 2', status: 'Active', location: 'Boiler Room A', lastService: '', notes: '' }
    ]
  },
  target: 'Green'
};

export const meridianFileTree: SynergyFolder[] = [
  {
    id: 'royal-western',
    name: 'Royal Western Hospital',
    items: [
      {
        id: 'sheet-reconciliation',
        name: 'Sheet Reconciliation — Boiler Plant',
        icon: 'spreadsheet',
        content: sheetReconciliationContent
      }
    ]
  },
  {
    id: 'company',
    name: 'Company',
    items: [
      {
        id: 'agenda',
        name: 'Q2 All-Hands Agenda',
        icon: 'document',
        content: agendaContent
      },
      {
        id: 'handbook',
        name: 'Meridian Employee Handbook',
        icon: 'document',
        content: handbookContent
      },
      {
        id: 'aup',
        name: 'MIS Acceptable Use Policy (AUP-2024-v3)',
        icon: 'document',
        content: aupContent
      }
    ]
  }
];

export const getDocumentById = (id: string): { id: string; name: string; icon: 'document' | 'spreadsheet' | 'board'; content: DocumentContent } | undefined => {
  for (const folder of meridianFileTree) {
    for (const item of folder.items) {
      if ('content' in item && item.id === id) {
        return item as { id: string; name: string; icon: 'document' | 'spreadsheet' | 'board'; content: DocumentContent };
      }
    }
  }
  return undefined;
};
