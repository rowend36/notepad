import { Plugin } from "prosemirror-state";
/**
 * @callback Callback
 * @param {import("prosemirror-model").Node} doc
 */
/**
 * @param {Callback} cb
 */
export default function onDocChanged(cb) {
  return new Plugin({
    view(view) {
      cb(view.state.doc);
      return {
        update(view, prevState) {
          if (view.state.doc !== prevState.doc) {
            cb(view.state.doc);
          }
        },
      };
    },
  });
}
