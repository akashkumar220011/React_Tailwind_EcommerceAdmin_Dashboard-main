import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, AddIcon, PublishIcon, StoreIcon } from "../icons";
import {
  Card,
  CardBody,
  Label,
  Input,
  Textarea,
  Button,
  Select,
} from "@windmill/react-ui";

const FormTitle = ({ children }) => {
  return (
    <h2 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </h2>
  );
};

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: null,
    shortDescription: "",
    fullDescription: "",
    stockQuantity: "",
    category: "",
    status: "draft",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure that the price and stockQuantity are properly converted to numbers
    const {
      name,
      price,
      shortDescription,
      fullDescription,
      stockQuantity,
      category,
      status,
    } = formData;

    const productData = new FormData();
    productData.append("name", name);
    productData.append("price", parseFloat(price)); // Ensure price is sent as a number
    productData.append("shortDescription", shortDescription);
    productData.append("fullDescription", fullDescription);
    productData.append("stockQuantity", parseInt(stockQuantity)); // Ensure stockQuantity is sent as an integer
    productData.append("category", category);
    productData.append("status", status);
    if (formData.image) {
      productData.append("image", formData.image);
    }

    // Retrieve token from local storage or cookies
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
        }
      );
      setSuccess(response.data.message);
      setError(""); // clear previous error if any
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSuccess(""); // clear previous success message if any
    }
  };


  return (
    <div>
      <PageTitle>Add New Product</PageTitle>

      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Add new Product</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full mt-8 grid gap-4 grid-cols-1 md:grid-cols-3"
      >
        <Card className="row-span-2 md:col-span-2">
          <CardBody>
            <FormTitle>Product Image</FormTitle>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mb-4 text-gray-800 dark:text-gray-300"
            />

            <FormTitle>Product Name</FormTitle>
            <Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mb-4"
                placeholder="Type product name here"
              />
            </Label>

            <FormTitle>Product Price</FormTitle>
            <Label>
              <Input
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mb-4"
                placeholder="Enter product price here"
              />
            </Label>

            <FormTitle>Short Description</FormTitle>
            <Label>
              <Textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="mb-4"
                rows="2"
                placeholder="Enter a short description for the product"
              />
            </Label>

            <FormTitle>Full Description</FormTitle>
            <Label>
              <Textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows="5"
                placeholder="Enter a full description for the product"
              />
            </Label>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <FormTitle>Stock Quantity</FormTitle>
            <Label>
              <Input
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="mb-4"
                placeholder="Enter the stock quantity"
              />
            </Label>

            <FormTitle>Category</FormTitle>
            <Label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mb-4"
                placeholder="Enter the category"
              />
            </Label>

            <FormTitle>Status</FormTitle>
            <Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mb-4"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </Label>

            <Button type="submit" block className="mt-4">
              <Icon icon={AddIcon} className="w-5 h-5" />
              <span>Add Product</span>
            </Button>

            {error && <p className="text-red-600 mt-4">{error}</p>}
            {success && <p className="text-green-600 mt-4">{success}</p>}
          </CardBody>
        </Card>
      </form>
    </div>
  );
};

export default AddProduct;
