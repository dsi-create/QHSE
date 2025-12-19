import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  debounceMs?: number;
}

export const SearchBar = ({ 
  placeholder = "Rechercher...", 
  onSearch,
  className,
  debounceMs = 300 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
    if (onSearch) {
      const timeoutId = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
      return () => clearTimeout(timeoutId);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

export const FilterBar = ({
  filters,
  selectedFilter,
  onFilterChange,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  className
}: FilterBarProps) => {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 mb-4", className)}>
      {filters.length > 0 && (
        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      )}
      {onSearchChange && (
        <SearchBar
          placeholder={searchPlaceholder}
          onSearch={onSearchChange}
          className="flex-1"
        />
      )}
    </div>
  );
};

// Hook utilitaire pour filtrer et rechercher des données
export function useFilterAndSearch<T>(
  data: T[],
  searchKeys: (keyof T)[],
  filterFn?: (item: T, filter: string) => boolean
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredData = useMemo(() => {
    let result = [...data];

    // Appliquer le filtre
    if (filterFn && filter !== "all") {
      result = result.filter((item) => filterFn(item, filter));
    }

    // Appliquer la recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    return result;
  }, [data, searchQuery, filter, filterFn, searchKeys]);

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter
  };
}


