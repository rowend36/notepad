import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, Node, DOMParser as ProseParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import { useRef, useEffect } from "preact/hooks";
import "prosemirror-example-setup/style/style.css";
import "prosemirror-gapcursor/style/gapcursor.css";
import "prosemirror-menu/style/menu.css";
import "prosemirror-view/style/prosemirror.css";
import initialContent from "./template.html";
import "./overrides.css";
import isCSR from "../../logic/is_csr";
import { locationStore } from "../../logic/prosemirror_plugins/persist";
import style from "./style.module.css";
import { ACTION_SET_DOC_SIZE, useAppData } from "../../logic/app_data";
import onDocChanged from "../../logic/prosemirror_plugins/on_doc_changed";

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});


const Notepad = () => {
  const ref = useRef();
  const dispatch = useAppData().dispatch;
  useEffect(() => {
    if (isCSR && ref.current) {
      const initialDoc = ProseParser.fromSchema(mySchema).parse(new DOMParser().parseFromString(initialContent, "text/html"));

      let view = new EditorView(ref.current, {
        state: EditorState.create({
          plugins: [
            ...locationStore(mySchema, initialDoc),
            ...exampleSetup({ schema: mySchema }),
            onDocChanged((doc) => {
              dispatch(ACTION_SET_DOC_SIZE, window.location.hash.length);
            }),
          ],
          schema: mySchema,
        }),
      });
      return () => {
        view.destroy()
      }
    }
  }, []);
  return <div className={style.notepad} ref={ref} />;
};
export default Notepad;
