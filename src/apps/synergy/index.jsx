import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToolBar, Icon } from "../../utils/general";
import { selectCurrentGameMinutes, advanceGameTime } from "../../player/gameTime";
import { setMultipleHiddenFlags } from "../../player/hiddenState";
import { updateStats } from "../../player/store";
import { findNodeByPath, getFolderChildren, synergyRoot } from "../../scenarios/meridian/content/documents";
import { createDay1Tasks } from "../../scenarios/meridian/content/tasks";
import { createArchiveChoice, handleFailedHrSubmission, handleSuccessfulHrSubmission, resolveArchiveChoice } from "../../player/events/day1";
import "./synergy.scss";

const DEAD_END_PATHS = [
  "/Shared/Reading/",
  "/Shared/Training/Paul_Induction/",
  "/Shared/Training/Paul_Induction/Reading/",
  "/Shared/Staff_Folders/Academic_Team/Paul's Files/Reading/",
];

const defaultHrForm = () => ({
  legalName: "New Team Member",
  preferredName: "",
  dob: "",
  homeAddress: "",
  postcode: "",
  phone: "",
  personalEmail: "",
  niNumber: "",
  hmrcStatement: "",
  studentLoan: false,
  surfingIncome: true,
  bankName: "",
  sortCode: "",
  accountNumber: "",
  accountHolder: "",
  unexplainedField: "",
  nextOfKinName: "",
  nextOfKinRelationship: "",
  nextOfKinPhone: "",
  nextOfKinAddress: "",
  sustainabilityAware: false,
  climateCommitment: false,
  valuesRead: false,
  pronouns: "",
  paulReading: false,
  declaration: false,
  signature: "",
  signatureAttempts: 0,
  timestamp: "",
});

const defaultProfileForm = (playerName) => ({
  fullName: playerName,
  preferredName: "",
  role: "Senior Strategy Associate",
  previousExperience: "",
  keySkills: [],
  socials: {
    coffee: true,
    awayDays: true,
    surf: true,
    netball: true,
    morale: true,
  },
  dietary: "",
  biggestStrength: "",
  development: "Continuing to optimise communication, embracing ambiguity, and leaning into data-led decision making",
  feedbackPreference: "",
  celebrateWins: "",
  comments: "",
});

const isUsPhoneLike = (value) => /^\d{2}\/\d{2}\/\d{4}( \d{2}:\d{2})?$/.test(value.trim());
const isUkPhoneLike = (value) => /^[0-9 +()]{10,}$/.test(value.trim());
const isSixDigits = (value) => /^\d{6}$/.test(value.trim());
const isEightDigits = (value) => /^\d{8}$/.test(value.trim());

const SidebarNode = ({ path, selectedPath, onSelect, depth = 0 }) => {
  const node = findNodeByPath(path);
  if (!node || node.type !== "folder") return null;

  const children = getFolderChildren(path);

  return (
    <div className="synergy-tree-node">
      <button
        className={`synergy-tree-item ${selectedPath === path ? "active" : ""}`}
        onClick={() => onSelect(path)}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
      >
        <Icon fafa="faFolder" width={14} />
        <span>{node.name || "Shared"}</span>
      </button>
      {children.map((child) =>
        child.type === "folder" ? (
          <SidebarNode
            key={child.path}
            path={child.path}
            selectedPath={selectedPath}
            onSelect={onSelect}
            depth={depth + 1}
          />
        ) : (
          <button
            key={child.path}
            className={`synergy-tree-item synergy-tree-leaf ${selectedPath === child.path ? "active" : ""}`}
            onClick={() => onSelect(child.path)}
            style={{ paddingLeft: `${26 + depth * 14}px` }}
          >
            <Icon fafa={child.type === "spreadsheet" ? "faTable" : child.type === "pptx" ? "faFilePowerpoint" : "faFileAlt"} width={14} />
            <span>{child.name}</span>
          </button>
        )
      )}
    </div>
  );
};

const DocumentPane = ({ node }) => {
  if (!node) {
    return (
      <div className="synergy-empty">
        <Icon fafa="faFolderOpen" width={48} />
        <p>Select a file or folder.</p>
      </div>
    );
  }

  if (node.type === "folder") {
    return (
      <div className="synergy-document">
        <h1>{node.path}</h1>
        <div className="synergy-document-content">
          {node.children.length === 0 ? <p>This folder is empty.</p> : node.children.map((child) => <p key={child.path}>{child.name}</p>)}
        </div>
      </div>
    );
  }

  if (node.type === "spreadsheet") {
    return (
      <div className="synergy-document">
        <h1>{node.name}</h1>
        {node.author && <p>Author metadata: {node.author}</p>}
        <div className="synergy-risk-table-container">
          <table className="synergy-risk-table">
            <thead>
              <tr>
                {node.headers?.map((header) => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {node.rows?.map((row, index) => (
                <tr key={`${node.id}-${index}`}>
                  {row.map((cell, cellIndex) => <td key={`${node.id}-${index}-${cellIndex}`}>{cell ?? ""}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (node.type === "pptx") {
    return (
      <div className="synergy-document">
        <h1>{node.name}</h1>
        <p>61 slides</p>
        <div className="synergy-document-content">
          {node.slides?.slice(0, 12).map((slide, index) => (
            <p key={`${node.id}-slide-${index}`}>Slide {index + 1}: {slide}</p>
          ))}
          <p>...</p>
          <p>Slide 47: {node.slides?.[46]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="synergy-document">
      <h1>{node.name}</h1>
      <div className="synergy-document-content">
        {(node.body || "").split("\n\n").map((paragraph, index) => (
          <p key={`${node.id}-${index}`}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
};

export const Synergy = ({ initialView = null }) => {
  const wnapp = useSelector((state) => state.apps.synergy);
  const dispatch = useDispatch();
  const currentGameMinutes = useSelector(selectCurrentGameMinutes);
  const hiddenState = useSelector((state) => state.player?.hiddenState || {});
  const playerName = useSelector((state) => state.player?.displayName || "[PLAYER]");

  const [selectedPath, setSelectedPath] = useState(initialView || "/Shared/");
  const [hrForm, setHrForm] = useState(defaultHrForm);
  const [profileForm, setProfileForm] = useState(() => defaultProfileForm(playerName));
  const [quizAnswers, setQuizAnswers] = useState(["", "", "", "", ""]);
  const [banner, setBanner] = useState("");
  const [archivePrompt, setArchivePrompt] = useState(false);
  const [archivePassword, setArchivePassword] = useState("");
  const [archiveMode, setArchiveMode] = useState<"denied" | "password" | "locked">("denied");

  const loginResolved = hiddenState.SYNERGY_LOGIN_RESOLVED;
  const loginRequestedAt = hiddenState.SYNERGY_LOGIN_REQUEST_MINUTE;
  const loginFailed = hiddenState.SYNERGY_LOGIN_FAILED;

  useEffect(() => {
    if (!loginResolved && loginRequestedAt !== null && currentGameMinutes >= loginRequestedAt + 42) {
      dispatch(setMultipleHiddenFlags({
        SYNERGY_LOGIN_RESOLVED: true,
      }));
    }
  }, [dispatch, loginResolved, loginRequestedAt, currentGameMinutes]);

  const selectedNode = useMemo(() => findNodeByPath(selectedPath), [selectedPath]);
  const tasks = createDay1Tasks().map((task) => {
    if (!loginResolved && task.status === "locked") {
      return task;
    }
    if (task.id === "day1-introduction" && hiddenState.INTRODUCTION_POSTED) {
      return { ...task, status: "done" };
    }
    if (task.id === "day1-hr-forms" && hiddenState.HR_FORM_COMPLETED) {
      return { ...task, status: "done" };
    }
    if (task.id === "day1-mpi-overview" && hiddenState.MPI_OVERVIEW_QUIZ_SUBMITTED) {
      return { ...task, status: "done" };
    }
    if (loginResolved) {
      return { ...task, status: task.status === "locked" ? "available" : task.status };
    }
    return task;
  });

  if (!wnapp) return null;

  const showBanner = (text) => {
    setBanner(text);
    window.setTimeout(() => setBanner(""), 4000);
  };

  const handleSelect = (path) => {
    const node = findNodeByPath(path);
    if (!node) return;

    if (!loginResolved && path !== "/Shared/") {
      return;
    }

    if (path === "/Shared/Archive_DO_NOT_USE/") {
      dispatch(updateStats({ stress: 1 }));
      dispatch(setMultipleHiddenFlags({ ARCHIVE_FIRST_SEEN: true }));

      if (hiddenState.ARCHIVE_ACCESSED) {
        setSelectedPath(path);
        return;
      }

      const lockoutUntil = hiddenState.ARCHIVE_LOCKOUT_UNTIL;
      const currentMinutes = currentGameMinutes;
      const isLockedOut = lockoutUntil !== null && currentMinutes < lockoutUntil;

      if (isLockedOut) {
        setArchiveMode("locked");
        setArchivePrompt(true);
      } else {
        setArchiveMode("password");
        setArchivePrompt(true);
      }
      return;
    }

    if (DEAD_END_PATHS.includes(path)) {
      const nextProgress = Math.min(3, (hiddenState.PAUL_DEAD_END_PROGRESS || 0) + 1);
      dispatch(setMultipleHiddenFlags({ PAUL_DEAD_END_PROGRESS: nextProgress }));
      if (nextProgress === 3 && !hiddenState.PAUL_READING_LIST_FOUND) {
        dispatch(updateStats({ stress: 3 }));
      }
    }

    if (path === "/Shared/Impact_Data/") {
      dispatch(setMultipleHiddenFlags({ IMPACT_DATA_PREVIEWED: true }));
    }

    if (node.middleEnglish && !hiddenState.PAUL_READING_LIST_FOUND) {
      dispatch(updateStats({ stress: 2 }));
      dispatch(setMultipleHiddenFlags({ PAUL_READING_LIST_FOUND: true }));
    }

    setSelectedPath(path);
  };

  const attemptLogin = () => {
    dispatch(setMultipleHiddenFlags({ SYNERGY_LOGIN_FAILED: true }));
  };

  const openItSupport = () => {
    dispatch({ type: "MERIDIANBROWSE", payload: "full" });
    window.dispatchEvent(new CustomEvent("meridianbrowse-open-support"));
  };

  const submitHrForm = () => {
    const allRequired = [
      hrForm.legalName,
      hrForm.dob,
      hrForm.homeAddress,
      hrForm.postcode,
      hrForm.phone,
      hrForm.personalEmail,
      hrForm.niNumber,
      hrForm.bankName,
      hrForm.sortCode,
      hrForm.accountNumber,
      hrForm.signature,
    ].every((field) => field && field.trim().length > 0);

    if (!allRequired) {
      showBanner("Please complete all required fields.");
      return;
    }

    if (!hrForm.declaration) {
      showBanner("Please confirm the declaration.");
      return;
    }

    if (hrForm.signatureAttempts >= 3) {
      handleFailedHrSubmission(dispatch, currentGameMinutes, true);
      setHrForm(defaultHrForm());
      return;
    }

    handleSuccessfulHrSubmission(dispatch, currentGameMinutes);
    dispatch(advanceGameTime(currentGameMinutes + 15));
    setHrForm(defaultHrForm());
  };

  const submitProfile = () => {
    dispatch(updateStats({ stress: 2 }));
    dispatch(setMultipleHiddenFlags({ NEW_STARTER_PROFILE_SUBMITTED: true }));
    dispatch(advanceGameTime(currentGameMinutes + 10));
    showBanner("Profile Aligned");
  };

  const submitQuiz = () => {
    const allFieldsFilled = quizAnswers.every((answer) => answer.trim().length > 0);
    if (!allFieldsFilled) {
      showBanner("Please answer all questions before submitting.");
      return;
    }

    // Check Q5 for keywords: progress delta, Implementation Quality Score, stability coefficient
    const q5Answer = quizAnswers[4].toLowerCase();
    const hasProgressDelta = q5Answer.includes("progress delta") || q5Answer.includes("progressdelta");
    const hasIQS = q5Answer.includes("implementation quality score") || q5Answer.includes("iqs");
    const hasStabilityCoefficient = q5Answer.includes("stability coefficient");

    if (hasProgressDelta && hasIQS && hasStabilityCoefficient) {
      dispatch(setMultipleHiddenFlags({
        MPI_OVERVIEW_READ: true,
        MPI_OVERVIEW_QUIZ_SUBMITTED: true,
        MPI_QUIZ_Q5_ANSWERED_CORRECTLY: true,
      }));
      dispatch(updateStats({ stress: -2 }));
    } else {
      dispatch(setMultipleHiddenFlags({
        MPI_OVERVIEW_READ: true,
        MPI_OVERVIEW_QUIZ_SUBMITTED: true,
      }));
      dispatch(updateStats({ stress: 4 }));
    }

    dispatch(advanceGameTime(currentGameMinutes + 20));
    showBanner("Responses received. Thank you.");
    setQuizAnswers(["", "", "", "", ""]);
  };

  const submitArchivePassword = () => {
    if (archivePassword === "meridian2019") {
      dispatch(setMultipleHiddenFlags({
        ARCHIVE_ACCESSED: true,
        ARCHIVE_PASSWORD_ATTEMPTS: 0,
        ARCHIVE_LOCKOUT_UNTIL: null,
      }));
      setArchivePassword("");
      setArchivePrompt(false);
      setSelectedPath("/Shared/Archive_DO_NOT_USE/");
      showBanner("Access granted.");
    } else {
      const currentAttempts = hiddenState.ARCHIVE_PASSWORD_ATTEMPTS || 0;
      const newAttempts = currentAttempts + 1;

      if (newAttempts >= 3) {
        const lockoutMinutes = currentGameMinutes + (24 * 60);
        dispatch(setMultipleHiddenFlags({
          ARCHIVE_PASSWORD_ATTEMPTS: newAttempts,
          ARCHIVE_LOCKOUT_UNTIL: lockoutMinutes,
        }));
        setArchiveMode("locked");
        setArchivePassword("");
        showBanner("Too many failed attempts. Access locked for 24 hours.");
      } else {
        dispatch(setMultipleHiddenFlags({
          ARCHIVE_PASSWORD_ATTEMPTS: newAttempts,
        }));
        setArchivePassword("");
        showBanner(`Incorrect password. ${3 - newAttempts} attempts remaining.`);
      }
    }
  };

  const renderContent = () => {
    if (!loginResolved) {
      return (
        <div className="synergy-document">
          <h1>SynergyDrive</h1>
          <div className="synergy-document-content">
            <p>Enter credentials to continue.</p>
            {loginFailed ? (
              <>
                <p>Your credentials could not be verified. Please contact IT support.</p>
                <div className="outbox-compose-actions">
                  <button className="outbox-btn-primary" onClick={openItSupport}>IT Support</button>
                  <button className="outbox-btn-secondary" onClick={attemptLogin}>Try Again</button>
                </div>
              </>
            ) : (
              <button className="outbox-btn-primary" onClick={attemptLogin}>Sign in</button>
            )}
          </div>
        </div>
      );
    }

    if (selectedNode?.type === "hr_form") {
      return (
        <div className="synergy-document">
          <h1>{selectedNode.name}</h1>
          <div className="synergy-document-content">
            <p>Full legal name</p>
            <input value={hrForm.legalName} onChange={(e) => setHrForm({ ...hrForm, legalName: e.target.value })} />
            <p>Preferred name</p>
            <select value={hrForm.preferredName} onChange={(e) => setHrForm({ ...hrForm, preferredName: e.target.value })}>
              <option value="">Select...</option>
              <option value="Thriving Colleague">Thriving Colleague</option>
              <option value="Valued Contributor">Valued Contributor</option>
            </select>
            <p>Date of birth</p>
            <input value={hrForm.dob} onChange={(e) => setHrForm({ ...hrForm, dob: e.target.value })} />
            <p>Home address</p>
            <input value={hrForm.homeAddress} onChange={(e) => setHrForm({ ...hrForm, homeAddress: e.target.value })} />
            <p>Postcode</p>
            <input value={hrForm.postcode} onChange={(e) => setHrForm({ ...hrForm, postcode: e.target.value })} />
            <p>Phone</p>
            <input value={hrForm.phone} onChange={(e) => setHrForm({ ...hrForm, phone: e.target.value })} />
            <p>Personal email</p>
            <input value={hrForm.personalEmail} onChange={(e) => setHrForm({ ...hrForm, personalEmail: e.target.value })} />
            <p>National Insurance number</p>
            <input value={hrForm.niNumber} onChange={(e) => setHrForm({ ...hrForm, niNumber: e.target.value })} />
            <p>HMRC statement</p>
            <select value={hrForm.hmrcStatement} onChange={(e) => setHrForm({ ...hrForm, hmrcStatement: e.target.value })}>
              <option value="">Select...</option>
              <option value="A">Statement A</option>
              <option value="B">Statement B</option>
              <option value="C">Statement C</option>
            </select>
            <label><input type="checkbox" checked={hrForm.studentLoan} onChange={(e) => setHrForm({ ...hrForm, studentLoan: e.target.checked })} /> Student / postgraduate loan</label>
            <label><input type="checkbox" checked={hrForm.surfingIncome} onChange={(e) => setHrForm({ ...hrForm, surfingIncome: e.target.checked })} /> I confirm I am not receiving any surfing-related sponsorship income this tax year</label>
            <p>Bank name</p>
            <input value={hrForm.bankName} onChange={(e) => setHrForm({ ...hrForm, bankName: e.target.value })} />
            <p>Sort code</p>
            <input value={hrForm.sortCode} onChange={(e) => setHrForm({ ...hrForm, sortCode: e.target.value })} />
            <p>Account number</p>
            <input value={hrForm.accountNumber} onChange={(e) => setHrForm({ ...hrForm, accountNumber: e.target.value })} />
            <p>Account holder name</p>
            <input value={hrForm.accountHolder} onChange={(e) => setHrForm({ ...hrForm, accountHolder: e.target.value })} />
            <p>*</p>
            <input value={hrForm.unexplainedField} onChange={(e) => setHrForm({ ...hrForm, unexplainedField: e.target.value })} placeholder="Validating with SynergyDrive..." />
            <p>Next of kin name</p>
            <input value={hrForm.nextOfKinName} onChange={(e) => setHrForm({ ...hrForm, nextOfKinName: e.target.value })} />
            <p>Relationship</p>
            <input value={hrForm.nextOfKinRelationship} onChange={(e) => setHrForm({ ...hrForm, nextOfKinRelationship: e.target.value })} />
            <p>Next of kin phone</p>
            <input value={hrForm.nextOfKinPhone} onChange={(e) => setHrForm({ ...hrForm, nextOfKinPhone: e.target.value })} />
            <p>Next of kin address</p>
            <input value={hrForm.nextOfKinAddress} onChange={(e) => setHrForm({ ...hrForm, nextOfKinAddress: e.target.value })} />
            <label><input type="checkbox" checked={hrForm.sustainabilityAware} onChange={(e) => setHrForm({ ...hrForm, sustainabilityAware: e.target.checked })} /> Is this person also aware of your sustainability commitments?</label>
            <label><input type="checkbox" checked={hrForm.climateCommitment} onChange={(e) => setHrForm({ ...hrForm, climateCommitment: e.target.checked })} /> I agree to factor climate and sustainability considerations into all deliverables where practical.</label>
            <label><input type="checkbox" checked={hrForm.valuesRead} onChange={(e) => setHrForm({ ...hrForm, valuesRead: e.target.checked })} /> I have read and understood the company values: Transforming Outcomes Through Evidence-Led Practice</label>
            <p>Preferred pronouns / communication style</p>
            <input value={hrForm.pronouns} onChange={(e) => setHrForm({ ...hrForm, pronouns: e.target.value })} />
            <label><input type="checkbox" checked={hrForm.paulReading} onChange={(e) => setHrForm({ ...hrForm, paulReading: e.target.checked })} /> I confirm I will engage positively with Paul's induction reading list</label>
            <label><input type="checkbox" checked={hrForm.declaration} onChange={(e) => setHrForm({ ...hrForm, declaration: e.target.checked })} /> I declare that the above information is accurate to the best of my knowledge and will support Meridian in delivering impactful outcomes.</label>
            <p>Signature</p>
            <input value={hrForm.signature} onChange={(e) => setHrForm({ ...hrForm, signature: e.target.value })} placeholder="Type any squiggle" />
            <button className="outbox-btn-secondary" onClick={() => setHrForm({ ...hrForm, signatureAttempts: hrForm.signatureAttempts + 1 })}>Reset signature</button>
            <p>Date / time stamp (American format)</p>
            <input value={hrForm.timestamp} onChange={(e) => setHrForm({ ...hrForm, timestamp: e.target.value })} placeholder="MM/DD/YYYY 09:00" />
            <div className="outbox-compose-actions">
              <button className="outbox-btn-primary" onClick={submitHrForm}>Submit to HR</button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedNode?.type === "quiz") {
      return (
        <div className="synergy-document">
          <h1>{selectedNode.name}</h1>
          <div className="synergy-document-content">
            {(selectedNode.body || "").split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {quizAnswers.map((answer, index) => (
              <div key={`quiz-${index}`}>
                <p>Question {index + 1}</p>
                <textarea value={answer} onChange={(e) => {
                  const next = [...quizAnswers];
                  next[index] = e.target.value;
                  setQuizAnswers(next);
                }} />
              </div>
            ))}
            <div className="outbox-compose-actions">
              <button className="outbox-btn-primary" onClick={submitQuiz}>Submit</button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedNode?.type === "new_starter_profile") {
      return (
        <div className="synergy-document">
          <h1>{selectedNode.name}</h1>
          <div className="synergy-document-content">
            <p>Full Name</p>
            <input value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} />
            <p>Preferred Name</p>
            <select value={profileForm.preferredName} onChange={(e) => setProfileForm({ ...profileForm, preferredName: e.target.value })}>
              <option value="">Select...</option>
              <option value="Thriving">Thriving</option>
              <option value="Impactful">Impactful</option>
            </select>
            <p>Role / Position</p>
            <input value={profileForm.role} readOnly />
            <p>Previous Experience</p>
            <textarea value={profileForm.previousExperience} onChange={(e) => setProfileForm({ ...profileForm, previousExperience: e.target.value.slice(0, 200) })} />
            <p>Key Skills</p>
            <div>
              {["Cascading upwards", "Optimising synergies", "Data DAY-ta handling", "Surf-adjacent resilience", "High-level visibility", "Iterative momentum", "Stakeholder alignment", "Sustainability integration", "Proactive stage-thinking"].map((skill) => (
                <label key={skill} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={profileForm.keySkills.includes(skill)}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      keySkills: e.target.checked ? [...profileForm.keySkills, skill] : profileForm.keySkills.filter((entry) => entry !== skill)
                    })}
                  />
                  {skill}
                </label>
              ))}
            </div>
            <p>Any dietary requirements or preferences?</p>
            <input value={profileForm.dietary} onChange={(e) => {
              setProfileForm({ ...profileForm, dietary: e.target.value });
              window.setTimeout(() => setProfileForm((current) => ({ ...current, dietary: "" })), 3000);
            }} />
            <p>Biggest strength</p>
            <input value={profileForm.biggestStrength} onChange={(e) => setProfileForm({ ...profileForm, biggestStrength: e.target.value })} />
            <p>Areas for development</p>
            <textarea value={profileForm.development} onChange={(e) => setProfileForm({ ...profileForm, development: e.target.value })} />
            <p>Favourite way to receive feedback</p>
            <select value={profileForm.feedbackPreference} onChange={(e) => setProfileForm({ ...profileForm, feedbackPreference: e.target.value })}>
              <option value="">Select...</option>
              <option value="Cascading upwards">Cascading upwards</option>
              <option value="High-level check-ins">High-level check-ins</option>
              <option value="Proactive stage updates">Proactive stage updates</option>
              <option value="Warm regards only">Warm regards only</option>
            </select>
            <p>How do you prefer to celebrate wins?</p>
            <select value={profileForm.celebrateWins} onChange={(e) => setProfileForm({ ...profileForm, celebrateWins: e.target.value })}>
              <option value="">Select...</option>
              <option value="Emoji reactions in Flack">Emoji reactions in Flack</option>
              <option value="Public shout-outs in #general">Public shout-outs in #general</option>
              <option value="Quiet internal alignment">Quiet internal alignment</option>
              <option value="Surf-related metaphors">Surf-related metaphors</option>
            </select>
            <p>Comments</p>
            <textarea value={profileForm.comments} onChange={(e) => setProfileForm({ ...profileForm, comments: e.target.value })} />
            <div className="outbox-compose-actions">
              <button className="outbox-btn-primary" onClick={submitProfile}>Align & Submit</button>
            </div>
          </div>
        </div>
      );
    }

    return <DocumentPane node={selectedNode} />;
  };

  return (
    <div
      className="synergy floatTab dpShad"
      data-size={wnapp?.size}
      data-max={wnapp?.max}
      style={{
        ...(wnapp?.size == "cstm" ? wnapp?.dim : null),
        zIndex: wnapp?.z
      }}
      data-hide={wnapp?.hide}
      id={wnapp?.icon + "App"}
    >
      <ToolBar app={wnapp?.action} icon={wnapp?.icon} size={wnapp?.size} name="SynergyDrive" />
      <div className="windowScreen flex flex-col">
        {banner && <div className="monitoring-banner"><div className="monitoring-content"><span className="monitoring-text">{banner}</span></div></div>}
        {archivePrompt && (
          <div className="synergy-document">
            {archiveMode === "locked" ? (
              <>
                <h1>Access Locked</h1>
                <div className="synergy-document-content">
                  <p>Too many failed password attempts. Access is locked for 24 hours.</p>
                  <p>Folder: /Shared/Archive_DO_NOT_USE/</p>
                  <div className="outbox-compose-actions">
                    <button className="outbox-btn-secondary" onClick={() => setArchivePrompt(false)}>Close</button>
                  </div>
                </div>
              </>
            ) : archiveMode === "password" ? (
              <>
                <h1>Password Required</h1>
                <div className="synergy-document-content">
                  <p>This folder is password protected.</p>
                  <p>Folder: /Shared/Archive_DO_NOT_USE/</p>
                  <p>Enter password:</p>
                  <input
                    type="password"
                    value={archivePassword}
                    onChange={(e) => setArchivePassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submitArchivePassword(); }}
                  />
                  <div className="outbox-compose-actions">
                    <button className="outbox-btn-primary" onClick={submitArchivePassword}>Submit</button>
                    <button className="outbox-btn-secondary" onClick={() => { setArchiveMode("denied"); setArchivePassword(""); }}>Cancel</button>
                  </div>
                  <div className="outbox-compose-actions" style={{ marginTop: "16px" }}>
                    <button className="outbox-btn-secondary" onClick={openItSupport}>IT Support</button>
                    <button className="outbox-btn-secondary" onClick={() => { resolveArchiveChoice(dispatch, "archive-nathaniel", currentGameMinutes); setArchivePrompt(false); }}>Message Nathaniel</button>
                    <button className="outbox-btn-secondary" onClick={() => { resolveArchiveChoice(dispatch, "archive-harry", currentGameMinutes); setArchivePrompt(false); }}>Message Harry</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1>Access Denied</h1>
                <div className="synergy-document-content">
                  <p>You do not have permission to view the contents of this folder.</p>
                  <p>Folder: /Shared/Archive_DO_NOT_USE/</p>
                  <p>For access, contact your line manager or IT support.</p>
                  <div className="outbox-compose-actions">
                    <button className="outbox-btn-primary" onClick={() => setArchiveMode("password")}>Enter Password</button>
                    <button className="outbox-btn-secondary" onClick={openItSupport}>IT Support</button>
                    <button className="outbox-btn-secondary" onClick={() => setArchivePrompt(false)}>Close</button>
                    <button className="outbox-btn-secondary" onClick={() => { resolveArchiveChoice(dispatch, "archive-nathaniel", currentGameMinutes); setArchivePrompt(false); }}>Message Nathaniel</button>
                    <button className="outbox-btn-secondary" onClick={() => { resolveArchiveChoice(dispatch, "archive-harry", currentGameMinutes); setArchivePrompt(false); }}>Message Harry</button>
                    <button className="outbox-btn-secondary" onClick={() => setArchivePrompt(false)}>Note and move on</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        <div className="synergy-main-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", height: "100%" }}>
          <div className="synergy-sidebar" style={{ borderRight: "1px solid rgba(0,0,0,0.08)", overflow: "auto", padding: "12px" }}>
            <div className="synergy-section-title">Tasks</div>
            {tasks.map((task) => (
              <div key={task.id} className="synergy-folder-row" style={{ marginBottom: "8px" }}>
                <strong>{task.title}</strong>
                <div>{task.status}</div>
              </div>
            ))}
            <div className="synergy-section-title" style={{ marginTop: "16px" }}>Files</div>
            <SidebarNode path={synergyRoot.path} selectedPath={selectedPath} onSelect={handleSelect} />
          </div>
          <div style={{ overflow: "auto", padding: "16px" }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
