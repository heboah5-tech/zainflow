import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Plus, Check, Loader2 } from "lucide-react";
import AnimatedElement from "@/components/AnimatedElement";
import AmbientBackground from "@/components/AmbientBackground";
import EezeeForm from "@/components/EezeeForm";

export default function Home() {
  const [activeTab, setActiveTab] = useState("bill");
  const [payFor, setPayFor] = useState("other");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [additionalNumbers, setAdditionalNumbers] = useState([]);
  const [payForOpen, setPayForOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const payForOptions = [
    { value: "other", label: "رقم آخر" },
    { value: "self", label: "رقمي" },
    { value: "family", label: "أحد أفراد العائلة" },
  ];

  const isValid = activeTab === 'bill' ? phoneNumber.length >= 8 : true;
  const isFormDisabled = loading || submitted;

  const handleAddNumber = () => {
    if (additionalNumbers.length < 3) setAdditionalNumbers([...additionalNumbers, ""]);
  };

  const handleRemoveNumber = (index) => {
    setAdditionalNumbers(additionalNumbers.filter((_, i) => i !== index));
  };

  const handleAdditionalChange = (index, value) => {
    const updated = [...additionalNumbers];
    updated[index] = value;
    setAdditionalNumbers(updated);
  };

  const handlePay = async () => {
    if (!isValid) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div dir="rtl" className="min-h-[80vh] relative font-body">
      <AmbientBackground />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(150%); } }
        @keyframes pulse-line { 0%,100% { transform: scaleX(0); opacity:0; } 50% { transform: scaleX(1); opacity:1; } }
      `}} />

      <div className="relative z-10 py-12 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[600px] mx-auto"
        >
          {/* Page Title */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-foreground tracking-tight inline-block relative">
              الدفع السريع
              <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-accent rounded-full opacity-50" />
            </h1>
          </div>

          <AnimatedElement delay={100}>
            {/* Glass Card */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 overflow-hidden mb-6 transition-all duration-300 hover:shadow-[0_12px_50px_rgb(0,0,0,0.08)]">
              {/* Specular highlight edge */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              {/* Tabs */}
              <div className="flex border-b border-border/60">
                {[
                  { key: "bill", label: "دفع الفاتورة" },
                  { key: "eezee", label: "إعادة تعبئة eeZee" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-4 text-[15px] font-bold transition-all duration-300 relative ${
                      activeTab === tab.key
                        ? "text-accent bg-accent/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Form Area */}
              <div className="p-8">
                {activeTab === "bill" ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    {/* Pay For Dropdown */}
                    <div className="space-y-1 relative group z-20">
                      <label className="block text-xs font-semibold text-muted-foreground/80 mb-1 transition-colors group-focus-within:text-accent">أود الدفع لـ</label>
                      <button
                        onClick={() => !isFormDisabled && setPayForOpen(!payForOpen)}
                        type="button"
                        disabled={isFormDisabled}
                        className={`w-full bg-transparent py-2 px-0 text-right flex items-center justify-between focus:outline-none transition-all duration-300 border-b ${payForOpen ? 'border-accent text-accent' : 'border-border text-foreground hover:border-foreground/50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${payForOpen ? 'rotate-180 text-accent' : 'text-muted-foreground group-hover:text-foreground'}`} />
                        <span className="font-medium text-[15px]">{payForOptions.find(o => o.value === payFor)?.label}</span>
                      </button>
                      {payForOpen && !isFormDisabled && (
                        <div className="absolute top-[calc(100%+4px)] right-0 left-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                          {payForOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => { setPayFor(option.value); setPayForOpen(false); }}
                              className={`w-full text-right px-4 py-3 text-sm transition-colors duration-200 ${payFor === option.value ? "bg-accent/10 text-accent font-bold" : "text-foreground hover:bg-secondary hover:text-primary"}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1 group">
                      <label className="block text-xs font-semibold text-muted-foreground/80 mb-1 transition-colors group-focus-within:text-accent">
                        رقم الهاتف <span className="text-accent ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isFormDisabled}
                          placeholder="أدخل الرقم: 99XXXXXX"
                          className="w-full bg-transparent py-2.5 px-0 text-right text-[15px] font-medium placeholder:font-normal placeholder-muted-foreground/60 border-b border-border focus:outline-none focus:border-accent focus:ring-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          dir="ltr"
                          style={{ textAlign: 'right' }}
                        />
                        <div className="absolute bottom-0 right-0 h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-focus-within:w-full" />
                        {/* Pulse line indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-cyan/30 origin-left" style={{ animation: 'pulse-line 4s ease-in-out infinite' }} />
                      </div>
                    </div>

                    {/* Additional Numbers */}
                    {additionalNumbers.map((num, index) => (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        key={index}
                        className="space-y-1 group pt-2"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <button
                            type="button"
                            onClick={() => !isFormDisabled && handleRemoveNumber(index)}
                            disabled={isFormDisabled}
                            className="text-[11px] font-semibold text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                          >
                            إلغاء
                          </button>
                          <label className="block text-xs font-semibold text-muted-foreground/80 transition-colors group-focus-within:text-accent">رقم الهاتف {index + 2}</label>
                        </div>
                        <div className="relative">
                          <input
                            type="tel"
                            value={num}
                            onChange={(e) => handleAdditionalChange(index, e.target.value)}
                            disabled={isFormDisabled}
                            placeholder="أدخل الرقم: 99XXXXXX"
                            className="w-full bg-transparent py-2.5 px-0 text-right text-[15px] font-medium placeholder:font-normal placeholder-muted-foreground/60 border-b border-border focus:outline-none focus:border-accent transition-all duration-300 disabled:opacity-50"
                            dir="ltr"
                            style={{ textAlign: 'right' }}
                          />
                          <div className="absolute bottom-0 right-0 h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-focus-within:w-full" />
                        </div>
                      </motion.div>
                    ))}

                    <div className="pt-2 text-center">
                      <p className="text-[13px] text-foreground font-medium">يرجى القبول لعرض الفاتورة</p>
                    </div>
                  </motion.div>
                ) : (
                  <EezeeForm />
                )}
              </div>
            </div>
          </AnimatedElement>

          {/* Add Another Number */}
          {activeTab === "bill" && (
            <AnimatedElement delay={200}>
              <button
                type="button"
                onClick={handleAddNumber}
                disabled={additionalNumbers.length >= 3 || isFormDisabled}
                className="w-full bg-card/60 backdrop-blur-sm hover:bg-card border border-white/30 text-muted-foreground hover:text-foreground rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300 mb-8 group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                <span>أضف رقم آخر</span>
              </button>
            </AnimatedElement>
          )}

          {/* Total & Submit */}
          <AnimatedElement delay={300}>
            <div className="border-t border-border/60 pt-6 space-y-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-foreground font-bold text-xl tracking-tight">0.000 د.ك</span>
                <span className="text-foreground font-bold text-lg">إجمالي</span>
              </div>

              <button
                onClick={handlePay}
                disabled={!isValid || isFormDisabled}
                className={`relative overflow-hidden w-full rounded-xl py-4 flex items-center justify-center gap-3 font-bold text-[15px] transition-all duration-500 shadow-md ${
                  isValid && !isFormDisabled
                    ? "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                }`}
              >
                {isValid && !isFormDisabled && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] pointer-events-none" style={{ animation: 'shimmer 2s infinite' }} />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>جاري المعالجة...</span></>
                  ) : submitted ? (
                    <>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                        <Check className="w-5 h-5" />
                      </motion.div>
                      <span>تم بنجاح</span>
                    </>
                  ) : (
                    "ادفع الآن"
                  )}
                </span>
              </button>
            </div>
          </AnimatedElement>
        </motion.div>
      </div>
    </div>
  );
}