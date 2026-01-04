import * as React from 'react';
import { useWatch } from 'react-hook-form';
import { useDebouncedCallback } from '@tanstack/react-pacer';
import { useGeocodeQuery } from '../hooks/geocoding/useGeocodeQuery';
import { SearchItem } from '../types/search-item';
import { useSearch } from './useSearch';

type UseSearchResultsOptions = {
  control: ReturnType<typeof useSearch>['control'];
  recentSearches?: SearchItem[];
  debounceMs?: number;
};

export function useSearchResults({
  control,
  recentSearches = [],
  debounceMs = 400,
}: UseSearchResultsOptions) {
  const searchValue = useWatch({ control, name: 'search' }) ?? '';
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
  }, { wait: debounceMs });
  const { data: searchItems } = useGeocodeQuery(debouncedSearch, { autocomplete: true });
  const hasSearchValue = searchValue.trim().length > 0;
  const listItems: SearchItem[] = hasSearchValue ? searchItems ?? [] : recentSearches;

  React.useEffect(() => {
    const trimmed = searchValue.trim().toLocaleLowerCase();
    if (!trimmed) {
      setDebouncedSearch('');
      return;
    }
    debouncedSetSearch(trimmed);
  }, [searchValue, debouncedSetSearch]);

  return { hasSearchValue, listItems };
}
