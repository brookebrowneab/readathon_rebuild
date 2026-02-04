import React, { useMemo, useState } from 'react';
import Input from '../ui/input';
import Button from '../ui/button';

export interface Book {
  id: string;
  title: string;
}

interface BookSelectorProps {
  value: string;
  onChange: (value: string) => void;
  books?: Book[];
}

export default function BookSelector({ value, onChange, books = [] }: BookSelectorProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return books.filter((book) => book.title.toLowerCase().includes(q));
  }, [books, query]);

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for a book"
      />
      <div className="space-y-2">
        {filtered.map((book) => (
          <button
            key={book.id}
            type="button"
            className={`w-full rounded-md border px-3 py-2 text-left transition-all ${
              value === book.title
                ? 'border-brand-navy bg-brand-navy/10'
                : 'border-border hover:border-brand-navy'
            }`}
            onClick={() => onChange(book.title)}
          >
            {book.title}
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No matches yet.</p>
        )}
      </div>
      <Button type="button" variant="outline" onClick={() => onChange(query || value)}>
        Add New Book
      </Button>
    </div>
  );
}
