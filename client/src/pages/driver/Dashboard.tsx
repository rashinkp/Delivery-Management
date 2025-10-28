// src/pages/driver/Dashboard.tsx
"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
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