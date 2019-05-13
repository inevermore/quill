import Emitter from '../core/emitter';

const customEmitter = new Emitter();
customEmitter.events = {
  ADD_FILL_BLANK_ORDER: 'add-fill-blank-order',
  DELETE_FILL_BLANK_ORDER: 'delete-fill-blank-order',
};

export default customEmitter;
