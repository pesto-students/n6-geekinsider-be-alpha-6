import { Container } from 'typedi';
import LoggerInstance from './logger';
import agendaFactory from './agenda';

export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    const agendaInstance = agendaFactory({ mongoConnection });
    
    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);                                                        // Container.set('awsconf', awsconf) need to be added in the optimizations further
    
    LoggerInstance.info('✌️ Agenda injected into container');

    return { agenda: agendaInstance};
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};


// need to be updated in the future
// const awsconf = {
//   region : config.awsconf.REGION,
//   userPoolId : config.awsconf.USER_POOL_ID
// }
