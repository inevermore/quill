import { Scope } from 'parchment';
import Delta, { Op } from 'quill-delta';
import Quill from '../core/quill';
import Module from '../core/module';

class History extends Module {
  constructor(quill, options) {
    super(quill, options);
    this.lastRecorded = 0;
    this.ignoreChange = false;
    this.clear();
    this.updateIcon();
    this.quill.on(
      Quill.events.EDITOR_CHANGE,
      (eventName, delta, oldDelta, source) => {
        if (eventName !== Quill.events.TEXT_CHANGE || this.ignoreChange) return;
        if (!this.options.userOnly || source === Quill.sources.USER) {
          this.record(delta, oldDelta);
        } else {
          this.transform(delta);
        }
      },
    );
    this.quill.keyboard.addBinding(
      { key: 'z', shortKey: true },
      this.undo.bind(this),
    );
    this.quill.keyboard.addBinding(
      { key: 'z', shortKey: true, shiftKey: true },
      this.redo.bind(this),
    );
    if (/Win/i.test(navigator.platform)) {
      this.quill.keyboard.addBinding(
        { key: 'y', shortKey: true },
        this.redo.bind(this),
      );
    }
  }

  change(source, dest) {
    if (this.stack[source].length === 0) return;
    const delta = this.stack[source].pop();
    this.stack[dest].push(delta);
    this.lastRecorded = 0;
    this.ignoreChange = true;
    this.quill.updateContents(delta[source], Quill.sources.USER);
    this.ignoreChange = false;
    const index = getLastChangeIndex(this.quill.scroll, delta[source]);
    this.quill.setSelection(index);
    this.updateIcon();
  }

  updateIcon() {
    ['undo', 'redo'].forEach(source => {
      const operation = this.stack[source].length === 0 ? 'add' : 'remove';
      const toolbar = this.quill.getModule('toolbar');
      if (!toolbar) return;
      const toolbarContainer = toolbar.container;
      const icon = toolbarContainer.querySelector(`.ql-${source}`);
      if (icon) {
        icon.classList[operation]('tk-disable-history');
      }
    });
  }

  clear() {
    this.stack = { undo: [], redo: [] };
    this.updateIcon();
    // observeArray(this.stack.redo, this.updateIcon.bind(this));
    // observeArray(this.stack.undo, this.updateIcon.bind(this));
  }

  cutoff() {
    this.lastRecorded = 0;
  }

  record(changeDelta, oldDelta) {
    if (changeDelta.ops.length === 0) return;
    this.stack.redo = [];
    // observeArray(this.stack.redo, this.updateIcon.bind(this));
    let undoDelta = guessUndoDelta(changeDelta);
    if (undoDelta == null) {
      undoDelta = this.quill.getContents().diff(oldDelta);
    }
    const timestamp = Date.now();
    if (
      this.lastRecorded + this.options.delay > timestamp &&
      this.stack.undo.length > 0
    ) {
      const delta = this.stack.undo.pop();
      undoDelta = undoDelta.compose(delta.undo);
      changeDelta = delta.redo.compose(changeDelta);
    } else {
      this.lastRecorded = timestamp;
    }
    this.stack.undo.push({
      redo: changeDelta,
      undo: undoDelta,
    });
    if (this.stack.undo.length > this.options.maxStack) {
      this.stack.undo.shift();
    }
    this.updateIcon();
  }

  redo() {
    this.change('redo', 'undo');
  }

  transform(delta) {
    this.stack.undo.forEach(change => {
      change.undo = delta.transform(change.undo, true);
      change.redo = delta.transform(change.redo, true);
    });
    this.stack.redo.forEach(change => {
      change.undo = delta.transform(change.undo, true);
      change.redo = delta.transform(change.redo, true);
    });
  }

  undo() {
    this.change('undo', 'redo');
  }
}
History.DEFAULTS = {
  delay: 1000,
  maxStack: 100,
  userOnly: false,
};

function endsWithNewlineChange(scroll, delta) {
  const lastOp = delta.ops[delta.ops.length - 1];
  if (lastOp == null) return false;
  if (lastOp.insert != null) {
    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
  }
  if (lastOp.attributes != null) {
    return Object.keys(lastOp.attributes).some(attr => {
      return scroll.query(attr, Scope.BLOCK) != null;
    });
  }
  return false;
}

function getLastChangeIndex(scroll, delta) {
  const deleteLength = delta.reduce((length, op) => {
    return length + (op.delete || 0);
  }, 0);
  let changeIndex = delta.length() - deleteLength;
  if (endsWithNewlineChange(scroll, delta)) {
    changeIndex -= 1;
  }
  return changeIndex;
}

function guessUndoDelta(delta) {
  const undoDelta = new Delta();
  let failed = false;
  delta.forEach(op => {
    if (op.insert) {
      undoDelta.delete(Op.length(op));
    } else if (op.retain && op.attributes == null) {
      undoDelta.retain(op.retain);
    } else {
      failed = true;
      return false;
    }
    return true;
  });
  return failed ? null : undoDelta;
}

// function def(obj, key, val) {
//   Object.defineProperty(obj, key, {
//     value: val,
//     enumerable: false,
//     writable: true,
//     configurable: true,
//   });
// }

// function observeArray(arr, event) {
//   const methods = ['push', 'pop', 'shift', 'unshift'];
//   const arrayProto = Array.prototype;
//   const arrayMethods = Object.create(arrayProto);
//   methods.forEach(method => {
//     // cache original method
//     const original = arrayProto[method];
//     def(arrayMethods, method, (...args) => {
//       const result = original.apply(arr, args);
//       event();
//       return result;
//     });
//     arr.__proto__ = arrayMethods; // eslint-disable-line no-proto
//   });
// }

export { History as default, getLastChangeIndex };
