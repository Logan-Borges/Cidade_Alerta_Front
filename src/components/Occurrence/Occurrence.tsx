import React, { useState } from 'react';

const Occurrence = ({ loading = false}: { loading?: boolean }) => {
    let image = false;
    let description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    return (
        <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-card card-hover cursor-pointer">
          {/* Image or Gradient Header */}
          <div className={`relative h-36 flex items-center justify-center overflow-hidden`}>
            {image ? (
              <img
                // src={incident.image_url}
                // alt={incident.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center`}>
                {/* <CategoryIcon category={incident.category} className={`w-8 h-8 ${cat.text}`} /> */}
              </div>
            )}
            {/* Urgency pip */}
            <div className="absolute top-3 right-3">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pip-pulse`} />
                <span className={`text-xs font-medium`}>Urgencia</span>
              </div>
            </div>
            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm`}>
                {/* <CategoryIcon category={incident.category} className={`w-3 h-3 ${cat.text}`} /> */}
                <span className={`text-xs font-medium`}>Categoria</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 bg-[#fff]" id='occurence-content'>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 flex-1">
                Titulo
              </h3>
              {/* <ArrowUpRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
            </div>

            {description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </article>
    )
}

export default Occurrence;