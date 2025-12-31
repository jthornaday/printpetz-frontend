import React from "react";
import { Search, LayoutGrid, User, Settings, Plus, Image as ImageIcon } from "lucide-react";

export const Showcase = () => {
  return (
    <section className="py-20 px-6 flex justify-center overflow-hidden">
      <div className="relative w-full max-w-6xl">
        {/* Glow effect behind the interface */}
        <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 to-blue-600/30 rounded-[2.5rem] blur-2xl opacity-50" />

        {/* Browser/App Window Container */}
        <div className="relative bg-[#0F1016] border border-white/10 rounded-2xl shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9]">
          {/* Window Header */}
          <div className="h-10 bg-[#1A1B23] border-b border-white/5 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="ml-4 flex-1 flex justify-center">
              <div className="bg-[#0F1016] px-4 py-1 rounded-md text-[10px] text-gray-500 flex items-center gap-2 border border-white/5">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                printpetz.ai/create
              </div>
            </div>
          </div>

          {/* App Interface Mockup */}
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-16 md:w-64 bg-[#13141C] border-r border-white/5 flex flex-col p-4 gap-6 hidden md:flex">
              <div className="flex items-center gap-3 text-violet-400 font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <ImageIcon size={18} />
                </div>
                <span>Decat</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-violet-500/10 text-violet-400 text-sm font-medium">
                  <LayoutGrid size={18} />
                  Dashboard
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 text-sm font-medium transition-colors">
                  <User size={18} />
                  My Pets
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-white/5 text-sm font-medium transition-colors">
                  <Settings size={18} />
                  Settings
                </div>
              </div>

              <div className="mt-auto">
                <div className="p-4 rounded-xl bg-gradient-to-br from-violet-900/50 to-purple-900/50 border border-white/5">
                  <div className="text-xs font-semibold text-white mb-1">Pro Plan</div>
                  <div className="text-[10px] text-gray-400 mb-3">250 credits left</div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-violet-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 bg-[#0F1016] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white">Recent Generations</h2>
                  <p className="text-sm text-gray-400">Your latest AI masterpieces</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors">
                  <Plus size={16} />
                  New Generation
                </button>
              </div>

              {/* Grid of "Images" */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-[#1A1B23] border border-white/5 overflow-hidden group relative"
                  >
                    {/* Placeholder Gradient for Image */}
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        i % 3 === 0
                          ? "from-orange-400/20 to-pink-500/20"
                          : i % 3 === 1
                          ? "from-blue-400/20 to-violet-500/20"
                          : "from-green-400/20 to-emerald-500/20"
                      } group-hover:scale-110 transition-transform duration-500`}
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 cursor-pointer">
                        <Search size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating "Model" Card Mockup */}
          <div className="absolute bottom-10 right-10 w-64 bg-[#1A1B23]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl hidden md:block animate-bounce-slow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-300">Model</span>
              <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                v2.1
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded bg-blue-500/20" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-white">Super Hero</div>
                  <div className="text-[10px] text-gray-500">Cinematic Style</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded bg-orange-500/20" />
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-300">Royal Portrait</div>
                  <div className="text-[10px] text-gray-500">Oil Painting</div>
                </div>
              </div>
            </div>
            <button className="w-full mt-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-lg transition-colors">
              Generate 4 Variations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
