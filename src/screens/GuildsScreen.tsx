import React, { useState } from 'react';
import { GUILDS } from '../data/mockData';
import { GuildRegion, Language, Product, ScreenType } from '../types';
import { getTranslations } from '../services/localizationService';

interface GuildsScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
  language?: Language;
}

export const GuildsScreen: React.FC<GuildsScreenProps> = ({
  onNavigate: _onNavigate,
  onSelectProduct: _onSelectProduct,
  onShowToast,
  language = 'en'
}) => {
  const t = getTranslations(language);
  const [selectedZone, setSelectedZone] = useState<'all' | 'west' | 'north' | 'south' | 'east'>('all');
  const [selectedGuild, setSelectedGuild] = useState<GuildRegion | null>(null);

  const filteredGuilds = GUILDS.filter((g) => {
    if (selectedZone === 'all') return true;
    return g.region === selectedZone;
  });

  const handleGuildClick = (guild: GuildRegion) => {
    setSelectedGuild(guild);
    onShowToast(`${t.region}: ${guild.state} - ${guild.craftName}`);
  };

  const zones = [
    { id: 'all', label: t.allRegions },
    { id: 'west', label: t.westZone },
    { id: 'north', label: t.northZone },
    { id: 'south', label: t.southZone },
    { id: 'east', label: t.eastZone }
  ];

  return (
    <div className="flex-1 flex flex-col relative w-full pt-28 pb-24 px-4 max-w-md mx-auto space-y-5 bg-surface">
      {/* Header Title */}
      <div>
        <div className="flex items-center gap-1.5 text-secondary mb-1">
          <span className="material-symbols-outlined text-[16px]">public</span>
          <span className="text-xs font-bold uppercase tracking-wider">{t.heritageDiscovery}</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-primary leading-tight">
          {t.exploreCraftGuilds}
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          {t.guildSubtext}
        </p>
      </div>

      {/* Regional Zone Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
              selectedZone === zone.id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            {zone.label}
          </button>
        ))}
      </div>

      {/* Guild Card List */}
      <div className="space-y-4">
        {filteredGuilds.map((guild) => (
          <div
            key={guild.id}
            onClick={() => handleGuildClick(guild)}
            className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={guild.image}
                alt={guild.craftName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent"></div>

              {/* State & Zone Tag */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary text-[10px] font-bold shadow-sm">
                  {guild.state}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold shadow-sm">
                  {guild.zoneLabel}
                </span>
              </div>

              {/* Verified GI Tag */}
              <div className="absolute bottom-3 left-3 right-3 text-on-primary">
                <div className="flex items-center gap-1 text-secondary text-[11px] font-semibold mb-0.5">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>{guild.giTag}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-surface-bright leading-snug">
                  {guild.craftName}
                </h3>
                <p className="text-xs text-primary-fixed-dim">{guild.location}</p>
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {guild.history}
              </p>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/20">
                <span className="text-secondary font-bold">
                  {guild.artisanCount} {t.verifiedGuilds}
                </span>
                <span className="text-on-surface-variant">
                  {guild.productCount} {t.craftsCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
