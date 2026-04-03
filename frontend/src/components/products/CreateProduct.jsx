  import { useState } from "react"
  import Modal from "@/components/ui/Modal"
  import { productApi } from "../../lib/api"

  const STATUS = ["ACTIVE", "INACTIVE"]

  export default function CreateProduct({ open, onClose, onCreated }) {

    const [preview, setPreview] = useState(null)

    const [form, setForm] = useState({
      name: "",
      category: "",
      price: "",
      status: "ACTIVE",
      description: "",
      imageFile: null
    })

    const handleChange = (field) => (e) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value
      }))

    const handleImage = (e) => {
      const file = e.target.files[0]
      if (!file) return

      setForm((prev) => ({
        ...prev,
        imageFile: file
      }))

      setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async () => {
    try {

      const data = await productApi.create(form)

      onCreated?.(data)

      setForm({
        name: "",
        category: "",
        price: "",
        status: "ACTIVE",
        description: "",
        imageFile: null
      })

      setPreview(null)
      onClose()

    } catch (err) {
      console.error("Failed to create product", err)
    }
  }

    return (
      <Modal
        open={open}
        onClose={onClose}
        title="Add New Product"
        subtitle="Register a new product in the catalog."
        footer={
          <>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="btn-primary px-8 py-2.5"
            >
              Create Product
            </button>
          </>
        }
      >

        <div className="grid grid-cols-2 gap-6">

          {/* Product Name */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Product Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. Chicken Burger"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Category */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Category
            </label>

            <select
              value={form.category}
              onChange={handleChange("category")}
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Select Category</option>
              <option value="Beverage">Beverage</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Side Dish">Side Dish</option>
            </select>
          </div>

          {/* Price */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Price
            </label>

            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange("price")}
              placeholder="e.g. 149.99"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full bg-surface-container-low rounded-lg px-4 py-3 text-sm"
            />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 h-28 rounded-lg object-cover border"
              />
            )}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={handleChange("description")}
              rows="3"
              placeholder="Short description about the product"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

        </div>

      </Modal>
    )
  }