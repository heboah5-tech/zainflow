import { Link } from "react-router-dom";
import { SlidersHorizontal, CreditCard, BarChart3, FileText, ArrowLeft } from "lucide-react";
import AnimatedElement from "@/components/AnimatedElement";
import AmbientBackground from "@/components/AmbientBackground";

const quickActions = [
  { icon: CreditCard, label: "الدفع السريع", href: "/", color: "bg-accent/10 text-accent" },
  { icon: BarChart3, label: "استهلاكي", href: "#", color: "bg-cyan/10 text-cyan" },
  { icon: FileText, label: "الفواتير", href: "#", color: "bg-primary/10 text-foreground" },
  { icon: SlidersHorizontal, label: "إدارة الحساب", href: "#", color: "bg-secondary text-foreground" },
];

export default function MyZain() {
  return (
    <div dir="rtl" className="min-h-[80vh] relative font-body">
      <AmbientBackground />
      <div className="relative z-10 py-12 px-4 sm:px-6">
        <div className="max-w-[600px] mx-auto">
          <AnimatedElement>
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-foreground tracking-tight inline-block relative">
                My Zain
                <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-accent rounded-full opacity-50" />
              </h1>
              <p className="text-muted-foreground text-sm mt-4">إدارة حسابك وخدماتك</p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <AnimatedElement key={action.label} delay={i * 80}>
                <Link
                  to={action.href}
                  className="bg-card/80 backdrop-blur-xl border border-white/40 rounded-2xl p-6 flex flex-col items-center gap-3 text-center hover:shadow-[0_12px_50px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{action.label}</span>
                </Link>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}