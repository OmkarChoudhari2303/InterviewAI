import DashboardLayout from "../components/DashboardLayout.jsx";

import ProfileForm from "../components/ProfileForm.jsx";
import SkillsForm from "../components/SkillsForm.jsx";
import ExperienceForm from "../components/ExperienceForm.jsx";
import ProjectsForm from "../components/ProjectsForm.jsx";
import EducationForm from "../components/EducationForm.jsx";

function Dashboard(){
    return(
        <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileForm/>
            <SkillsForm/>
            <ProjectsForm/>
            <EducationForm/>
            <ExperienceForm/>
        </div>
        </DashboardLayout>
    )
}

export default Dashboard;