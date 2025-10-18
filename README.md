🚚 Wholesale Delivery Management System

A backend system built using NestJS, GraphQL, and MongoDB to manage the efficient distribution of goods from wholesalers to retail vendors.
It provides role-based access for Admins and Truck Drivers (TD), enabling seamless management of vendors, products, and orders.

📋 Table of Contents

Overview

Features

Tech Stack

Modules

User Roles & Workflows

Installation & Setup

GraphQL Playground

Deliverables

Future Enhancements

🧾 Overview

The Wholesale Delivery Management App is designed to simplify the logistics between wholesalers and vendors.
It allows Admins to manage truck drivers, vendors, and product inventories, while Truck Drivers can log in, select vendors, and generate bills or delivery orders through a simple workflow.

🚀 Features
🔐 Authentication & Roles

Secure JWT-based authentication

Role-based access for Admin and Truck Drivers

Login via mobile number and password

🧑‍💼 Admin Features

Manage Truck Driver profiles (CRUD)

Manage Vendors (CRUD)

Manage Products & Inventory (CRUD)

View and monitor all orders

🚛 Truck Driver Features

Login using mobile number and password

Select vendors from list

Add products and quantities to create new bills (orders)

View their own delivery orders

🧾 Orders Management

Orders link Truck Driver, Vendor, and Products

Tracks total bill amount and collected amount

Nested object responses (e.g., show full vendor/product details)

⚙️ System Features

Input validation with class-validator

Password encryption with bcryptjs

GraphQL with auto-generated schema (code-first)

Mongoose ORM for MongoDB integration

Clean modular architecture for scalability

🧰 Tech Stack
Technology	Purpose
NestJS	Backend framework
GraphQL (Apollo Server)	API Query Language
MongoDB + Mongoose	Database & ODM
JWT (jsonwebtoken)	Authentication
class-validator / class-transformer	Validation
bcryptjs	Password hashing
🧩 Modules
Module	Description
Auth	JWT-based authentication and login for Admin/TD
Users	Manage Admin and Truck Driver profiles
Vendors	Manage vendor details and contact info
Products	Manage products, prices, categories, and stock
Orders	Create and view delivery orders with nested data
👥 User Roles & Workflows
🧑‍💼 Admin Workflow

Login to the system

Manage Truck Drivers, Vendors, and Products

Monitor and view all delivery orders

🚛 Truck Driver Workflow

Login using mobile number and password

Choose a vendor

Add products to cart with quantities

Generate and submit a delivery bill (order)

⚙️ Installation & Setup
1. Clone Repository
git clone https://github.com/<your-username>/wholesale-delivery-management.git
cd wholesale-delivery-management

2. Install Dependencies
npm install

3. Environment Setup

Create a .env file in the root directory:

MONGO_URI=mongodb://localhost:27017/wholesale-delivery
JWT_SECRET=your_jwt_secret
PORT=3000

4. Run the Server
npm run start:dev

🎯 GraphQL Playground

Once the server starts, visit:
👉 http://localhost:3000/graphql

You can run all queries and mutations (register, login, create vendor, create order, etc.) directly from the GraphQL Playground.

📦 Deliverables

Fully functional NestJS + GraphQL backend

Postman / GraphQL collection for testing all endpoints

Role-based authentication with JWT

Complete CRUD operations for Admin modules

Nested data fetching for products, vendors, and orders

🔮 Future Enhancements

Add dashboard analytics (e.g., total deliveries, total amount collected)

Implement product stock auto-update during orders

File/image uploads for product images

Delivery status tracking (e.g., In Transit, Delivered)

Mobile app integration for Truck Drivers (future scope)

👨‍💻 Author

Rashin KP
💼 Backend Developer | Passionate about clean architecture & scalable APIs
📧 rashinkp001@gmail.com