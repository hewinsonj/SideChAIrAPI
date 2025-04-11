function canViewEntry(user, entry) {
  if (!user || !entry) return false;

  // Always allow the owner (therapist)
  if (entry.owner && entry.owner.equals(user._id)) return true;

  // Always allow the patient
  if (entry.patientId && entry.patientId.equals(user._id)) return true;

  // Allow if explicitly shared
  if (entry.sharedWith && entry.sharedWith.some(id => id.equals(user._id))) return true;

  return false;
}

module.exports = { canViewEntry };
