interface Props {
  mediums: string[];
  series: string[];
  selectedMedium: string;
  selectedSeries: string;
  sort: SortKey;
  onMedium: (v: string) => void;
  onSeries: (v: string) => void;
  onSort: (v: SortKey) => void;
  total: number;
}

export type SortKey = 'curated' | 'price-asc' | 'price-desc' | 'newest';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'curated', label: 'Curated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
];

export function FilterBar({
  mediums,
  series,
  selectedMedium,
  selectedSeries,
  sort,
  onMedium,
  onSeries,
  onSort,
  total,
}: Props) {
  return (
    <div className="sticky top-16 md:top-20 z-30 bg-paper/85 backdrop-blur-md rule-b">
      <div className="mx-auto max-w-editorial px-6 md:px-10 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <FilterGroup
          label="Series"
          value={selectedSeries}
          onChange={onSeries}
          options={[{ value: '', label: 'All' }, ...series.map((s) => ({ value: s, label: s }))]}
        />
        <FilterGroup
          label="Medium"
          value={selectedMedium}
          onChange={onMedium}
          options={[{ value: '', label: 'All' }, ...mediums.map((m) => ({ value: m, label: m }))]}
        />
        <div className="ml-auto flex items-center gap-6">
          <FilterGroup
            label="Sort"
            value={sort}
            onChange={(v) => onSort(v as SortKey)}
            options={sortOptions}
          />
          <p className="label hidden sm:block">{total} {total === 1 ? 'work' : 'works'}</p>
        </div>
      </div>
    </div>
  );
}

interface FGProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

function FilterGroup({ label, value, options, onChange }: FGProps) {
  return (
    <label className="flex items-center gap-3">
      <span className="label">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent font-mono uppercase tracking-widewide text-[11px] text-ink
                     border-0 border-b border-ink/30 pl-1 pr-6 py-1 focus:outline-none focus:border-ink cursor-pointer"
          style={{ borderBottomWidth: '0.5px' }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="font-mono">
              {o.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none">▾</span>
      </span>
    </label>
  );
}
