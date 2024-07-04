import dynamic from 'next/dynamic';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)


const TextEditor = ({onChange}) => {
  const props = {
    toolbarClassName: "toolbar-text-editor",
    wrapperClassName: "wrapper-text-editor",
    editorClassName: "text-editor p-2 pl-3",
  } as any;

  return (
    <>
      <div className="container my-5">
        <Editor
          {...props}
          onChange={onChange}
        />
      </div>
    </>
  )
}

export default TextEditor