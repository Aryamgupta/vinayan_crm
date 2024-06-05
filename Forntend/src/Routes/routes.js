import records from "../pages/records/Table";
import test from "../pages/test/Table";
import StoreManagement from "../pages/storemanagement/StoreManagement";
import Orders from "../pages/orders/Orders";
import EmpDetails from "../pages/empdetails/EmpDetails";

const coreRoutes = [
  {
    path: "/records",
    title: "Records",
    component: records,
  },
  {
    path: "/test",
    title: "test",
    component: test,
  },
 

  {
    path: "/StoreManagement",
    title: "storemanagement",
    component: StoreManagement,
  },

  {
    path: "/orders",
    title: "storemanagement",
    component: Orders,
  },
  
  {
    path: "/empdetails",
    title: "EmpDetails",
    component: EmpDetails,
  },
  
  

];

const routes = [...coreRoutes];
export default routes;
