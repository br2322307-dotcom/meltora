import { ProductVisual } from "./ProductArtwork";

export default function ProductCard({ item, onSelect, className = "" }) {
  return (
    <div
      className={`item-card ${className}`.trim()}
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      <div className="item-art">
        <ProductVisual item={item} />
      </div>
      <div className="item-title">
        {item.line1}
        <br />
        {item.line2}
      </div>
      {item.weight && <div className="item-weight">{item.weight}</div>}
      <div className="item-card-footer">
        <span className="item-price">₹{item.price}</span>
        <span className="item-order-pill">Details</span>
      </div>
    </div>
  );
}
