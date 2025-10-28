import { Link } from "react-router-dom";
import { Package, Store, Users, ClipboardList } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Quick actions and navigation</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/vendors"
          className="block border rounded-lg p-4 hover:shadow-md transition bg-white"
        >
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold">Vendors</h3>
              <p className="text-sm text-gray-500">Manage vendor profiles</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="block border rounded-lg p-4 hover:shadow-md transition bg-white"
        >
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-semibold">Products</h3>
              <p className="text-sm text-gray-500">Manage inventory</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/truck-drivers"
          className="block border rounded-lg p-4 hover:shadow-md transition bg-white"
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <h3 className="font-semibold">Drivers</h3>
              <p className="text-sm text-gray-500">Manage truck drivers</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="block border rounded-lg p-4 hover:shadow-md transition bg-white"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-orange-600" />
            <div>
              <h3 className="font-semibold">Orders</h3>
              <p className="text-sm text-gray-500">View and track orders</p>
            </div>
          </div>
        </Link>
      </div>

      
    </div>
  );
};

export default Dashboard