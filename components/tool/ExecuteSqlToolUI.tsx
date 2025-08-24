import { makeAssistantToolUI } from "@assistant-ui/react";
import { Database, Loader, TriangleAlert } from "lucide-react";

type ExecuteSqlArgs = {
  sql: string;
};

type ExecuteSqlResult = {
  queryResult: string;
};

const UI = ({type} : {type: "running" | "complete" | "incomplete" | "requires-action"}) => (
    <div className="tool inline-flex items-center gap-2 border border-green-500 px-4 py-2 mt-5">
        {type === 'running' ? <Loader className='animate-spin' /> : type === 'incomplete'? <TriangleAlert /> : <Database />}
        <div className="flex flex-col pl-1">
            <span>{type === 'running' ? 'Examining Data...' : type === 'incomplete'? 'Failed to examine data' : 'Data Examined'}</span>
        </div>
    </div>
)

export const ExecuteSqlToolUI = makeAssistantToolUI<ExecuteSqlArgs, ExecuteSqlResult>({
  toolName: "executeSql",
  render: ({ args, status, result }) => {
    console.log({ args, status, result })
    return (
        <UI type={status.type} />
    );
  },
});