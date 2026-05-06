import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, MapPin, AlertTriangle } from "lucide-react";
import { CATEGORIES } from "../../constants/occurrence/occurrenceConstants";
// import CategoryIcon from "../incidents/CategoryIcon";
import ImageUpload from "../../components/Occurrence/ImageUpload";
import DsButton from "../../components/ds/DsButton";
import DsTextarea from "../../components/ds/DsTextarea";
import BackButton from "../../components/ds/BackButton";
import DsInput from "../../components/ds/DsInput";

const STEPS = ["Tipo", "Localização", "Detalhes", "Foto"];

const URGENCY_OPTIONS = [
  { value: "baixa",   label: "Baixa",   desc: "Não é urgente",         color: "border-green-500/40 hover:border-green-500 text-green-400" },
  { value: "media",   label: "Média",   desc: "Atenção necessária",    color: "border-yellow-500/40 hover:border-yellow-500 text-yellow-400" },
  { value: "alta",    label: "Alta",    desc: "Precisa de ação rápida",color: "border-orange-500/40 hover:border-orange-500 text-orange-400" },
  { value: "critica", label: "Crítica", desc: "Emergência imediata",   color: "border-red-500/40 hover:border-red-500 text-red-400" },
];

export default function ReportIncident() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: "", title: "", description: "",
    neighborhood: "", address: "", city: "",
    urgency: "media", image_url: "",
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 0) return !!form.category;
    if (step === 1) return !!form.neighborhood;
    if (step === 2) return !!form.title;
    return true;
  };
  const handleSubmit = async () => {

    setSubmitting(true);
    // const incident = await base44.entities.Incident.create({ ...form, status: "ativo", views: 0 });
    // navigate(`/incidents/${incident.id}`);
    console.log("Form submitted:", form);
  };

  return (
    <div className="w-full bg-[#000]">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 glass-dark border-b border-white/10 pt-16">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <BackButton onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} />
            <div className="flex-1">
              <h1 className="font-bold text-white text-base">Reportar Ocorrência</h1>
              <p className="text-white/40 text-xs">{STEPS[step]} · Passo {step + 1} de {STEPS.length}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 0: Category */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Que tipo de ocorrência?</h2>
                <p className="text-white/50">Selecione a categoria que melhor descreve o incidente.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => update("category", key)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 text-center transition-all duration-200 ${
                      form.category === key
                        ? `${cat.bg} ${cat.border} scale-95`
                        : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/8"
                    }`}
                  >
                    {/* <CategoryIcon category={key} className={`w-7 h-7 ${form.category === key ? cat.text : "text-white/60"}`} /> */}
                    <span className={`text-xs font-semibold ${form.category === key ? "text-white" : "text-white/70"}`}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Onde aconteceu?</h2>
                <p className="text-white/50">Informe a localização do incidente.</p>
              </div>
              <div className="space-y-4">
                <DsInput label="Bairro *"              value={form.neighborhood} onChange={v => update("neighborhood", v)} icon={<MapPin className="w-4 h-4" />} placeholder="Ex: Centro, Copacabana..." />
                <DsInput label="Endereço ou referência" value={form.address}      onChange={v => update("address", v)}      placeholder="Ex: Rua das Flores, 123" />
                <DsInput label="Cidade"                value={form.city}         onChange={v => update("city", v)}         placeholder="Ex: Rio de Janeiro" />
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Descreva o incidente</h2>
                <p className="text-white/50">Quanto mais detalhes, melhor.</p>
              </div>
              <div className="space-y-4">
                <DsInput label="Título *" value={form.title} onChange={v => update("title", v)} placeholder="Resumo em uma linha" />
                <DsTextarea value={form.description} onChange={v => update("description", v)} placeholder="Descreva o que aconteceu com detalhes..." />
                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-3">
                    <AlertTriangle className="w-4 h-4 inline mr-1.5" />
                    Nível de urgência
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {URGENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => update("urgency", opt.value)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          form.urgency === opt.value
                            ? `bg-white/8 ${opt.color}`
                            : "bg-white/5 border-white/10 hover:bg-white/8"
                        }`}
                      >
                        <div className={`text-sm font-semibold mb-0.5 ${form.urgency === opt.value ? opt.color.split(" ")[2] : "text-white/70"}`}>{opt.label}</div>
                        <div className="text-xs text-white/40">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Photo */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Adicionar evidência</h2>
                <p className="text-white/50">Uma foto ajuda a validar e agilizar o atendimento.</p>
              </div>
              <ImageUpload value={form.image_url} onChange={v => update("image_url", v)} />
              {/* Summary */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2.5">
                <h3 className="text-sm font-semibold text-white/80">Resumo</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Tipo",     value: CATEGORIES[form.category]?.label },
                    { label: "Urgência", value: form.urgency },
                    { label: "Bairro",   value: form.neighborhood },
                    { label: "Título",   value: form.title },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span className="text-white/40">{label}</span>
                      <p className="text-white/80 font-medium capitalize truncate">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-8">
          {step < STEPS.length - 1 ? (
            <DsButton
              variant="secondary"
              size="lg"
              fullWidth
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
            >
              Continuar 
              <ArrowRight className="w-5 h-5" />
            </DsButton>
          ) : (
            <DsButton
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              disabled={!canNext()}
              onClick={handleSubmit}
            >
              <Check className="w-5 h-5" /> Reportar Ocorrência
            </DsButton>
          )}
        </div>
      </div>
    </div>
  );
}