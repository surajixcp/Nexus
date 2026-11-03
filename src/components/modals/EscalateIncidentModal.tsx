import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Incident, EscalationLevel } from '../../types';
import { Modal } from '../ui/Modal';
import { Flame, AlertTriangle } from 'lucide-react';

interface EscalateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
}

export const EscalateIncidentModal: React.FC<EscalateIncidentModalProps> = ({
  isOpen,
  onClose,
  incident,
}) => {
  const { escalateIncident } = useApp();

  const [level, setLevel] = useState<EscalationLevel>('L2');
  const [reason, setReason] = useState('Response SLA approaching breach threshold with ongoing customer impact.');
  const [notes, setNotes] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('Demo PayWave L3 Engineering');
  const [owner, setOwner] = useState('Priya Sharma');

  if (!incident) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    escalateIncident(incident.id, level, reason, notes, assignedTeam, owner);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Escalate Incident: ${incident.ticketId}`}
      description="Trigger automated organizational escalation, notify escalation owners, and adjust response routing."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Escalation Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['L1', 'L2', 'L3', 'Management'] as EscalationLevel[]).map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all text-center ${
                  level === lvl
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Escalation Reason <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 dark:text-white"
          >
            <option value="Response SLA approaching breach threshold with ongoing customer impact.">
              SLA Breach Imminent (&gt; 75% elapsed)
            </option>
            <option value="Requires specialized Tier-3 engineering triage for code/infrastructure defect.">
              Tier-3 Engineering & Infrastructure Specialist Required
            </option>
            <option value="Executive visibility required: Mission critical revenue service failure.">
              Executive Notification: Mission Critical Service Failure
            </option>
            <option value="Upstream third-party / card scheme dependency unresponsive.">
              Third-Party Vendor / Network Operator Escalation
            </option>
            <option value="Customer executive escalation received from major corporate account.">
              Key Account Client Management Escalation
            </option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Team <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={assignedTeam}
              onChange={(e) => setAssignedTeam(e.target.value)}
              className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Escalation Owner <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Escalation Handover Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide context, captured telemetry, and specific actions requested from the escalation team..."
            className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 dark:text-white"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-all"
          >
            <Flame className="w-4 h-4" />
            Dispatch Escalation
          </button>
        </div>
      </form>
    </Modal>
  );
};
