import { Plugin } from "prosemirror-state";
import { Transform } from "prosemirror-transform";
import { zlibSync, unzlibSync } from "fflate";
import { fromByteArray, toByteArray } from "base64-js";
import { Node } from "prosemirror-model";
const persist = (save, load, schema, initialDoc, subscribe = () => { }) => {
  const loadDoc = () => {
    let doc = initialDoc;
    let initialContent = load();
    if (initialContent) {
      _last = initialContent;
      try {
        const compressed = toByteArray(initialContent);
        const raw = JSON.parse(
          new TextDecoder("utf8").decode(unzlibSync(compressed))
        );
        doc = Node.fromJSON(schema, raw);
      } catch (e) {
        console.error(`Error decoding hash !!! ${e}`);
      }
    }
    return doc;
  };

  /** @type {import("prosemirror-view").EditorView} */
  let _view;
  let _unsubscribe;
  let _last;
  const onChange = (base64) => {
    if (base64 !== _last) {
      const doc = loadDoc();
      _view?.dispatch(_view.state.tr.replaceWith(0, _view.state.doc.content.size, doc));
    }
  }
  const saveDoc = new Plugin({
    state: {
      init(config, state) {
        state.doc = loadDoc();
      },
      apply() { },
    },
    view(view) {
      _view = view;
      _unsubscribe = subscribe(onChange);
      return {
        update(view, oldState) {
          const raw = new TextEncoder("utf8").encode(
            JSON.stringify(view.state.doc.toJSON())
          );
          const compressed = zlibSync(raw);
          _last = fromByteArray(compressed);
          save(_last);
        },
      };
    },
    destroy() {
      _unsubscribe?.();
    }
  });
  return [saveDoc];
};

export const locationStore = (schema, initialDoc) =>
  persist(
    (e) => (location.hash = e.replaceAll("/","_").replaceAll("+","-")),
    () => location.hash && location.hash.slice(1).replaceAll("_","/").replaceAll("-","+"),
    schema,
    initialDoc,
    (cb) => {
      const m = () => {
        cb(location.hash && location.hash.slice(1))
      }
      window.addEventListener("hashchange", m);
      return () => {
        window.removeEventListener("hashchange", m)
      }
    }
  );

export const localStorageStore = (
  schema,
  initialDoc,
  key = "prosemirror-doc"
) =>
  persist(
    (e) => localStorage.setItem(key, e),
    () => localStorage.getItem(i),
    schema,
    initialDoc
  );
