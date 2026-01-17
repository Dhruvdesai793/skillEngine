export default function Hero() {
    return (
        <header className="w-full flex justify-between items-end border-b border-white/10 pb-8 mb-12">
            <div>
                <h1 className="text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 animate-kinetic">
                    SKILL<br />ENGINE
                </h1>
            </div>
            <div className="text-right">
                <p className="text-lando text-xl font-bold uppercase tracking-widest">System Operational</p>
                <p className="text-white/50">v2.1.0.Refactor</p>
            </div>
        </header>
    );
}
