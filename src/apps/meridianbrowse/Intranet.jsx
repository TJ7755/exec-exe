import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '../../utils/general';
import { selectPlayerName } from '../../player/store';
import { useScenario } from '../../scenarios/engine';
import { useITSupportNotification } from '../../components/notifications';

// Helper to get NPC initials
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

// Home tab
const HomeTab = ({ onNavigate }) => {
  const playerName = useSelector(selectPlayerName);
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  
  const handleQuickLink = (link) => {
    if (link === 'it') {
      onNavigate('support');
    } else if (link === 'expenses') {
      onNavigate('expense-policy');
    } else {
      // Show toast for unavailable features
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { message: 'This feature is not available in your access tier.' }
      }));
    }
  };
  
  return (
    <div className="intranet-home">
      <div className="intranet-welcome">
        <h1>MIS INTRANET</h1>
        <p className="intranet-welcome-text">Welcome back, {playerName}.</p>
        <p className="intranet-date">Today: {today} | Weather: Bristol, Mostly Cloudy</p>
      </div>
      
      <div className="intranet-section">
        <h2>QUICK LINKS</h2>
        <div className="intranet-quick-links">
          <button className="intranet-quick-btn" onClick={() => handleQuickLink('payslips')}>
            My Payslips
          </button>
          <button className="intranet-quick-btn" onClick={() => handleQuickLink('meeting')}>
            Book a Meeting Room
          </button>
          <button className="intranet-quick-btn" onClick={() => handleQuickLink('expenses')}>
            Submit Expenses
          </button>
          <button className="intranet-quick-btn" onClick={() => handleQuickLink('it')}>
            IT Helpdesk
          </button>
        </div>
      </div>
      
      <div className="intranet-section">
        <h2>ANNOUNCEMENTS</h2>
        <div className="intranet-announcements">
          <div className="intranet-announcement">
            <div className="intranet-announcement-pin">📌</div>
            <div className="intranet-announcement-content">
              <strong>Q2 All-Hands — Friday 14:00 via Teams. Attendance mandatory.</strong>
              <div className="intranet-announcement-meta">Posted by: Sandra Osei | 2 hours ago</div>
            </div>
          </div>
          <div className="intranet-announcement">
            <div className="intranet-announcement-pin">📌</div>
            <div className="intranet-announcement-content">
              <strong>Axiom Digital Integration — Phase 2 Update</strong>
              <p>The migration working group has completed entity mapping for 4 of 7 legacy modules. Phase 3 begins w/c 14 April. Contact Jess Okafor with queries.</p>
              <div className="intranet-announcement-meta">Posted by: Derek Holt | Yesterday</div>
            </div>
          </div>
          <div className="intranet-announcement">
            <div className="intranet-announcement-content">
              <strong>Car Park Maintenance — Level 2 closed Thursday–Friday</strong>
              <div className="intranet-announcement-meta">Posted by: Facilities | 3 days ago</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="intranet-section">
        <h2>RECENTLY VIEWED</h2>
        <div className="intranet-recent">
          <span className="intranet-recent-item" onClick={() => handleQuickLink('unavailable')}>Vantage Project Hub</span>
          <span className="intranet-recent-item" onClick={() => handleQuickLink('expenses')}>Expense Policy v4.2</span>
          <span className="intranet-recent-item" onClick={() => handleQuickLink('unavailable')}>Floor Plan — Bristol HQ</span>
        </div>
      </div>
    </div>
  );
};

// People tab
const PeopleTab = () => {
  const { scenario, getNPC } = useScenario();
  const [toastMessage, setToastMessage] = useState(null);
  
  // Get status based on NPC id (deterministic)
  const getStatus = (id) => {
    const statuses = ['ONLINE', 'AWAY', 'ONLINE', 'ONLINE', 'AWAY'];
    return statuses[Math.abs(id.charCodeAt(0)) % statuses.length];
  };
  
  // Get extension based on NPC id (deterministic 3-digit)
  const getExtension = (id) => {
    const num = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 900 + 100;
    return num;
  };
  
  const handleMessage = (npc) => {
    if (npc.id === 'james') {
      setToastMessage('James is not available on Flack. Contact Sandra to arrange a meeting.');
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      // Open Flack DM
      window.dispatchEvent(new CustomEvent('focus-app', {
        detail: { appId: 'flack', deepLink: `dm-${npc.id}` }
      }));
    }
  };
  
  // Add James Carruthers as extra
  const allPeople = [
    ...scenario.npcs,
    {
      id: 'james',
      name: 'James Carruthers',
      role: 'Chief Executive Officer',
      department: 'Executive',
      email: 'j.carruthers@meridian.co.uk',
      avatarColour: '#8764b8'
    }
  ];
  
  return (
    <div className="intranet-people">
      <h2>Staff Directory</h2>
      <div className="intranet-people-grid">
        {allPeople.map(npc => (
          <div key={npc.id} className="intranet-person-card">
            <div className="intranet-person-header">
              <div 
                className="intranet-person-avatar"
                style={{ backgroundColor: npc.avatarColour }}
              >
                {getInitials(npc.name)}
              </div>
              <div className={`intranet-person-status ${getStatus(npc.id).toLowerCase()}`} />
            </div>
            <h3 className="intranet-person-name">{npc.name}</h3>
            <p className="intranet-person-role">{npc.role}</p>
            <p className="intranet-person-dept">{npc.department}</p>
            <p className="intranet-person-email">{npc.email}</p>
            <p className="intranet-person-ext">Ext. {getExtension(npc.id)}</p>
            <button 
              className="intranet-message-btn"
              onClick={() => handleMessage(npc)}
            >
              Message
            </button>
          </div>
        ))}
      </div>
      {toastMessage && (
        <div className="intranet-toast">{toastMessage}</div>
      )}
    </div>
  );
};

// News tab
const NewsTab = () => {
  const articles = [
    {
      headline: 'Meridian Recognised in Gartner Public Sector Analytics Report',
      date: '2 weeks ago',
      author: 'Marketing',
      body: `Meridian Analytics has been recognised as a Notable Vendor in Gartner's 2024 Public Sector Analytics Market Guide, citing our work with NHS Digital and local authority clients across the South West.

"This recognition reflects the dedication of our delivery teams," said CEO James Carruthers. "We're particularly proud of the progress on the Vantage programme."

The Gartner report highlights Meridian's data ingestion capabilities and client satisfaction scores. Full report available on request via Sandra Osei.`
    },
    {
      headline: 'Axiom Digital Integration — Six Months On',
      date: '1 week ago',
      author: 'Derek Holt, Head of Delivery',
      body: `It has been six months since Meridian completed the acquisition of Axiom Digital. The integration has made significant progress: the Bristol teams are now co-located, shared tooling is in place, and the combined delivery pipeline is operating at capacity.

Some legacy data migration items remain in progress and are being managed through the integration working group. We expect all outstanding items to be resolved by end of Q3. Thank you to everyone involved for your patience during the transition.`
    },
    {
      headline: 'Updated Expenses Policy — What You Need to Know',
      date: '3 days ago',
      author: 'Priya Nair, CFO',
      body: `Following the Q1 audit, the Finance team has updated the employee expenses policy. Key changes: pre-approval is now required for all items over £50 (previously £75); hotel bookings must be made via TravelDesk a minimum of 5 days in advance; client entertainment requires VP-level sign-off.

The updated policy (v4.2) is available on the intranet. All expenses submitted under the old policy after 1 May will be returned. Questions to finance@meridian.co.uk.`
    }
  ];
  
  return (
    <div className="intranet-news">
      <h2>Internal News</h2>
      {articles.map((article, idx) => (
        <div key={idx} className="intranet-article">
          <h3 className="intranet-article-headline">{article.headline}</h3>
          <div className="intranet-article-meta">
            {article.date} | Author: {article.author}
          </div>
          <div className="intranet-article-body">
            {article.body.split('\n\n').map((para, pidx) => (
              <p key={pidx}>{para}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Projects tab
const ProjectsTab = ({ onNavigate }) => {
  const playerName = useSelector(selectPlayerName);
  
  const projects = [
    { name: 'Vantage', client: 'NHS Digital', status: 'AMBER', pm: playerName, updated: 'Today' },
    { name: 'Fusion', client: 'Bristol City Council', status: 'GREEN', pm: 'Jess Okafor', updated: '2 days ago' },
    { name: 'Helix', client: 'HMRC', status: 'GREEN', pm: '(Axiom) TBC', updated: '1 week ago' },
    { name: 'Atlas', client: 'Private — NDA', status: 'RED', pm: 'Marcus Webb', updated: '3 weeks ago' }
  ];
  
  const handleProjectClick = (project) => {
    if (project.name === 'Vantage') {
      // Open Synergy Drive
      window.dispatchEvent(new CustomEvent('focus-app', {
        detail: { appId: 'synergy' }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { message: 'Project hub — access restricted. Contact your PM.' }
      }));
    }
  };
  
  return (
    <div className="intranet-projects">
      <h2>Active Projects</h2>
      <table className="intranet-projects-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th>Status</th>
            <th>PM</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr 
              key={project.name} 
              className="intranet-project-row"
              onClick={() => handleProjectClick(project)}
            >
              <td>{project.name}</td>
              <td>{project.client}</td>
              <td>
                <span className={`intranet-status-dot ${project.status.toLowerCase()}`} />
                {project.status}
              </td>
              <td>{project.pm}</td>
              <td>{project.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// IT Support tab
const ITSupportTab = () => {
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    priority: ''
  });
  const [ticketRaised, setTicketRaised] = useState(false);
  const [ticketRef, setTicketRef] = useState('');
  
  // Wire up Carl's notification
  useITSupportNotification(ticketRaised);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.subject.trim()) {
      const ref = `MER-IT-${Math.floor(Math.random() * 90000) + 10000}`;
      setTicketRef(ref);
      setTicketRaised(true);
      setFormData({ category: '', subject: '', description: '', priority: '' });
    }
  };
  
  if (ticketRaised) {
    return (
      <div className="intranet-itsupport">
        <h2>IT Support</h2>
        <div className="intranet-ticket-confirmation">
          <Icon fafa="faCheckCircle" width={48} />
          <h3>Ticket Raised</h3>
          <p className="intranet-ticket-ref">{ticketRef}</p>
          <p>Response within 3 business days.</p>
          <button 
            className="intranet-btn"
            onClick={() => setTicketRaised(false)}
          >
            Raise Another Ticket
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="intranet-itsupport">
      <h2>IT Support</h2>
      <form className="intranet-ticket-form" onSubmit={handleSubmit}>
        <div className="intranet-form-field">
          <label>Category</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="">Select...</option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="access">Access</option>
            <option value="network">Network</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="intranet-form-field">
          <label>Subject</label>
          <input 
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            placeholder="Brief description of the issue"
          />
        </div>
        
        <div className="intranet-form-field">
          <label>Description</label>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={4}
            placeholder="Detailed description of the issue"
          />
        </div>
        
        <div className="intranet-form-field">
          <label>Priority</label>
          <select 
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="">Select...</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          className="intranet-btn-primary"
          disabled={!formData.subject.trim()}
        >
          Raise Ticket
        </button>
      </form>
    </div>
  );
};

// Expense Policy page
const ExpensePolicyPage = ({ onBack }) => {
  return (
    <div className="intranet-expense-policy">
      <button className="intranet-back-btn" onClick={onBack}>
        <Icon fafa="faArrowLeft" width={14} /> Back
      </button>
      
      <div className="intranet-document">
        <h1>MERIDIAN INFRASTRUCTURE SERVICES</h1>
        <h2>EMPLOYEE EXPENSES POLICY v4.2</h2>
        <p className="intranet-doc-meta">Effective: 1 May 2024 | Owner: Finance | Approved: Priya Nair</p>
        
        <div className="intranet-doc-section">
          <h3>1. GENERAL PRINCIPLES</h3>
          <p>All business expenses must be reasonable, necessary, and incurred wholly for business purposes. Receipts are required for all claims. Expenses without receipts will not be reimbursed.</p>
        </div>
        
        <div className="intranet-doc-section">
          <h3>2. AUTHORISATION LIMITS</h3>
          <ul>
            <li>Up to £50: Submit via TravelDesk, no pre-approval required.</li>
            <li>£50–£250: Pre-approval from line manager required before incurring the expense.</li>
            <li>Over £250: Pre-approval from department head and Finance required.</li>
          </ul>
        </div>
        
        <div className="intranet-doc-section">
          <h3>3. TRAVEL</h3>
          <ul>
            <li>Rail: Standard class unless journey exceeds 3 hours.</li>
            <li>Air: Economy class. Business class requires CFO approval.</li>
            <li>Hotel: Maximum £150/night London, £110/night elsewhere. Book via TravelDesk.</li>
            <li>Mileage: 25p per mile (personal vehicle, pre-approved journeys only).</li>
          </ul>
        </div>
        
        <div className="intranet-doc-section">
          <h3>4. CLIENT ENTERTAINMENT</h3>
          <ul>
            <li>Meals: Up to £75 per head with prior approval from line manager.</li>
            <li>Events / hospitality: VP-level sign-off required.</li>
            <li>Alcohol: May be included in meal claims. Cannot be claimed separately.</li>
          </ul>
        </div>
        
        <div className="intranet-doc-section">
          <h3>5. SUBMISSION</h3>
          <p>All expenses must be submitted within 30 days of being incurred. Late submissions may be declined at Finance's discretion. Submit via TravelDesk. Queries to finance@meridian.co.uk.</p>
        </div>
      </div>
    </div>
  );
};

// Main Intranet component
export const Intranet = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onNavigate={setActiveTab} />;
      case 'people':
        return <PeopleTab />;
      case 'news':
        return <NewsTab />;
      case 'projects':
        return <ProjectsTab onNavigate={setActiveTab} />;
      case 'support':
        return <ITSupportTab />;
      case 'expense-policy':
        return <ExpensePolicyPage onBack={() => setActiveTab('home')} />;
      default:
        return <HomeTab onNavigate={setActiveTab} />;
    }
  };
  
  return (
    <div className="intranet-container">
      <div className="intranet-header">
        <div className="intranet-logo">
          <span className="intranet-logo-icon">M</span>
          <span className="intranet-logo-text">Meridian Infrastructure Services</span>
        </div>
        <nav className="intranet-nav">
          {[
            { id: 'home', label: 'Home' },
            { id: 'people', label: 'People' },
            { id: 'news', label: 'News' },
            { id: 'projects', label: 'Projects' },
            { id: 'support', label: 'IT Support' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`intranet-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="intranet-body">
        {renderTab()}
      </div>
    </div>
  );
};

export default Intranet;
