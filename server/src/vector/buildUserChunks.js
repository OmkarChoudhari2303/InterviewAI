export const buildUserChunks = ({
    profile,
    skills,
    projects,
    educations,
    experiences
}) => {
    const chunks = []

    //Profile
    if (profile) {

        chunks.push({

            type: "profile",

            text: JSON.stringify({

                name:
                    profile.name || profile.user?.name || "",

                bio:
                    profile.bio,

                github:
                    profile.githubUrl,

                linkedin:
                    profile.linkedinUrl

            })
        })
    }

    //Skills
    if (skills?.length) {

        chunks.push({

            type: "skills",

            text: `
            Technical Skills

            Skills:
            ${skills.map((skill) => skill.name).join(", ")}
            `
        })
    }

    // Projects

    projects?.forEach((project) => {

        chunks.push({

            type: "project",

            text: `
            Software Project

            Project Title:
            ${project.title}

            Project Description:
            ${project.description}

            Technologies Used:
            ${project.techStack}
            `
        })
    })

    //Education
    educations?.forEach((education) => {

        chunks.push({

            type: "education",

            text: `
            Education Background

            College Name:
            ${education.collegeName}

            Degree:
            ${education.degree}

            Field Of Study:
            ${education.fieldOfStudy}

            Education Start Year:
            ${education.startYear}

            Education End Year:
            ${education.endYear}
            `
        })
    })

    // Experience

    experiences?.forEach((experience) => {

        chunks.push({

            type: "experience",

            text: `
            Professional Experience

            Company:
            ${experience.companyName}

            Role:
            ${experience.role}

            Work Experience Description:
            ${experience.description}

            Employment Start Date:
            ${experience.startDate}

            Employment End Date:
            ${experience.endDate}

            Currently Working:
            ${experience.currentlyWorking}
            `
        })
    })

    return chunks
}