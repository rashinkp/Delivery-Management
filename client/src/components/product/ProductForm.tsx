// src/components/product/ProductForm.tsx
"use client";

import * as Yup from "yup";
import ReusableForm from "../Form";
import FormInput from "../Input";
import type { CreateProductDto, UpdateProductDto } from "@/types/product";

type Props = {
  initialValues?: Partial<CreateProductDto>;
  onSubmit: (values: CreateProductDto | UpdateProductDto) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
};

export const ProductForm = ({ initialValues, onSubmit, onClose, isLoading = false }: Props) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .required("Product name is required"),
    price: Yup.number()
      .positive("Price must be a positive number")
      .min(0.01, "Price must be at least 0.01")
      .required("Price is required"),
    category: Yup.string()
      .min(2, "Category must be at least 2 characters")
      .max(50, "Category must be less than 50 characters")
      .required("Category is required"),
    image: Yup.string()
      .url("Must be a valid URL")
      .required("Image URL is required"),
    stock: Yup.number()
      .integer("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .required("Stock is required"),
  });

  const defaults = {
    name: "",
    price: 0,
    category: "",
    image: "",
    stock: 0,
    ...initialValues,
  };

  return (
    <ReusableForm
      initialValues={defaults}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
          onClose();
        } catch (error) {
          console.error("Form submission error:", error);
          throw error;
        } finally {
          setSubmitting(false);
        }
      }}
      submitButtonText={isLoading ? "Saving..." : (initialValues?.name ? "Update Product" : "Create Product")}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <>
          <FormInput
            label="Product Name"
            name="name"
            placeholder="Enter product name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name ? errors.name : undefined}
          />
          
          <FormInput
            label="Price"
            name="price"
            type="number"
            placeholder="Enter price"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.price && errors.price ? errors.price : undefined}
          />
          
          <FormInput
            label="Category"
            name="category"
            placeholder="Enter category (e.g., Electronics, Food, Clothing)"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.category && errors.category ? errors.category : undefined}
          />
          
          <FormInput
            label="Image URL"
            name="image"
            type="url"
            placeholder="Enter image URL"
            value={values.image}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.image && errors.image ? errors.image : undefined}
          />
          
          <FormInput
            label="Stock Quantity"
            name="stock"
            type="number"
            placeholder="Enter stock quantity"
            value={values.stock}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.stock && errors.stock ? errors.stock : undefined}
          />
        </>
      )}
    </ReusableForm>
  );
};

