import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { productSchema } from "../../utils/validators.js";
import { CATEGORIES } from "../../utils/formatters.js";
import { useState } from "react";
import axios from "axios";

export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialValues || {
      name: "",
      description: "",
      category: "Vegetables",
      price: "",
      unit: "kg",
      quantity: "",
      location: "",
      imageUrl: "",
    },
  });

  return (
    <form 
    onSubmit={handleSubmit(async(data) => {
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const response = await axios.post(
          "http://localhost:5000/api/upload/products",
          formData,
          {
            headers:{
              "Content-Type": "multipart/form-data",
            },
          }
        );
        data.imageUrl = response.data.imageUrl;
      }

      await onSubmit(data);
    })}>
      <div className="form-group">
        <label className="form-label">Product name</label>
        <input className="form-input" placeholder="e.g. Fresh Tomatoes" {...register("name")} />
        {errors.name && <div className="form-error">{errors.name.message}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" placeholder="Describe your produce..." {...register("description")} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <div className="form-error">{errors.category.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Unit</label>
          <input className="form-input" placeholder="kg, bag, basket..." {...register("unit")} />
          {errors.unit && <div className="form-error">{errors.unit.message}</div>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Price per unit (₦)</label>
          <input className="form-input" type="number" step="0.01" min="0" {...register("price")} />
          {errors.price && <div className="form-error">{errors.price.message}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Available quantity</label>
          <input className="form-input" type="number" min="0" {...register("quantity")} />
          {errors.quantity && <div className="form-error">{errors.quantity.message}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Location</label>
        <input className="form-input" placeholder="e.g. Kano, Nigeria" {...register("location")} />
      </div>

      <div className="form-group">
        {/*<label className="form-label">Image URL (optional)</label>
        <input className="form-input" placeholder="https://..." {...register("imageUrl")} /> */}

        <label className="form-label">Product Image</label>
        <input type="file" accept="image/*" className="form-input" onChange={(e) => setSelectedImage(e.target.files[0])} />
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
