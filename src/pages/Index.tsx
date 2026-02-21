import NetflixNavbar from "@/components/NetflixNavbar";
import NetflixHero from "@/components/NetflixHero";
import ContentRow from "@/components/ContentRow";
import { courseFolders } from "@/data/courseData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NetflixNavbar />
      <NetflixHero />

      {/* Content rows - pulled up over hero */}
      <div className="-mt-20 relative z-10 pb-16">
        {courseFolders.map((folder) => (
          <ContentRow
            key={folder.id}
            title={folder.title}
            lessons={folder.lessons}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
