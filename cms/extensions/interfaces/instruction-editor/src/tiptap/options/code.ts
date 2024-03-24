// https://tiptap.dev/api/marks/code

import Code from "@tiptap/extension-code";
import customMessages from "../../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import { Tool } from "../types";
import { extendMarkRangeIfUnselected } from "../util";

export default {
  key: "code",
  name: customMessages.tools.code,
  icon: "code",
  extension: [Code],
  shortcut: ["meta", "E"],
  action: (editor: Editor) => extendMarkRangeIfUnselected(editor, "code").toggleCode().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleCode().run(),
  active: (editor: Editor) => editor.isActive("code"),
} as Tool;
