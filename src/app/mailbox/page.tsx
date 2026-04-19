import { redirect } from "next/navigation";
const Dashboard = () => {
  redirect("/mailbox/inbox");
};

export default Dashboard;
