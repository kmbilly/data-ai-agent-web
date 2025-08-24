import { makeAssistantToolUI } from "@assistant-ui/react";
import { Database, Loader, Terminal, TriangleAlert } from "lucide-react";

type ExecutePythonArgs = {
  code: string;
};

type ExecutePythonResult = {
  codeResult: string;
};

const UI = ({type} : {type: "running" | "complete" | "incomplete" | "requires-action"}) => (
    <div className="tool inline-flex items-center gap-2 border border-blue-500 px-4 py-2 mt-5">
        {type === 'running' ? <Loader className='animate-spin' /> : type === 'incomplete'? <TriangleAlert /> : <Terminal />}
        <div className="flex flex-col pl-1">
            <span>{type === 'running' ? 'Executing Python...' : type === 'incomplete'? 'Failed to execute python' : 'Python Executed'}</span>
        </div>
    </div>
)

export const ExecutePythonToolUI = makeAssistantToolUI<ExecutePythonArgs, ExecutePythonResult>({
  toolName: "executePython",
  render: ({ args, status, result }) => {
    console.log({ args, status, result })
    return (
        <UI type={status.type} />
    );
  },
});