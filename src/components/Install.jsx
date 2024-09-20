import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone) {
      setShowPrompt(false);
      return;
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 right-0 left-0  bg-gray-800 text-white p-2 text-center z-50 flex items-center justify-between md:justify-center lg:justify-center xs:justify-center">
      <p className="mr-4 text-sm md:text-lg lg:text-lg text-center">Install our app for a better experience!</p>
      <button
        className="bg-blue-600 m-3 text-sm md:text-lg lg:text-lg text-white px-4 py-2 rounded-lg font-semibold"
        onClick={handleInstall}
      >
        Install
      </button>
      <button
        className="text-white"
        onClick={() => setShowPrompt(false)}
      >
        <FaTimes className="w-4  h-4 md:w-6 md:h-6 lg:w-6 lg:h-6" />
      </button>
    </div>
  );
};

export default InstallPrompt;
