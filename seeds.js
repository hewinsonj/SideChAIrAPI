const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sidechair')

// load models
const User = require('./app/models/user')
const Patient = require('./app/models/patient')
const Conversation = require('./app/models/conversation')
const JournalEntry = require('./app/models/journalEntry')
const TherapistRating = require('./app/models/therapistRating')
const PatientRating = require('./app/models/patientRating')
const SessionNote = require('./app/models/sessionNote')
const LifeContext = require('./app/models/lifeContext')
const SupportPerson = require('./app/models/supportPerson')
const AISummary = require('./app/models/aiSummary')
const AIScoring = require('./app/models/aiScoring')
const AITheme = require('./app/models/aiTheme')
const Keyword = require('./app/models/keyword')
const PersonMentioned = require('./app/models/personMentioned')
const WeeklyReflection = require('./app/models/weeklyReflection')
const ExportLog = require('./app/models/exportLog')
const Organization = require('./app/models/organization')
const FlaggedSession = require('./app/models/flaggedSession')
const TreatmentRecord = require('./app/models/treatmentRecord')


const seed = async () => {
  await mongoose.connection.dropDatabase()

  const hashed = await bcrypt.hash('test123', 10)

const user1 = await User.create({
  email: 'therapist@clinic.com',
  hashedPassword: hashed,
  role: 'therapist'
})

const user2 = await User.create({
  email: 'patient@home.com',
  hashedPassword: hashed,
  role: 'patient'
})

// Standardized patient naming for clarity
const patientUserB = await Patient.create({
  owner: user2._id, 
  userAccount: user2._id,  // Link user2 to the patient
  fullName: 'John Smith', 
  dob: '1985-08-15' 
});

const convoB1 = await Conversation.create({
  patient: patientUserB._id, // Removed redundant patientId
  therapist: user2._id,
  owner: user2._id,
  patientId: patientUserB._id,
  messages: [
    { speaker: 'therapist', content: 'How are you feeling today?', timestamp: new Date() },
    { speaker: 'patient', content: 'Talked about relationships.', timestamp: new Date() }
  ],
  lifeEvents: [
    {
      title: 'Relationship Discussion',
      description: 'Discussed feelings about relationships.',
      category: 'self-image',
      importance: 'medium',
      relatedMessageIndex: 1,
      flaggedAt: new Date()
    },
    {
      title: 'Family Gathering',
      description: 'Felt anxious about attending a family event.',
      category: 'social',
      importance: 'high',
      relatedMessageIndex: 0,
      flaggedAt: new Date()
    }
  ],
  date: new Date()
});

const convoB2 = await Conversation.create({
  patient: patientUserB._id, // Removed redundant patientId
  therapist: user2._id,
  owner: user2._id,
  patientId: patientUserB._id,
  messages: [
    { speaker: 'therapist', content: 'Let’s talk about your goals.', timestamp: new Date() },
    { speaker: 'patient', content: 'I want to work on my confidence.', timestamp: new Date() }
  ],
  lifeEvents: [
    {
      title: 'Job Interview',
      description: 'Felt nervous before an important interview.',
      category: 'work',
      importance: 'high',
      relatedMessageIndex: 1,
      flaggedAt: new Date()
    }
  ],
  date: new Date()
});

const convoB3 = await Conversation.create({
  patient: patientUserB._id, // Removed redundant patientId
  therapist: user2._id,
  owner: user2._id,
  patientId: patientUserB._id,
  messages: [
    { speaker: 'therapist', content: 'How’s your sleep been?', timestamp: new Date() },
    { speaker: 'patient', content: 'Much better with a regular schedule.', timestamp: new Date() }
  ],
  lifeEvents: [
    {
      title: 'Improved Sleep',
      description: 'Patient adopted consistent bedtime routine.',
      category: 'sleep',
      importance: 'medium',
      relatedMessageIndex: 1,
      flaggedAt: new Date()
    }
  ],
  date: new Date()
});

await JournalEntry.create([
  { patient: patientUserB._id, patientId: patientUserB._id, therapist: user2._id, title: 'Feeling Isolated', content: 'Struggling socially.', isPrivate: true, owner: user2._id, sharedWith: [] },
  { patient: patientUserB._id, patientId: patientUserB._id, therapist: user2._id, title: 'Hopeful Moments', content: 'Had a good walk.', isPrivate: false, owner: user2._id, sharedWith: [user2._id] },
  { patient: patientUserB._id, patientId: patientUserB._id, therapist: user2._id, title: 'Reflections on Family', content: 'Anxiety about family dynamics.', isPrivate: false, owner: user2._id, sharedWith: [user1._id] },
  { patient: patientUserB._id, patientId: patientUserB._id, therapist: user2._id, title: 'Interview Prep', content: 'Prepared for job interview.', isPrivate: false, owner: user2._id, sharedWith: [user2._id] }
]);

await TherapistRating.create({ 
  conversationId: convoB1._id, 
  mood: 7, 
  stress: 5, 
  energy: 6, 
  owner: user2._id,
  patient: patientUserB._id,
  therapist: user2._id
});
await PatientRating.create({ 
  conversationId: convoB1._id, 
  mood: 6, 
  stress: 6, 
  energy: 4, 
  owner: user2._id 
});

await SessionNote.create({ 
  conversationId: convoB1._id, 
  content: 'Discussed progress.', 
  author: user2._id, 
  isPrivate: false, 
  owner: user2._id,
  patient: patientUserB._id,
  therapist: user2._id
});

await LifeContext.create({
  patientId: patientUserB._id,
  occupation: 'Artist',
  goals: 'Improve relationships',
  hobbies: ['Painting', 'Hiking'],
  livingSituation: 'With roommates',
  sleepHealth: 'Decent',
  owner: user2._id
});

await SupportPerson.create({
  patientId: patientUserB._id, 
  name: 'Mark', 
  relation: 'Friend', 
  contact: 'mark@email.com',
  owner: user2._id
});

// Extend Emily's support log
await SupportPerson.updateOne(
  { patientId: patientUserB._id, name: 'Emily' },
  {
    $set: {
      notes: 'Very involved in patient’s care.',
      interactions: [
        { type: 'call', date: new Date(), summary: 'Called to check in on medication.' },
        { type: 'visit', date: new Date(), summary: 'Attended therapy session as support.' }
      ]
    }
  })

await AISummary.create({ conversationId: convoB1._id, text: 'Focused on interpersonal growth.', model: 'gpt-4', owner: user2._id });
await AISummary.create({ conversationId: convoB2._id, text: 'Observed improvement in tone.', model: 'claude-v1', owner: user2._id });

await AIScoring.create({ conversationId: convoB1._id, moodScore: 6, stressScore: 5, emotionalTone: 'hopeful', confidence: 0.85, owner: user2._id });
await AIScoring.create({ conversationId: convoB2._id, moodScore: 3, stressScore: 8, emotionalTone: 'distressed', confidence: 0.91, owner: user2._id });

await AITheme.create({ conversationId: convoB1._id, rawLabel: 'relationship anxiety', normalizedTo: 'social connection', owner: user2._id });
await AITheme.insertMany([
  { conversationId: convoB2._id, rawLabel: 'performance anxiety', normalizedTo: 'work stress', owner: user2._id },
  { conversationId: convoB2._id, rawLabel: 'fear of failure', normalizedTo: 'work stress', owner: user2._id }
]);

await Keyword.insertMany([
  { conversationId: convoB1._id, word: 'trust', relevanceScore: 0.8, owner: user2._id  },
  { conversationId: convoB2._id, word: 'deadline', relevanceScore: 0.88, owner: user2._id },
  { conversationId: convoB2._id, word: 'achievement', relevanceScore: 0.75, owner: user2._id }
]);

await PersonMentioned.insertMany([
  { conversationId: convoB1._id, name: 'Samantha', role: 'partner', owner: user2._id  },
  { conversationId: convoB2._id, name: 'Lisa', role: 'mentor', owner: user2._id },
  { conversationId: convoB2._id, name: 'Kevin', role: 'bully', owner: user2._id }
]);

await WeeklyReflection.create({
  patient: patientUserB._id,
  therapist: user2._id,
  patientId: patientUserB._id, 
  aiSummary: 'Growth observed in personal confidence.', 
  owner: user2._id  
});
await WeeklyReflection.create({
  patient: patientUserB._id,
  therapist: user2._id,
  patientId: patientUserB._id, 
  aiSummary: 'Increase in self-doubt and disrupted sleep reported.', 
  owner: user2._id  
});

await ExportLog.create({ userId: user2._id, format: 'CSV', patientId: patientUserB._id, includesAI: false, owner: user2._id });
await ExportLog.create({ userId: user2._id, format: 'JSON', patientId: patientUserB._id, includesAI: true, owner: user2._id });

await Organization.create({
  name: 'CareSpace',
  type: 'team',
  license: 'CS5678',
  owner: user1._id // Link owner to user1 (therapist)
});

await FlaggedSession.create({ conversationId: convoB1._id, reason: 'Manual flag by therapist', flaggedBy: user2._id, owner: user2._id });
await FlaggedSession.create({ conversationId: convoB2._id, reason: 'AI detected risk pattern', flaggedBy: user1._id, owner: user1._id });

// Standardized patient naming for clarity
const patientUserA = await Patient.create({
  owner: user1._id, 
  userAccount: user1._id,  // Link user1 to the patient
  fullName: 'Jane Doe', 
  dob: '1990-05-01'
})

const convoA1 = await Conversation.create({
  patient: patientUserA._id, // Removed redundant patientId
  therapist: user1._id,
  owner: user1._id,
  patientId: patientUserA._id,
  messages: [
    { speaker: 'therapist', content: 'How have you been feeling?', timestamp: new Date() },
    { speaker: 'patient', content: 'Pretty anxious lately.', timestamp: new Date() }
  ],
  lifeEvents: [
    {
      title: 'Anxiety Trigger',
      description: 'Felt anxious about work deadlines.',
      category: 'work',
      importance: 'high',
      relatedMessageIndex: 1,
      flaggedAt: new Date()
    },
    {
      title: 'Social Outing',
      description: 'Felt nervous about attending a party.',
      category: 'social',
      importance: 'medium',
      relatedMessageIndex: 0,
      flaggedAt: new Date()
    }
  ],
  date: new Date()
});

const convoA2 = await Conversation.create({
  patient: patientUserA._id, // Removed redundant patientId
  therapist: user1._id,
  owner: user1._id,
  patientId: patientUserA._id,
  messages: [
    { speaker: 'therapist', content: 'Let’s discuss your progress.', timestamp: new Date() },
    { speaker: 'patient', content: 'I feel better about things.', timestamp: new Date() }
  ],
  lifeEvents: [
    {
      title: 'Improved Mood',
      description: 'Noticed a positive shift in feelings.',
      category: 'self-image',
      importance: 'medium',
      relatedMessageIndex: 1,
      flaggedAt: new Date()
    }
  ],
  date: new Date()
});

const convoA3 = await Conversation.create({
  patient: patientUserA._id, // Removed redundant patientId
  therapist: user1._id,
  owner: user1._id,
  patientId: patientUserA._id,
  messages: [
    { speaker: 'therapist', content: 'What are your coping strategies?', timestamp: new Date() },
    { speaker: 'patient', content: 'I’ve been practicing mindfulness.', timestamp: new Date() }
  ],
  lifeEvents: [
    {
      title: 'Mindfulness Practice',
      description: 'Engaged in daily mindfulness exercises.',
          category: 'self-image',
      importance: 'low',
      relatedMessageIndex: 1,
      flaggedAt: new Date()
    }
  ],
  date: new Date()
});

const convoA4 = await Conversation.create({
  patient: patientUserA._id, // Removed redundant patientId
  therapist: user1._id,
  owner: user1._id,
  patientId: patientUserA._id,
  messages: [
    { speaker: 'therapist', content: 'Tell me about your diet changes.', timestamp: new Date() },
    { speaker: 'patient', content: 'I cut out sugar last week.', timestamp: new Date() }
  ],
  lifeEvents: [
    {
      title: 'Diet Change',
      description: 'Started reducing sugar intake.',
      category: 'diet',
      importance: 'medium',
      relatedMessageIndex: 1,
      flaggedAt: new Date()
    }
  ],
  date: new Date()
});

await JournalEntry.create([
  { patient: patientUserA._id, patientId: patientUserA._id, therapist: user1._id, title: 'Rough Day', content: 'Felt overwhelmed.', isPrivate: true, owner: user1._id, sharedWith: [] },
  { patient: patientUserA._id, patientId: patientUserA._id, therapist: user1._id, title: 'Therapy Reflections', content: 'I opened up a lot.', isPrivate: false, owner: user1._id, sharedWith: [user1._id] },
  { patient: patientUserA._id, patientId: patientUserA._id, therapist: user1._id, title: 'Positive Changes', content: 'Noticed improvements in mood.', isPrivate: false, owner: user1._id, sharedWith: [user2._id] },
  { patient: patientUserA._id, patientId: patientUserA._id, therapist: user1._id, title: 'Coping Strategies', content: 'Journaling helps.', isPrivate: false, owner: user1._id, sharedWith: [user1._id] }
])

const ratingA1 = await TherapistRating.create({ 
  conversationId: convoA1._id, 
  mood: 6, 
  stress: 7, 
  energy: 5, 
  owner: user1._id,
  patient: patientUserA._id,
  therapist: user1._id
});
const ratingA2 = await TherapistRating.create({ 
  conversationId: convoA2._id, 
  mood: 8, 
  stress: 4, 
  energy: 7, 
  owner: user1._id,
  patient: patientUserA._id,
  therapist: user1._id
});

await SessionNote.create({ 
  conversationId: convoA1._id, 
  content: 'Therapist note.', 
  author: user1._id, 
  isPrivate: true, 
  owner: user1._id,
  patient: patientUserA._id,
  therapist: user1._id
});

await LifeContext.create({
  patientId: patientUserA._id,
  occupation: 'Engineer',
  goals: 'Reduce anxiety',
  hobbies: ['Reading', 'Yoga'],
  livingSituation: 'Apartment alone',
  sleepHealth: 'Inconsistent',
  owner: user1._id
})

await SupportPerson.create({
  patientId: patientUserA._id, 
  name: 'Emily', 
  relation: 'Sister', 
  contact: 'emily@email.com',
  owner: user1._id
});

await AISummary.create({ conversationId: convoA1._id, text: 'Discussed anxiety and triggers.', model: 'gpt-3.5', owner: user1._id })

await AIScoring.create({ conversationId: convoA1._id, moodScore: 5, stressScore: 7, emotionalTone: 'nervous', confidence: 0.8, owner: user1._id })

await AITheme.create({ conversationId: convoA1._id, rawLabel: 'anxiety about work', normalizedTo: 'work stress', owner: user1._id })

await Keyword.create({
  conversationId: convoA1._id,
  word: 'performance review',
  relevanceScore: 0.9,
  owner: user1._id  // Link owner to user1 (therapist)
});

await PersonMentioned.create({
  conversationId: convoA1._id,
  name: 'John',
  role: 'boss',
  owner: user1._id  // Link owner to user1 (therapist)
});

await WeeklyReflection.create({
  patient: patientUserA._id,
  therapist: user1._id,
  patientId: patientUserA._id, 
  aiSummary: 'This week showed progress in emotional regulation.', 
  owner: user1._id
})
  
await TreatmentRecord.create({
  patientId: patientUserB._id,
  therapistId: user2._id,
  type: 'therapy',
  title: 'CBT Session 1',
  description: 'Cognitive Behavioral Therapy introduction session.',
  dateAdministered: new Date(),
  notes: 'Patient responded well to initial exercises.',
  visibility: 'shared',
  createdAt: new Date()
});
 
await TreatmentRecord.create({
  patientId: patientUserA._id,
  therapistId: user1._id,
  type: 'medication',
  title: 'Sertraline 50mg',
  description: 'Daily dosage for anxiety.',
  dateAdministered: new Date(),
  notes: 'Patient reported slight nausea.',
  visibility: 'therapist-only',
  createdAt: new Date()
});

await ExportLog.create({ userId: user1._id, format: 'PDF', patientId: patientUserA._id, includesAI: true, owner: user1._id });

await Organization.create({
  name: 'MindClinic',
  type: 'private',
  license: 'CL1234',
  owner: user2._id // Link owner to user2 (patient)
})

await FlaggedSession.create({ conversationId: convoA1._id, reason: 'AI detected distress', flaggedBy: user1._id, owner: user1._id });

console.log('Database seeded.')

process.exit()
}

seed()
