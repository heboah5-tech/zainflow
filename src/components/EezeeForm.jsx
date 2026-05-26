import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, XCircle, Check } from "lucide-react";

const payForOptions = [
  { value: "other", label: "رقم آخر" },
  { value: "self", label: "رقمي" },
  { value: "family", label: "أحد أفراد العائلة" },
];

const amounts = [
  { value: 2, label: "2.000 د.ك", validity: "الصلاحية 7 أيام" },
  { value: 4, label: "4.000 د.ك", validity: "الصلاحية 15 يوم" },
  { value: 6, label: "6.000 د.ك", validity: "الصلاحية 30 يوم" },
  { value: 12, label: "12.000 د.ك", validity: "الصلاحية 90 يوم" },
  { value: 22, label: "22.000 د.ك", validity: "الصلاحية 180 يوم" },
  { value: 30, label: "30.000 د.ك", validity: "الصلاحية 365 يوم" },
];

export default function EezeeForm() {
  const [payFor, setPayFor] = useState("other");
  const [payForOpen, setPayForOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(6);
  const [amountOpen, setAmountOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const validatePhone = (val) => {
    if (val && (val.length < 8 || !/^\d+$/.test(val))) {
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setPhoneNumber(val);
    if (phoneError) validatePhone(val);
  };

  const handlePhoneBlur = () => validatePhone(phoneNumber);
  const selectedAmountObj = amounts.find((a) => a.value === selectedAmount);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Pay For Dropdown */}
      <div className="space-y-1 relative group z-20">
        <label className="block text-xs font-semibold text-muted-foreground/80 mb-1 transition-colors group-focus-within:text-accent">
          أود أن أعيد التعبئة لـ
        </label>
        <button
          onClick={() => setPayForOpen(!payForOpen)}
          type="button"
          className={`w-full bg-transparent py-2 px-0 text-right flex items-center justify-between focus:outline-none transition-all duration-300 border-b ${payForOpen ? "border-accent text-accent" : "border-border text-foreground hover:border-foreground/50"}`}
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${payForOpen ? "rotate-180 text-accent" : "text-muted-foreground"}`} />
          <span className="font-medium text-[15px]">{payForOptions.find((o) => o.value === payFor)?.label}</span>
        </button>
        <AnimatePresence>
          {payForOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-[calc(100%+4px)] right-0 left-0 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 z-30"
            >
              {payForOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setPayFor(option.value); setPayForOpen(false); }}
                  className={`w-full text-right px-4 py-3 text-sm transition-colors duration-200 ${payFor === option.value ? "bg-accent/10 text-accent font-bold" : "text-foreground hover:bg-secondary"}`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
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
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            placeholder="98752224"
            className={`w-full bg-transparent py-2.5 px-0 text-right text-[15px] font-medium placeholder-muted-foreground/60 border-b focus:outline-none transition-all duration-300 ${phoneError ? "border-destructive" : "border-border focus:border-accent"}`}
            dir="ltr"
            style={{ textAlign: "right" }}
          />
          <div className="absolute bottom-0 right-0 h-[2px] w-0 bg-accent transition-all duration-500 ease-out group-focus-within:w-full" />
        </div>
        <AnimatePresence>
          {phoneError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center justify-end gap-2 mt-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
            >
              <span className="text-destructive text-xs font-medium">الرقم الذي قمت بإدخاله غير صحيح</span>
              <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Amount Selector */}
      <div className="space-y-1 relative z-10">
        <label className="block text-xs font-semibold text-muted-foreground/80 mb-1">مبلغ التعبئة</label>
        <button
          onClick={() => setAmountOpen(!amountOpen)}
          type="button"
          className={`w-full bg-transparent py-2 px-0 text-right flex items-center justify-between focus:outline-none transition-all duration-300 border-b ${amountOpen ? "border-accent" : "border-border"}`}
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${amountOpen ? "rotate-180 text-accent" : "text-muted-foreground"}`} />
          <div className="text-right">
            <span className={`font-bold text-[15px] ${amountOpen ? "text-accent" : "text-foreground"}`}>{selectedAmountObj?.label}</span>
            {selectedAmountObj && <span className={`text-xs mr-2 ${amountOpen ? "text-accent/70" : "text-muted-foreground"}`}>{selectedAmountObj.validity}</span>}
          </div>
        </button>
        <AnimatePresence>
          {amountOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border border-border rounded-xl bg-card shadow-lg"
            >
              {amounts.map((amt) => (
                <button
                  key={amt.value}
                  onClick={() => { setSelectedAmount(amt.value); setAmountOpen(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors duration-200 hover:bg-secondary/60 border-b border-border/40 last:border-0 ${selectedAmount === amt.value ? "bg-secondary/40" : ""}`}
                >
                  <span className={`text-xs ${selectedAmount === amt.value ? "text-accent font-semibold" : "text-muted-foreground"}`}>{amt.validity}</span>
                  <div className="flex items-center gap-2">
                    {selectedAmount === amt.value && <Check className="w-4 h-4 text-accent" />}
                    <span className={`font-bold ${selectedAmount === amt.value ? "text-accent" : "text-foreground"}`}>{amt.label}</span>
                  </div>
                </button>
              ))}
              <div className="px-4 py-3 flex items-center justify-between border-t border-border/40">
                <input
                  type="number"
                  placeholder="أدخل المبلغ"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="text-xs text-right bg-transparent focus:outline-none placeholder-muted-foreground/60 w-28 text-foreground"
                  dir="rtl"
                />
                <span className="font-bold text-foreground text-sm">مبلغ آخر</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}