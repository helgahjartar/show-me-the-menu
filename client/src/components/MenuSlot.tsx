import type { SetMenuItem } from "../types";

interface Props {
  item: SetMenuItem | undefined;
  onClick: () => void;
}

export default function MenuSlot({ item, onClick }: Props) {
  const displayName = item
    ? item.customName || (item.recipeId ? `Recipe #${item.recipeId}` : null)
    : null;

  return (
    <div
      className={`menu-slot ${item ? "filled" : ""}`}
      onClick={onClick}
    >
      {displayName ? (
        <>
          <div className="slot-name">{displayName}</div>
          {item?.notes && <div className="slot-notes">{item.notes}</div>}
        </>
      ) : (
        <div style={{ color: "#d9d1b8" }}>+</div>
      )}
    </div>
  );
}
