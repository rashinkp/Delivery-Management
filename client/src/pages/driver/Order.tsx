// src/pages/driver/Order.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  Package,
  Store,
} from "lucide-react";
import Alert from "@/components/ui/alert";
import { useVendors } from "@/hooks/useVendors";
import { useProducts } from "@/hooks/useProducts";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import type { Vendor } from "@/types/vendor";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/order";

export default function Order() {
  const { user } = useAuth();
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [collectedAmount, setCollectedAmount] = useState<string>("");
  const [errorHandler, setErrorHandler] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const createOrderMutation = useCreateOrder();

  const addToCart = (product: Product) => {
    setErrorHandler(null);
    setSuccessMessage(null);

    const existingItem = cart.find(
      (item) => item.productId === product.productId
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.productId,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCreateOrder = async () => {
    if (!selectedVendor) {
      setErrorHandler("Please select a vendor first!");
      return;
    }

    if (!user?._id) {
      setErrorHandler("User not found. Please login again.");
      return;
    }

    if (cart.length === 0) {
      setErrorHandler("Please add at least one product to cart!");
      return;
    }

    try {
      setErrorHandler(null);
      setSuccessMessage(null);

      await createOrderMutation.mutateAsync({
        driverId: user._id,
        vendorId: selectedVendor.vendorId,
        products: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        collectedAmount: Number(collectedAmount || 0),
      });

      setSuccessMessage("Order created successfully!");
      setCart([]);
      setSelectedVendor(null);
    } catch (error: any) {
      console.error("Create order error:", error);
      setErrorHandler(
        error?.message || "Failed to create order. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        <p className="text-gray-600 mt-2">
          Select a vendor and add products to create an order
        </p>
      </div>

      {/* Error/Success Messages */}
      {errorHandler && <Alert type="error" message={errorHandler} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Vendor Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Selection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Select Vendor</h2>
            </div>

            {vendorsLoading ? (
              <div className="text-center py-8">Loading vendors...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vendors.map((vendor) => (
                  <button
                    key={vendor.vendorId}
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setErrorHandler(null);
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      selectedVendor?.vendorId === vendor.vendorId
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">
                      {vendor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {vendor.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      {vendor.contactNumber}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Selection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold">Products</h2>
            </div>

            {productsLoading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : selectedVendor ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter((p) => p.stock > 0)
                  .map((product) => (
                    <div
                      key={product.productId}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-contain rounded mb-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">
                        {product.category}
                      </p>
                      <p className="text-sm font-bold text-green-600">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </p>
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        className="w-full mt-2"
                        disabled={product.stock === 0}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Please select a vendor first to view products
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Cart</h2>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Your cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4 mt-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-700">
                  Collected Amount
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-40 px-3 py-2 border rounded"
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <Button
                onClick={handleCreateOrder}
                className="w-full"
                disabled={
                  cart.length === 0 ||
                  !selectedVendor ||
                  createOrderMutation.isPending
                }
              >
                {createOrderMutation.isPending
                  ? "Creating Order..."
                  : "Create Order"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
