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
      className={`p-2 min-h-[60px] cursor-pointer transition-colors text-[0.85em] ${
        item ? "bg-filled hover:bg-btn-bg-hover" : "bg-bg hover:bg-bg-hover"
      }`}
      onClick={onClick}
    >
      {displayName ? (
        <>
          <div className="font-medium text-text">{displayName}</div>
          {item?.notes && <div className="text-text-light text-[0.8em] mt-1">{item.notes}</div>}
        </>
      ) : (
        <div className="text-border">+</div>
      )}
    </div>
  );
}
