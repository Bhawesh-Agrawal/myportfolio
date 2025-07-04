import Navbar from "@/Components/Navbar/page";
import HeroText from "@/Components/HeroText/page";
import BoxAnimate from "@/Components/Home/page";
import TimelineStudy from "@/Components/TimelineStudy/page";
import Framework from "@/Components/Framework/page";
import AnimatedLine from "@/Components/Workflow/Workflow";
import LandingProjectsSlider from "@/Components/ProjectCard/pageProject";
import AchievementsSection from "@/Components/Achievements/Achievements";

const page = ()=>{
    return(
        <div className="w-full flex flex-col gap-5">
            <div>
                <Navbar />
            </div>
            <AnimatedLine />
            <div>
                <HeroText />
            </div>
            <div>
                <BoxAnimate />
            </div>
            <div>
                <Framework />
            </div>
            <div>
                <TimelineStudy />
            </div>
            <div>
                <LandingProjectsSlider />
            </div>
            <div>
                <AchievementsSection />
            </div>
        </div>
    )
}

export default page;