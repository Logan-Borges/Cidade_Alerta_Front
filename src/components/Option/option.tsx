import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { OccurrenceData } from "../Occurrence/Occurrence";
import { OccurrenceService } from "../../services/OccurrenceService";

interface OptionProps {
  occurrence: OccurrenceData;
  onDeleted?: (id: number) => void;
}

const occurrenceService = new OccurrenceService();

const Option = ({ occurrence, onDeleted }: OptionProps) => {
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDeleteModal) return;

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteModal]);

  useEffect(() => {
    if (!showDeleteModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showDeleteModal]);

  const handleEdit = () => {
    setOpen(false);
    navigate("/reportar", { state: { editOccurrence: occurrence } });
  };

  const handleDeleteConfirm = async () => {
    if (!occurrence.id) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await occurrenceService.deleteOccurrence(occurrence.id);
      setShowDeleteModal(false);
      onDeleted?.(occurrence.id);
    } catch (error: any) {
      setDeleteError(error?.message || "Não foi possível excluir a ocorrência.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        ref={menuRef}
        className="relative inline-block"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <svg
            className="w-3 h-3 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 12a2 2 0 110-4 2 2 0 010 4zm0-6a2 2 0 110-4 2 2 0 010 4zm0 12a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg border z-50">
            <button
              type="button"
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              Editar
            </button>
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {showDeleteModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (!deleting) setShowDeleteModal(false);
            }}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white">Excluir ocorrência</h3>
              <p className="mt-2 text-sm text-white/70">
                Tem certeza que deseja excluir{" "}
                <span className="font-medium text-white">
                  {occurrence.title ?? "esta ocorrência"}
                </span>
                ? Esta ação não pode ser desfeita.
              </p>

              {deleteError && (
                <p className="mt-3 text-sm text-red-400">{deleteError}</p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleting ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Option;
