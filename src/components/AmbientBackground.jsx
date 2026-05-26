export default function AmbientBackground() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-20px) scale(1.02) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
      `}} />
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'hsl(324 100% 47% / 0.06)', animation: 'float-slow 12s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'hsl(186 100% 50% / 0.04)', animation: 'float-fast 9s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] rounded-full blur-[100px]"
          style={{ background: 'hsl(324 100% 47% / 0.03)', animation: 'pulse-glow 8s ease-in-out infinite' }}
        />
      </div>
    </>
  );
}