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
const JournalEntry = require('./app/models/journalentry')
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

const patient2 = await Patient.create({
  owner: user2._id, 
  userAccount: user2._id,  // Link user2 to the patient
  fullName: 'John Smith', 
  dob: '1985-08-15' 
});

const convo3 = await Conversation.create({
  patientId: patient2._id,
  owner: user2._id,  // Link owner to user2 (e.g., patient)
  transcript: 'Talked about relationships.',
  date: new Date()
});

await JournalEntry.create([
  { patientId: patient2._id, title: 'Feeling Isolated', content: 'Struggling socially.', isPrivate: true, owner: user2._id },
  { patientId: patient2._id, title: 'Hopeful Moments', content: 'Had a good walk.', isPrivate: false, owner: user2._id }
]);

await TherapistRating.create({ 
  conversationId: convo3._id, 
  mood: 7, 
  stress: 5, 
  energy: 6, 
  owner: user2._id 
});
await PatientRating.create({ 
  conversationId: convo3._id, 
  mood: 6, 
  stress: 6, 
  energy: 4, 
  owner: user2._id 
});

await SessionNote.create({ conversationId: convo3._id, content: 'Discussed progress.', author: user2._id, isPrivate: false, owner: user2._id });

await LifeContext.create({
  patientId: patient2._id,
  occupation: 'Artist',
  goals: 'Improve relationships',
  hobbies: ['Painting', 'Hiking'],
  livingSituation: 'With roommates',
  sleepHealth: 'Decent',
  owner: user2._id
});

await SupportPerson.create({
  patientId: patient2._id, 
  name: 'Mark', 
  relation: 'Friend', 
  contact: 'mark@email.com',
  owner: user2._id
});

await AISummary.create({ conversationId: convo3._id, text: 'Focused on interpersonal growth.', model: 'gpt-4', owner: user2._id });

await AIScoring.create({ conversationId: convo3._id, moodScore: 6, stressScore: 5, emotionalTone: 'hopeful', confidence: 0.85, owner: user2._id });

await AITheme.create({ conversationId: convo3._id, rawLabel: 'relationship anxiety', normalizedTo: 'social connection', owner: user2._id });

await Keyword.create({
  conversationId: convo3._id,
  word: 'trust',
  relevanceScore: 0.8,
  owner: user2._id  // Link owner to user2 (patient)
});

await PersonMentioned.create({
  conversationId: convo3._id,
  name: 'Samantha',
  role: 'partner',
  owner: user2._id  // Link owner to user2 (patient)
});

await WeeklyReflection.create({
  patientId: patient2._id, 
  aiSummary: 'Growth observed in personal confidence.', 
  owner: user2._id  // Link owner to user2 (patient)
});

await ExportLog.create({ userId: user2._id, format: 'CSV', patientId: patient2._id, includesAI: false, owner: user2._id });

await Organization.create({
  name: 'CareSpace',
  type: 'team',
  license: 'CS5678',
  owner: user1._id // Link owner to user1 (therapist)
});

await FlaggedSession.create({ conversationId: convo3._id, reason: 'Manual flag by therapist', flaggedBy: user2._id, owner: user2._id });

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['clinic', 'practice', 'team', 'private'] },
  license: { type: String, required: true }})

  const patient = await Patient.create({
    owner: user1._id, 
    userAccount: user1._id,  // Link user1 to the patient
    fullName: 'Jane Doe', 
    dob: '1990-05-01'
  })

  const convo1 = await Conversation.create({
    patientId: patient._id,
    owner: user1._id,  // Link owner to user1 (e.g., therapist)
    transcript: 'Session about anxiety.',
    date: new Date()
  });

  const convo2 = await Conversation.create({
    patientId: patient._id,
    owner: user1._id,  // Link owner to user1 (e.g., therapist)
    transcript: 'Follow-up session.',
    date: new Date()
  });

  await JournalEntry.create([
    { patientId: patient._id, title: 'Rough Day', content: 'Felt overwhelmed.', isPrivate: true, owner: user1._id },
    { patientId: patient._id, title: 'Therapy Reflections', content: 'I opened up a lot.', isPrivate: false, owner: user1._id }
  ])

  const rating1 = await TherapistRating.create({ 
    conversationId: convo1._id, 
    mood: 6, 
    stress: 7, 
    energy: 5, 
    owner: user1._id 
  });
  const rating2 = await TherapistRating.create({ 
    conversationId: convo2._id, 
    mood: 8, 
    stress: 4, 
    energy: 7, 
    owner: user1._id 
  });

  await SessionNote.create({ conversationId: convo1._id, content: 'Therapist note.', author: user1._id, isPrivate: true, owner: user1._id });

  await LifeContext.create({
    patientId: patient._id,
    occupation: 'Engineer',
    goals: 'Reduce anxiety',
    hobbies: ['Reading', 'Yoga'],
    livingSituation: 'Apartment alone',
    sleepHealth: 'Inconsistent',
    owner: user1._id
  })

  await SupportPerson.create({
    patientId: patient._id, 
    name: 'Emily', 
    relation: 'Sister', 
    contact: 'emily@email.com',
    owner: user1._id
  });

  await AISummary.create({ conversationId: convo1._id, text: 'Discussed anxiety and triggers.', model: 'gpt-3.5', owner: user1._id })

  await AIScoring.create({ conversationId: convo1._id, moodScore: 5, stressScore: 7, emotionalTone: 'nervous', confidence: 0.8, owner: user1._id })

  await AITheme.create({ conversationId: convo1._id, rawLabel: 'anxiety about work', normalizedTo: 'work stress', owner: user1._id })

  await Keyword.create({
    conversationId: convo1._id,
    word: 'performance review',
    relevanceScore: 0.9,
    owner: user1._id  // Link owner to user1 (therapist)
  });

  await PersonMentioned.create({
    conversationId: convo1._id,
    name: 'John',
    role: 'boss',
    owner: user1._id  // Link owner to user1 (therapist)
  });

await WeeklyReflection.create({
  patientId: patient._id, 
  aiSummary: 'This week showed progress in emotional regulation.', 
  owner: user1._id  // Link owner to user1 (therapist)
})

  await ExportLog.create({ userId: user1._id, format: 'PDF', patientId: patient._id, includesAI: true, owner: user1._id });

  await Organization.create({
    name: 'MindClinic',
    type: 'private',
    license: 'CL1234',
    owner: user2._id // Link owner to user2 (patient)
  })

  await FlaggedSession.create({ conversationId: convo1._id, reason: 'AI detected distress', flaggedBy: user1._id, owner: user1._id });

  console.log('Database seeded.')
  
  process.exit()
}

seed()
