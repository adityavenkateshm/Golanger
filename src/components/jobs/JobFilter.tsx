'use client'

import { JobFilter } from '@/types'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'

interface JobFilterProps {
  onFilterChange: (filter: JobFilter) => void
  currentFilter: JobFilter
}

export function JobFilters({ onFilterChange, currentFilter }: JobFilterProps) {
  const debouncedFilterChange = useCallback(
    debounce((filter: JobFilter) => {
      onFilterChange(filter)
    }, 300),
    [onFilterChange]
  )

  return (
    <div className="space-y-4 p-4 bg-white/5 rounded-lg">
      <div>
        <input
          type="text"
          placeholder="Search jobs..."
          className="w-full p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          defaultValue={currentFilter.search}
          onChange={(e) =>
            debouncedFilterChange({ ...currentFilter, search: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          className="p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          value={currentFilter.location_type || ''}
          onChange={(e) =>
            onFilterChange({
              ...currentFilter,
              location_type: e.target.value as JobFilter['location_type']
            })
          }
        >
          <option value="">Any Location Type</option>
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select
          className="p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          value={currentFilter.role_type || ''}
          onChange={(e) =>
            onFilterChange({
              ...currentFilter,
              role_type: e.target.value as JobFilter['role_type']
            })
          }
        >
          <option value="">Any Role Type</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>

        <select
          className="p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          value={currentFilter.experience_level || ''}
          onChange={(e) =>
            onFilterChange({
              ...currentFilter,
              experience_level: e.target.value as JobFilter['experience_level']
            })
          }
        >
          <option value="">Any Experience Level</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="lead">Lead Level</option>
        </select>

        <input
          type="text"
          placeholder="Location..."
          className="p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          defaultValue={currentFilter.location}
          onChange={(e) =>
            debouncedFilterChange({ ...currentFilter, location: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Min Salary"
          className="p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          value={currentFilter.salary_min || ''}
          onChange={(e) =>
            onFilterChange({
              ...currentFilter,
              salary_min: e.target.value ? Number(e.target.value) : undefined
            })
          }
        />
        <input
          type="number"
          placeholder="Max Salary"
          className="p-2 bg-white/5 rounded border border-white/10 focus:border-white/20 outline-none"
          value={currentFilter.salary_max || ''}
          onChange={(e) =>
            onFilterChange({
              ...currentFilter,
              salary_max: e.target.value ? Number(e.target.value) : undefined
            })
          }
        />
      </div>
    </div>
  )
}