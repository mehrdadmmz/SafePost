import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

interface Requirement {
  label: string;
  regex: RegExp;
}

const requirements: Requirement[] = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'One uppercase letter (A-Z)', regex: /[A-Z]/ },
  { label: 'One lowercase letter (a-z)', regex: /[a-z]/ },
  { label: 'One number (0-9)', regex: /[0-9]/ },
  { label: 'One special character (!@#$%^&*)', regex: /[!@#$%^&*]/ },
];

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  return (
    <div className="mt-2 space-y-1.5">
      <p className="text-xs font-medium text-default-600 dark:text-default-400">
        Password requirements:
      </p>
      {requirements.map((req, index) => {
        const isMet = req.regex.test(password);
        return (
          <div key={index} className="flex items-center gap-2">
            {isMet ? (
              <Check size={14} className="text-success flex-shrink-0" />
            ) : (
              <X size={14} className="text-danger flex-shrink-0" />
            )}
            <span
              className={`text-xs ${
                isMet
                  ? 'text-success dark:text-success-400'
                  : 'text-default-500 dark:text-default-400'
              }`}
            >
              {req.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordRequirements;
