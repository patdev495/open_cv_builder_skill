import { useState, useEffect } from 'react';
import { EditorWorkspace } from './components/EditorWorkspace';
import { InteractivePortfolio } from './components/InteractivePortfolio';

export default function App() {
  const [slug, setSlug] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isRouting, setIsRouting] = useState<boolean>(true);
  const [unlockedPasscode, setUnlockedPasscode] = useState<string>('');

  useEffect(() => {
    const path = window.location.pathname.substring(1).trim().toLowerCase();
    if (path) {
      setSlug(path);
      // By default, if there is a slug, we show the Interactive Portfolio (Public View)
      // The user must click Edit and enter a passcode to unlock the Editor Workspace.
      setIsEditMode(false);
    } else {
      // If there is no slug (root URL), we are creating a new CV
      setIsEditMode(true);
    }
    setIsRouting(false);
  }, []);

  const handleExitEditMode = () => {
    if (slug) {
      setIsEditMode(false);
    }
  };

  const handleUnlockSuccess = (passcode: string) => {
    setUnlockedPasscode(passcode);
    setIsEditMode(true);
  };

  if (isRouting) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>;
  }

  if (isEditMode) {
    return <EditorWorkspace onExit={handleExitEditMode} initialPasscode={unlockedPasscode} />;
  }

  return (
    <InteractivePortfolio 
      slug={slug} 
      onUnlock={handleUnlockSuccess}
    />
  );
}
