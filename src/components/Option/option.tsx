import { useEffect, useRef, useState } from "react";

const Option = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
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
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Editar
          </button>
          <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100">
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

export default Option;