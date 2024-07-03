import dynamic from 'next/dynamic';
import { convertFromHTML } from 'draft-js'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)


const TextEditor = ({onChange}) => {
  return (
    <>
      <div className="container my-5">
        <Editor
          toolbarClassName="toolbar-text-editor"
          wrapperClassName="wrapper-text-editor"
          editorClassName="text-editor p-2 pl-3"
          onChange={onChange}
        />
      </div>
    </>
  )
}

export default TextEditor