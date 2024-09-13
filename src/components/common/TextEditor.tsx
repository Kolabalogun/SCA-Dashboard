/* eslint-disable @typescript-eslint/no-explicit-any */

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TextEditor = ({
  data,
  onDataChange,
}: {
  data: any;
  onDataChange: any;
}) => {
  const editorConfig = {
    fontColor: {
      colors: [
        {
          color: "hsl(0, 0%, 0%)",
          label: "Black",
        },
      ],
    },
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      config={editorConfig}
      onChange={(event, editor) => {
        const newData = editor.getData();
        onDataChange(newData);
      }}
    />
  );
};

export default TextEditor;
