import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: '.env' });
import {app} from './app';
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true } );
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {

 /* ioServer.listen(process.env.WSPORT || 4700, () => {
    console.log('WebSockets are available at port ' + (process.env.WSPORT || 4700));
  }); */
  app.listen(app.get('port'), () => {

  });
});



