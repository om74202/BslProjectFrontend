import Active from "./Machine/MachineStatus/Active";
import InActive from "./Machine/MachineStatus/Inactive";
import MachineTabs from "../Components/Tabs"; 

function Machine() {

  const tabs = [
    {
      key: "active",
      label: "Active Machines",
      content: (
        <div className="overflow-x-hidden">
          <div className="overflow-x-hidden">
            <Active />
          </div>
        </div>
      ),
    },
    {
      key: "inactive",
      label: "InActive Machines",
      content: (
        <div>
          <InActive />
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen">
     <MachineTabs tabs={tabs} />
    </div>
  );
}

export default Machine;
