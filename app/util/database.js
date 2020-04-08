const mongoose = require('mongoose');

const user = "jjimenezz";
const password = "uLfTR0QTCp3pD8Ql";
// const URL = `mongodb+srv://${user}:${password}@cluster0-wf3t8.mongodb.net/roadvisordb_test?retryWrites=true&w=majority`;
const URL = `mongodb://${user}:${password}@cluster0-shard-00-00-wf3t8.mongodb.net:27017,cluster0-shard-00-01-wf3t8.mongodb.net:27017,cluster0-shard-00-02-wf3t8.mongodb.net:27017/roadvisordb_test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`;

const connectRoadvisorDb = () => mongoose.connect(URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

module.exports = connectRoadvisorDb;