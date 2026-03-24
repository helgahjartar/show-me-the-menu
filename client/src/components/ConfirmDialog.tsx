import { btn, btnDanger } from "../utils/styles";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-accent/40 flex items-center justify-center z-100" onClick={onCancel}>
      <div className="bg-bg border border-border rounded-xl p-6 sm:p-8 w-[90%] max-w-[380px] text-center" onClick={(e) => e.stopPropagation()}>
        <p className="m-0 mb-6 text-lg">{message}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button className={btn} onClick={onCancel}>Cancel</button>
          <button className={btnDanger} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
