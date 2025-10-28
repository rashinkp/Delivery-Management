// src/pages/driver/Dashboard.tsx
"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600 mt-2">Quick actions</p>
      </div>
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link to="/driver/deliveries">Create New Order</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/driver/orders">My Orders</Link>
        </Button>
      </div>
    </div>
  )
}

export default Dashboard