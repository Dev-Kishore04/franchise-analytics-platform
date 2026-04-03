import Modal from "@/components/ui/Modal"
import { productApi } from "../../lib/api"

export default function DeleteProduct({ open, onClose, product, onDeleted }) {

  const handleDelete = async () => {
    try {

      await productApi.delete(product.id)

      onDeleted?.(product.id)

      onClose()

    } catch (err) {
      console.error("Failed to delete product", err)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Product"
      subtitle="This action cannot be undone."
      footer={
        <>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-8 py-2.5 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </>
      }
    >

      <div className="text-sm text-on-surface-variant">
        Are you sure you want to delete
        <span className="font-bold text-on-surface"> {product?.name}</span>?
      </div>

    </Modal>
  )
}