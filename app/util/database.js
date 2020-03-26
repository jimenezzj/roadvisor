const mongoose = require('mongoose');

const user = "jjimenezz";
const password = "uLfTR0QTCp3pD8Ql";
const URL = `mongodb+srv://${user}:${password}@cluster0-wf3t8.mongodb.net/roadvisordb_test?retryWrites=true&w=majority`;

const connectRoadvisorDb = () => mongoose.connect(URL);

module.exports = connectRoadvisorDb;