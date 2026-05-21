export const chunkProfileData = (profileData) => {
    const chunks = []

    //profile
    if (profileData.profile) {
        chunks.push({
            type: "profile",
            text: `
            Name: ${profileData.profile.name}
            Bio: ${profileData.profile.bio}
            `
        })
    }
}