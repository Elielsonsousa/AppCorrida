const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/AppCorrida?replicaSet=rs';
/** o replicaSet faz com que, caso haja algum erro no cadastro, impossibilite-o 
 * ex: caso o cartão n seja aprovado o cadastro n continurará*/

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose
  .connect(URI)
  .then(() => console.log('DB is UP'))
  .catch((err) => console.log(err));
