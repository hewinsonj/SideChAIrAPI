function extractLifeEventsFromMessages(messages) {
  if (!Array.isArray(messages)) return []

  const keywords = [
    { keyword: 'lost my job', title: 'Job Loss', importance: 'high' },
    { keyword: 'divorce', title: 'Divorce', importance: 'high' },
    { keyword: 'diagnosed', title: 'Diagnosis', importance: 'medium' },
    { keyword: 'moving', title: 'Relocation', importance: 'medium' },
    { keyword: 'pregnant', title: 'Pregnancy', importance: 'medium' },
  ]

  const events = []

  messages.forEach((msg, index) => {
    if (msg.speaker !== 'patient') return

    const contentLower = msg.content.toLowerCase()
    keywords.forEach(({ keyword, title, importance }) => {
      if (contentLower.includes(keyword)) {
        events.push({
          title,
          description: `Patient mentioned: "${msg.content}"`,
          importance,
          relatedMessageIndex: index
        })
      }
    })
  })

  return events
}

function filterLifeEventsByAccess(user, conversation) {
  if (!user || !conversation) return []

  const isPatient = conversation.patientId?.equals(user._id) || conversation.patient?.equals(user._id)
  const isTherapist = conversation.therapist?.equals(user._id) || conversation.owner?.equals(user._id)
  const isSharedWith = Array.isArray(conversation.sharedWithTherapists) &&
    conversation.sharedWithTherapists.some(id => id.equals(user._id))

  return (isPatient || isSharedWith || isTherapist) ? conversation.lifeEvents : []
}

module.exports = { extractLifeEventsFromMessages, filterLifeEventsByAccess }
