import { useState } from "react";
import CourseSidebar from "@/components/CourseSidebar";
import MobileSidebar from "@/components/MobileSidebar";
import WelcomeBanner from "@/components/WelcomeBanner";
import FolderContent from "@/components/FolderContent";

const Index = () => {
  const [activeFolder, setActiveFolder] = useState("introducao");

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile nav */}
      <MobileSidebar activeFolder={activeFolder} onFolderClick={setActiveFolder} />

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <CourseSidebar activeFolder={activeFolder} onFolderClick={setActiveFolder} />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10 max-w-4xl">
          <WelcomeBanner />
          <FolderContent folderId={activeFolder} />
        </main>
      </div>
    </div>
  );
};

export default Index;
