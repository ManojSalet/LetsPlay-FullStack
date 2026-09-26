import React, { useState } from "react";
import {
  FolderTree,
  Trophy,
  Activity,
  Layers,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  Search,
  Upload,
  Link as LinkIcon
} from "lucide-react";
import { uploadImage, getFullImageUrl } from "../../API/apiService";

const AdminCatalog = ({
  categories = [],
  sports = [],
  equipmentList = [],
  onSaveCategory,
  onDeleteCategory,
  onSaveSport,
  onDeleteSport,
  onSaveEquipment,
  onDeleteEquipment,
}) => {
  const [activeCatalogTab, setActiveCatalogTab] = useState("categories"); // 'categories' | 'sports' | 'equipment'
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [catModal, setCatModal] = useState({ isOpen: false, mode: "create", item: null });
  const [sportModal, setSportModal] = useState({ isOpen: false, mode: "create", item: null });
  const [equipModal, setEquipModal] = useState({ isOpen: false, mode: "create", item: null });

  // Delete confirmations
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'cat'|'sport'|'equip', id: string, name: string }
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states
  const [catForm, setCatForm] = useState({ name: "", description: "", image: "" });
  const [sportForm, setSportForm] = useState({ name: "", description: "", sport_image: "", category: "" });
  const [equipForm, setEquipForm] = useState({ name: "", description: "", equipment_image: "", sport: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Category Handlers
  const handleOpenCatModal = (cat = null) => {
    if (cat) {
      setCatForm({ name: cat.name || "", description: cat.description || "", image: cat.image || "" });
      setCatModal({ isOpen: true, mode: "edit", item: cat });
    } else {
      setCatForm({ name: "", description: "", image: "" });
      setCatModal({ isOpen: true, mode: "create", item: null });
    }
    setFormError("");
  };

  const handleSaveCat = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return setFormError("Category name is required.");
    setFormLoading(true);
    setFormError("");
    try {
      await onSaveCategory(catForm, catModal.mode, catModal.item?._id);
      setCatModal({ isOpen: false, mode: "create", item: null });
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save category.");
    } finally {
      setFormLoading(false);
    }
  };

  // Sport Handlers
  const handleOpenSportModal = (sport = null) => {
    if (sport) {
      setSportForm({
        name: sport.name || "",
        description: sport.description || "",
        sport_image: sport.sport_image || "",
        category: sport.category?._id || sport.category || categories[0]?._id || "",
      });
      setSportModal({ isOpen: true, mode: "edit", item: sport });
    } else {
      setSportForm({
        name: "",
        description: "",
        sport_image: "",
        category: categories[0]?._id || "",
      });
      setSportModal({ isOpen: true, mode: "create", item: null });
    }
    setFormError("");
  };

  const handleSaveSport = async (e) => {
    e.preventDefault();
    if (!sportForm.name.trim()) return setFormError("Sport name is required.");
    if (!sportForm.category) return setFormError("Please select a parent category.");
    setFormLoading(true);
    setFormError("");
    try {
      await onSaveSport(sportForm, sportModal.mode, sportModal.item?._id);
      setSportModal({ isOpen: false, mode: "create", item: null });
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save sport.");
    } finally {
      setFormLoading(false);
    }
  };

  // Equipment Handlers
  const handleOpenEquipModal = (equip = null) => {
    if (equip) {
      setEquipForm({
        name: equip.name || "",
        description: equip.description || "",
        equipment_image: equip.equipment_image || "",
        sport: equip.sport?._id || equip.sport || sports[0]?._id || "",
      });
      setEquipModal({ isOpen: true, mode: "edit", item: equip });
    } else {
      setEquipForm({
        name: "",
        description: "",
        equipment_image: "",
        sport: sports[0]?._id || "",
      });
      setEquipModal({ isOpen: true, mode: "create", item: null });
    }
    setFormError("");
  };

  const handleSaveEquip = async (e) => {
    e.preventDefault();
    if (!equipForm.name.trim()) return setFormError("Equipment name is required.");
    if (!equipForm.sport) return setFormError("Please select a parent sport.");
    setFormLoading(true);
    setFormError("");
    try {
      await onSaveEquipment(equipForm, equipModal.mode, equipModal.item?._id);
      setEquipModal({ isOpen: false, mode: "create", item: null });
    } catch (err) {
      setFormError(typeof err === "string" ? err : "Failed to save equipment.");
    } finally {
      setFormLoading(false);
    }
  };

  // Generic Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      if (deleteConfirm.type === "cat") await onDeleteCategory(deleteConfirm.id);
      if (deleteConfirm.type === "sport") await onDeleteSport(deleteConfirm.id);
      if (deleteConfirm.type === "equip") await onDeleteEquipment(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete item: " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Catalog Taxonomy</h1>
          <p className="text-xs text-slate-500">
            Structure categories, sports, and equipment groups for intuitive store navigation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeCatalogTab === "categories" && (
            <button
              type="button"
              onClick={() => handleOpenCatModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          )}
          {activeCatalogTab === "sports" && (
            <button
              type="button"
              onClick={() => handleOpenSportModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sport</span>
            </button>
          )}
          {activeCatalogTab === "equipment" && (
            <button
              type="button"
              onClick={() => handleOpenEquipModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Equipment</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        {[
          { id: "categories", label: `Categories (${categories.length})`, icon: FolderTree },
          { id: "sports", label: `Sports (${sports.length})`, icon: Trophy },
          { id: "equipment", label: `Equipment (${equipmentList.length})`, icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCatalogTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCatalogTab(tab.id)}
              className={`pb-3 inline-flex items-center gap-2 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. Categories View */}
      {/* ========================================================= */}
      {activeCatalogTab === "categories" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{cat.name}</h3>
                    <p className="text-[11px] font-mono text-slate-400 truncate">
                      slug: {cat.slug || cat.name?.toLowerCase().replace(/\s+/g, "-")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenCatModal(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm({ type: "cat", id: cat._id, name: cat.name })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                {cat.description || "Top-level sporting category."}
              </p>
              <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Assigned Sports:</span>
                <span className="font-bold text-indigo-600">
                  {sports.filter((s) => (s.category?._id || s.category) === cat._id).length} sports
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. Sports View */}
      {/* ========================================================= */}
      {activeCatalogTab === "sports" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sports.map((sport) => {
            const parentCat = categories.find((c) => c._id === (sport.category?._id || sport.category));
            const equipCount = equipmentList.filter((e) => (e.sport?._id || e.sport) === sport._id).length;

            return (
              <div
                key={sport._id}
                className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{sport.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        Category: {parentCat?.name || "General"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenSportModal(sport)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ type: "sport", id: sport._id, name: sport.name })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {sport.description || "Professional athletic discipline."}
                </p>
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Equipment Groups:</span>
                  <span className="font-bold text-purple-600">{equipCount} groups</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Equipment View */}
      {/* ========================================================= */}
      {activeCatalogTab === "equipment" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentList.map((equip) => {
            const parentSport = sports.find((s) => s._id === (equip.sport?._id || equip.sport));

            return (
              <div
                key={equip._id}
                className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{equip.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        Sport: {parentSport?.name || "General"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEquipModal(equip)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm({ type: "equip", id: equip._id, name: equip.name })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {equip.description || "Sporting gear and equipment items."}
                </p>
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Direct Sport Reference:</span>
                  <span className="font-bold text-amber-600 font-mono text-[11px]">
                    {parentSport?.name || "Unassigned"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* Category Modal */}
      {/* ========================================================= */}
      {catModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {catModal.mode === "edit" ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setCatModal({ isOpen: false, mode: "create", item: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {formError}
              </div>
            )}
            <form onSubmit={handleSaveCat} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g., Outdoor Sports"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Short description..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={catForm.image}
                    onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <label className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const res = await uploadImage(file);
                          if (res?.url) setCatForm((prev) => ({ ...prev, image: res.url }));
                        } catch (err) {
                          setFormError(typeof err === "string" ? err : "Failed to upload image");
                        }
                      }}
                    />
                  </label>
                </div>
                {catForm.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={getFullImageUrl(catForm.image)} alt="Preview" className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                    <span className="text-[11px] text-slate-500 truncate">{catForm.image}</span>
                  </div>
                )}
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCatModal({ isOpen: false, mode: "create", item: null })}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Sport Modal */}
      {/* ========================================================= */}
      {sportModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {sportModal.mode === "edit" ? "Edit Sport" : "Add New Sport"}
              </h3>
              <button
                type="button"
                onClick={() => setSportModal({ isOpen: false, mode: "create", item: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {formError}
              </div>
            )}
            <form onSubmit={handleSaveSport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sport Name *</label>
                <input
                  type="text"
                  required
                  value={sportForm.name}
                  onChange={(e) => setSportForm({ ...sportForm, name: e.target.value })}
                  placeholder="e.g., Badminton"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Category *</label>
                <select
                  required
                  value={sportForm.category}
                  onChange={(e) => setSportForm({ ...sportForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={sportForm.description}
                  onChange={(e) => setSportForm({ ...sportForm, description: e.target.value })}
                  placeholder="Short description..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sport Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sportForm.sport_image}
                    onChange={(e) => setSportForm({ ...sportForm, sport_image: e.target.value })}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <label className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const res = await uploadImage(file);
                          if (res?.url) setSportForm((prev) => ({ ...prev, sport_image: res.url }));
                        } catch (err) {
                          setFormError(typeof err === "string" ? err : "Failed to upload image");
                        }
                      }}
                    />
                  </label>
                </div>
                {sportForm.sport_image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={getFullImageUrl(sportForm.sport_image)} alt="Preview" className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                    <span className="text-[11px] text-slate-500 truncate">{sportForm.sport_image}</span>
                  </div>
                )}
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSportModal({ isOpen: false, mode: "create", item: null })}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : "Save Sport"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Equipment Modal */}
      {/* ========================================================= */}
      {equipModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {equipModal.mode === "edit" ? "Edit Equipment" : "Add New Equipment"}
              </h3>
              <button
                type="button"
                onClick={() => setEquipModal({ isOpen: false, mode: "create", item: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {formError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {formError}
              </div>
            )}
            <form onSubmit={handleSaveEquip} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  value={equipForm.name}
                  onChange={(e) => setEquipForm({ ...equipForm, name: e.target.value })}
                  placeholder="e.g., Cricket Bats"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Sport *</label>
                <select
                  required
                  value={equipForm.sport}
                  onChange={(e) => setEquipForm({ ...equipForm, sport: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select Sport</option>
                  {sports.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={equipForm.description}
                  onChange={(e) => setEquipForm({ ...equipForm, description: e.target.value })}
                  placeholder="Short description..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={equipForm.equipment_image}
                    onChange={(e) => setEquipForm({ ...equipForm, equipment_image: e.target.value })}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <label className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const res = await uploadImage(file);
                          if (res?.url) setEquipForm((prev) => ({ ...prev, equipment_image: res.url }));
                        } catch (err) {
                          setFormError(typeof err === "string" ? err : "Failed to upload image");
                        }
                      }}
                    />
                  </label>
                </div>
                {equipForm.equipment_image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={getFullImageUrl(equipForm.equipment_image)} alt="Preview" className="w-8 h-8 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                    <span className="text-[11px] text-slate-500 truncate">{equipForm.equipment_image}</span>
                  </div>
                )}
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEquipModal({ isOpen: false, mode: "create", item: null })}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : "Save Equipment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Delete Confirmation Modal */}
      {/* ========================================================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-sm p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-700">"{deleteConfirm.name}"</span>?
                This may affect child sports, equipment, or products assigned under it.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
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

export default AdminCatalog;
