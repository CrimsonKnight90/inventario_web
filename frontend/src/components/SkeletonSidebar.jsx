// ============================================================
// Archivo: frontend/src/components/SkeletonSidebar.jsx
// Descripción: Placeholder visual (skeleton) para el Sidebar mientras se cargan las secciones.
// Autor: CrimsonKnight90
// ============================================================

import React from "react";

export default function SkeletonSidebar({sectionCount = 4, itemsPerSection = 3}) {
    const sections = Array.from({length: sectionCount});
    const items = Array.from({length: itemsPerSection});

    return (
        <aside
            aria-hidden="true"
            className="fixed left-0 w-64 z-30"
            style={{
                top: "var(--topbar-height)",
                height: "calc(100vh - var(--topbar-height))",
                backgroundColor: "rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
            }}
        >

            <div className="px-4 py-3 border-b border-white/5">
                <div className="h-5 w-32 bg-white/20 rounded animate-pulse"/>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-4 overflow-hidden">
                {sections.map((_, si) => (
                    <div key={si} className="space-y-2">
                        <div className="h-3 w-28 bg-white/10 rounded animate-pulse"/>
                        <div className="space-y-2 pt-1">
                            {items.map((__, ii) => (
                                <div key={ii} className="h-3 w-full bg-white/6 rounded animate-pulse"/>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-3 border-t border-white/5">
                <div className="h-8 w-full bg-white/10 rounded animate-pulse"/>
            </div>
        </aside>
    );
}
