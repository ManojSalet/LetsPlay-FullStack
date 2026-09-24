import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Layers,
  X,
  Loader2
} from "lucide-react";

const AdminProducts = ({
  products = [],
  categories = [],
  sports = [],
  equipmentList = [],
  onSaveProduct,
  onDeleteProduct,
  modalState,
  setModalState,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for Add / Edit Modal
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sku: "",
    price: "",
    discountPer: "0",
    qty: "10",
    category: "",
    sport: "",
    equipment: "",
    image_url: "",
    description: "",
    isActive: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Open modal in Create mode
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      brand: "",
      sku: "",
      price: "",
      discountPer: "0",
      qty: "10",
      category: categories[0]?._id || "",
      sport: sports[0]?._id || "",
      equipment: equipmentList[0]?._id || "",
      image_url: "",
      description: "",
      isActive: true,
    });
    setFormError("");
    setModalState({ isOpen: true, mode: "create", product: null });
  };

  // Open modal in Edit mode
  const handleOpenEdit = (product) => {
    setFormData({
      name: product.name || "",
      brand: product.brand || "",
      sku: product.sku || "",
      price: product.price ? String(product.price) : "",
      discountPer: product.discountPer !== undefined ? String(product.discountPer) : "0",
      qty: product.qty !== undefined ? String(product.qty) : "0",
      category: product.category?._id || product.category || "",
      sport: product.sport?._id || product.sport || "",
      equipment: product.equipment?._id || product.equipment || "",
      image_url: Array.isArray(product.product_images) && product.product_images.length > 0 ? product.product_images[0] : "",
      description: product.description || "",
      isActive: product.isActive !== undefined ? product.isActive : true,
    });
    setFormError("");
    setModalState({ isOpen: true, mode: "edit", product });
  };

  // Filter products based on search and stock status
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (stockFilter === "low") {
        return Number(p.qty) > 0 && Number(p.qty) <= 5;
      }
      if (stockFilter === "out") {
        return Number(p.qty) <= 0;
      }
      if (stockFilter === "active") {
        return p.isActive !== false;
      }
      if (stockFilter === "inactive") {
        return p.isActive === false;
      }

      return true;
    });
  }, [products, searchTerm, stockFilter]);

  // Handle form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError("Please enter a valid price greater than 0.");
      return;
    }

    setFormLoading(true);
    setFormError("");

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim() || "General",
      sku: formData.sku.trim() || undefined,
      price: Number(formData.price),
      discountPer: Number(formData.discountPer) || 0,
      qty: Number(formData.qty) || 0,
      category: formData.category || undefined,
      sport: formData.sport || undefined,
      equipment: formData.equipment || undefined,
      product_images: formData.image_url.trim() ? [formData.image_url.trim()] : [],
      description: formData.description.trim(),
      isActive: formData.isActive,
    };

    try {
      await onSaveProduct(payload, modalState.mode, modalState.product?._id);
      setModalState({ isOpen: false, mode: "create", product: null });
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save product.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
    } catch (err) {
      alert("Failed to delete product: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Dynamic calculation for selling price preview
  const previewRegularPrice = Number(formData.price) || 0;
  const previewDiscount = Number(formData.discountPer) || 0;
  const previewSellingPrice = Math.round(previewRegularPrice - (previewRegularPrice * previewDiscount) / 100);

  return (
    <div className="space-y-6">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-xs text-slate-500">
            Manage inventory items, pricing, SKUs, and stock visibility
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, brand, or SKU..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Stock Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Filter:</span>
          {[
            { id: "all", label: "All Items" },
            { id: "low", label: "Low Stock (≤5)" },
            { id: "out", label: "Out of Stock" },
            { id: "active", label: "Active" },
            { id: "inactive", label: "Inactive" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStockFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                stockFilter === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm || stockFilter !== "all"
                ? "Try adjusting your search query or stock filter to view matching products."
                : "Your catalog is currently empty. Click 'Add New Product' to list your first item."}
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 pl-6 pr-4">Product Info</th>
                  <th className="py-3.5 px-4">SKU / Brand</th>
                  <th className="py-3.5 px-4">Pricing</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 pr-6 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.map((p) => {
                  const regularPrice = Number(p.price) || 0;
                  const discount = Number(p.discountPer) || 0;
                  const sellingPrice = p.selling_price || Math.round(regularPrice - (regularPrice * discount) / 100);
                  const isLowStock = Number(p.qty) > 0 && Number(p.qty) <= 5;
                  const isOutOfStock = Number(p.qty) <= 0;
                  const imageSrc = Array.isArray(p.product_images) && p.product_images.length > 0 ? p.product_images[0] : null;

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3 min-w-0 max-w-[280px]">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML = '<span class="text-xs text-slate-400">N/A</span>';
                                }}
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate leading-tight">
                              {p.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {p.sport?.name || p.category?.name || "Sports Catalog"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Brand */}
                      <td className="py-4 px-4 text-xs font-medium text-slate-600">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700 block w-max">
                          {p.sku || "LP-GEN"}
                        </span>
                        <span className="text-slate-400 mt-1 block truncate max-w-[120px]">
                          {p.brand || "General"}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">
                          ₹{sellingPrice.toLocaleString("en-IN")}
                        </div>
                        {discount > 0 && (
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="line-through">₹{regularPrice.toLocaleString("en-IN")}</span>
                            <span className="text-emerald-600 font-semibold text-[11px]">
                              {discount}% OFF
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isOutOfStock
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : isLowStock
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {isOutOfStock ? (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>0 in stock</span>
                            </>
                          ) : isLowStock ? (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{p.qty} left</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{p.qty} available</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          p.isActive !== false
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {p.isActive !== false ? "Active" : "Hidden"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 pl-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p._id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* Add / Edit Product Modal */}
      {/* ========================================================= */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {modalState.mode === "edit" ? "Edit Product Details" : "Create New Product"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Fill in the technical specifications, pricing, and media for this item.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalState({ isOpen: false, mode: "create", product: null })}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., SG Player Edition English Willow Cricket Bat"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Grid 1: Brand & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., SG, SS Ton, Nivia, Yonex"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    SKU (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Leave empty to auto-generate"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Grid 2: Pricing & Discount & Qty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2999"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={formData.discountPer}
                    onChange={(e) => setFormData({ ...formData, discountPer: e.target.value })}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Selling Price Live Calculation Callout */}
              <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-900">
                  Calculated Selling Price for Customers:
                </span>
                <span className="text-base font-black text-indigo-700">
                  ₹{previewSellingPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Grid 3: Category & Sport & Equipment Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Sport
                  </label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Select Sport</option>
                    {sports.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Equipment Group
                  </label>
                  <select
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Select Equipment</option>
                    {equipmentList.map((eq) => (
                      <option key={eq._id} value={eq._id}>
                        {eq.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /images/..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                {formData.image_url && (
                  <div className="mt-2.5 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover bg-white"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <span className="text-xs text-slate-500 truncate">
                      Image preview loaded
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Technical material, weight, dimensions, and grip specifications..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                  Make product visible to customers immediately (Active)
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalState({ isOpen: false, mode: "create", product: null })}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{modalState.mode === "edit" ? "Update Product" : "Create Product"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Delete Confirmation Modal */}
      {/* ========================================================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this product from the catalog? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
