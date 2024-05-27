import records from "../pages/records/Table";
import test from "../pages/test/Table";
import stock from "../pages/Stock/RemainStock";
import StoreManagement from "../pages/storemanagement/StoreManagement";
import Orders from "../pages/orders/Orders";

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
    path: "/Stock",
    title: "stock",
    component: stock,
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
  
  

];

const routes = [...coreRoutes];
export default routes;
