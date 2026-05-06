import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image, Loader2 } from "lucide-react";
// import { base44 } from "@/api/base44Client";

export default function ImageUpload({ value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const { file_url } = await (() => ({ file_url: "https://example.com/image.jpg" }))();
    onChange(file_url);
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {value ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl overflow-hidden aspect-video bg-muted"
          >
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => onChange("")}
                className="p-2.5 bg-red-500 rounded-full text-white hover:bg-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && inputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              dragging
                ? "border-blue-500 bg-blue-500/8 shadow-blue-glow"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Enviando imagem...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  dragging ? "bg-blue-500/20" : "bg-muted"
                }`}>
                  {dragging ? (
                    <Upload className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Image className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {dragging ? "Solte a imagem aqui" : "Adicionar foto"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Arraste ou clique para selecionar (opcional)
                  </p>
                </div>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}