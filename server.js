// require necessary NPM packages
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

// require route files
const userRoutes = require("./app/routes/user_routes");
const aiScoringRoutes = require("./app/routes/aiScoring_routes");
const aiSummaryRoutes = require("./app/routes/aiSummary_routes");
const aiThemeRoutes = require("./app/routes/aiTheme_routes");
const conversationRoutes = require("./app/routes/conversation_routes");
const exportLogRoutes = require("./app/routes/exportLog_routes");
const flaggedSessionRoutes = require("./app/routes/flaggedSession_routes");
const journalEntryRoutes = require("./app/routes/journalEntry_routes");
const keywordRoutes = require("./app/routes/keyword_routes");
const lifeContextRoutes = require("./app/routes/lifeContext_routes");
const organizationRoutes = require("./app/routes/organization_routes");
const patientRoutes = require("./app/routes/patient_routes");
const patientRatingRoutes = require("./app/routes/patientRating_routes");
const personMentionedRoutes = require("./app/routes/personMentioned_routes");
const sessionNoteRoutes = require("./app/routes/sessionNote_routes");
const significantPersonRoutes = require("./app/routes/significantPerson_routes");
const therapistRatingRoutes = require("./app/routes/therapistRating_routes");
const treatmentRecordRoutes = require("./app/routes/treatmentRecord_routes");
const weeklyReflectionRoutes = require("./app/routes/weeklyReflection_routes");
const therapistRoutes = require("./app/routes/therapist_routes");

// require middleware
const errorHandler = require("./lib/error_handler");
const replaceToken = require("./lib/replace_token");
const requestLogger = require("./lib/request_logger");

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require("./config/db");

// require configured passport authentication middleware
const auth = require("./lib/auth");

// define server and client ports
// used for cors and local port declaration
const serverDevPort = 8000;
const clientDevPort = 3000;

// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db);

// instantiate express application object
const app = express();

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}`,
  })
);

// define port for API to run on
// adding PORT= to your env file will be necessary for deployment
const port = process.env.PORT || serverDevPort;

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use(replaceToken);

// register passport authentication middleware
app.use(auth);

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json());
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }));

// log each request as it comes in for debugging
app.use(requestLogger);

// register route files
app.use(userRoutes);
app.use("/ai-scorings", aiScoringRoutes);
app.use("/ai-summaries", aiSummaryRoutes);
app.use("/ai-themes", aiThemeRoutes);
app.use("/conversations", conversationRoutes);
app.use("/export-logs", exportLogRoutes);
app.use("/flagged-sessions", flaggedSessionRoutes);
app.use("/journal-entries", journalEntryRoutes);
app.use("/keywords", keywordRoutes);
app.use("/life-contexts", lifeContextRoutes);
app.use("/organizations", organizationRoutes);
app.use("/patients", patientRoutes);
app.use("/patient-ratings", patientRatingRoutes);
app.use("/people-mentioned", personMentionedRoutes);
app.use("/session-notes", sessionNoteRoutes);
app.use("/significant-people", significantPersonRoutes);
app.use("/therapist-ratings", therapistRatingRoutes);
app.use("/weekly-reflections", weeklyReflectionRoutes);
app.use("/therapists", therapistRoutes);
app.use("/treatment-records", treatmentRecordRoutes);

console.log("ALL ROUTES LOADED");

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler);

// run API on designated port (4741 in this case)
app.listen(port, () => {
  console.log("listening on port " + port);
});

app.get("/__journalentry-direct", (req, res) => {
  console.log("🔥 DIRECT ROUTE HIT 🔥");
  res.json({ message: "direct test" });
});

// needed for testing
module.exports = app;
