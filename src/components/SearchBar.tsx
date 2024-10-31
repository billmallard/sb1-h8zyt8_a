import React, { useState, useCallback } from 'react';
import { Search, X, Layout } from 'lucide-react';
import useStore from '../store/diaryStore';
import type { DiaryEntry } from '../types/diary';

interface SearchBarProps {
  onResultsChange: (entries: DiaryEntry[]) => void;
}

export function SearchBar({ onResultsChange }: SearchBarProps) {
  const { entries, templates } = useStore();
  const [query, setQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [filters, setFilters] = useState({
    isImportant: false,
    needsReview: false,
    isMajorEvent: false
  });

  const handleSearch = useCallback(() => {
    const results = entries.filter(entry => {
      const matchesQuery = !query || 
        entry.sections.some(section => 
          section.content.toLowerCase().includes(query.toLowerCase()) ||
          section.heading.toLowerCase().includes(query.toLowerCase())
        );

      const matchesTemplate = !selectedTemplate || entry.templateId === selectedTemplate;

      const matchesFilters = 
        (!filters.isImportant || entry.flags.isImportant) &&
        (!filters.needsReview || entry.flags.needsReview) &&
        (!filters.isMajorEvent || entry.flags.isMajorEvent);

      return matchesQuery && matchesTemplate && matchesFilters;
    });

    onResultsChange(results);
  }, [query, selectedTemplate, filters, entries, onResultsChange]);

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filter]: !prev[filter] };
      return newFilters;
    });
  };

  React.useEffect(() => {
    handleSearch();
  }, [query, selectedTemplate, filters, handleSearch]);

  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="relative w-64">
          <select
            value={selectedTemplate}
            onChange={e => setSelectedTemplate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 appearance-none"
          >
            <option value="">All Templates</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <Layout className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => toggleFilter('isImportant')}
          className={`px-3 py-1 text-sm rounded-full ${
            filters.isImportant
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Important
        </button>
        <button
          onClick={() => toggleFilter('needsReview')}
          className={`px-3 py-1 text-sm rounded-full ${
            filters.needsReview
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Needs Review
        </button>
        <button
          onClick={() => toggleFilter('isMajorEvent')}
          className={`px-3 py-1 text-sm rounded-full ${
            filters.isMajorEvent
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Major Event
        </button>
      </div>
    </div>
  );
}