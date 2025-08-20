import { useState } from "react";

const useTermsAgreement = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState(null);

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(
    localStorage.getItem("acceptedTerms") === "true",
  );

  const acceptTerms = (onAccept) => {
    localStorage.setItem("acceptedTerms", "true");
    setHasAcceptedTerms(true);
    setShowTerms(false);

    if (pendingCredentials && onAccept) {
      onAccept(pendingCredentials);
      setPendingCredentials(null);
    }
  };

  const declineTerms = () => {
    setShowTerms(false);
    setPendingCredentials(null);
  };

  return {
    showTerms,
    setShowTerms,
    setPendingCredentials,
    hasAcceptedTerms,
    acceptTerms,
    declineTerms,
  };
};

export { useTermsAgreement };
