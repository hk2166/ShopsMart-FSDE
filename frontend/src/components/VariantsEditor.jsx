import React from "react";
import PropTypes from "prop-types";
import { Plus, Trash2 } from "lucide-react";

const emptyVariant = () => ({ size: "", color: "", sku: "", stock: "", price_modifier: "0" });

const VariantsEditor = ({ variants, onChange }) => {
  const add = () => onChange([...variants, emptyVariant()]);

  const remove = (idx) => onChange(variants.filter((_, i) => i !== idx));

  const update = (idx, field, value) => {
    const updated = variants.map((v, i) => (i === idx ? { ...v, [field]: value } : v));
    onChange(updated);
  };

  const inputCls =
    "block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Product Variants <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <Plus className="w-3.5 h-3.5" /> Add Variant
        </button>
      </div>

      {variants.length === 0 && (
        <p className="text-xs text-gray-400 italic">No variants added. Click "Add Variant" to add sizes, colors, or SKUs.</p>
      )}

      {variants.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
            <span>Size</span>
            <span>Color</span>
            <span>SKU</span>
            <span>Stock</span>
            <span>Price +/-</span>
          </div>
          {variants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 items-center">
              <input type="text" placeholder="M / XL" value={v.size} onChange={(e) => update(idx, "size", e.target.value)} className={inputCls} />
              <input type="text" placeholder="Red" value={v.color} onChange={(e) => update(idx, "color", e.target.value)} className={inputCls} />
              <input type="text" placeholder="SKU-001" value={v.sku} onChange={(e) => update(idx, "sku", e.target.value)} className={inputCls} />
              <input type="number" placeholder="10" min="0" value={v.stock} onChange={(e) => update(idx, "stock", e.target.value)} className={inputCls} />
              <div className="flex items-center gap-1">
                <input type="number" placeholder="0" value={v.price_modifier} onChange={(e) => update(idx, "price_modifier", e.target.value)} className={inputCls} />
                <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

VariantsEditor.propTypes = {
  variants: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.string,
      color: PropTypes.string,
      sku: PropTypes.string,
      stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      price_modifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default VariantsEditor;
