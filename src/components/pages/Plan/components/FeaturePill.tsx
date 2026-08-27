export const FeaturePill = ({ feature }: { feature: string }) => (
  <div className="flex items-center gap-3 bg-[#f8f6ff] border border-[#e7e2ee] px-6 py-3 rounded-2xl">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path
        d="M20 6L9 17l-5-5"
        stroke="#7C5CFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-[#403a4b]">{feature}</span>
  </div>
);
