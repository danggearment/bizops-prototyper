export const handleHighlightTeamRows = (
  teamIds: string[],
  isSuccess: boolean,
) => {
  setTimeout(() => {
    teamIds.forEach((teamId) => {
      const tr = document.getElementById(teamId)
      if (tr) {
        if (isSuccess) {
          tr.setAttribute(
            "style",
            "color:#1a8245; text-decoration: underline; background-color: #f0f9ff;",
          )
        } else {
          tr.setAttribute(
            "style",
            "color:#e10e0e; text-decoration: underline; background-color: #fef2f2;",
          )
        }

        setTimeout(() => {
          tr.setAttribute("style", "")
        }, 5000)
      }
    })
  })
}
