import { Container } from 'typedi';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import LoggerInstance from './logger';
import agendaFactory from './agenda';
import config from '../config';

export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }) => {
  try {
    //console.log(models);
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    const agendaInstance = agendaFactory({ mongoConnection });
    const awsconf = {
      region : config.awsconf.REGION,
      userPoolId : config.awsconf.USER_POOL_ID
    }
    
    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);                                                        // Container.set('awsconf', awsconf) need to be added in the optimizations further
    
    LoggerInstance.info('✌️ Agenda injected into container');

    return { agenda: agendaInstance, awsconf : awsconf };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
