import LeftPanel from "../components/register/LeftPanel";
import RightPanel from "../components/register/RightPanel";



export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full p-5 flex-col overflow-x-hidden bg-gray-50  lg:flex-row">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
