import Agenda from 'agenda';
import config from '../config';

export default ({ mongoConnection }) => {
  return new Agenda(
      config.databaseURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
  /**
   * This voodoo magic is proper from agenda.js so I'm not gonna explain too much here.
   * https://github.com/agenda/agenda#mongomongoclientinstance
   */
};
