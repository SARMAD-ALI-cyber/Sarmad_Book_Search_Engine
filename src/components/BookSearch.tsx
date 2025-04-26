import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  X,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "./ModeToggle";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import BookCard from "./BookCard";
import { cn } from "@/lib/utils";

// API URL - Change this to your FastAPI backend URL
const API_URL = "http://localhost:8000";

type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  published: boolean;
};

type Filters = {
  category: string;
  author: string;
  published: string;
};

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    category: "",
    author: "",
    published: "",
  });
  const [openFilters, setOpenFilters] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    // Load filters when component mounts
    loadFilters();
    performSearch();

    // Handle clicks outside suggestions box
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadFilters = async () => {
    try {
      const response = await fetch(`${API_URL}/filters/`);
      const data = await response.json();
      setCategories(data.categories);
      setAuthors(data.authors);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load filters. Please try again.",
      });
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    if (inputValue.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/suggest/?q=${encodeURIComponent(inputValue)}`
      );
      const data = await response.json();

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    performSearch();
  };

  const performSearch = async () => {
    setLoading(true);

    // Build query string
    const queryParams = new URLSearchParams();
    if (query) queryParams.append("q", query);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.author) queryParams.append("author", filters.author);
    if (filters.published) queryParams.append("published", filters.published);

    try {
      const response = await fetch(
        `${API_URL}/search/?${queryParams.toString()}`
      );
      const data = await response.json();

      if (data.response && data.response.docs) {
        setBooks(data.response.docs);
      } else {
        setBooks([]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search failed",
        description: "An error occurred while searching. Please try again.",
      });
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    performSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      performSearch();
    }
  };

  const applyFilters = () => {
    performSearch();
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      author: "",
      published: "",
    });
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Categories</h3>
        <RadioGroup
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="category-all" />
            <Label htmlFor="category-all">All</Label>
          </div>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={`category-${category}`} />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Authors</h3>
        <RadioGroup
          value={filters.author}
          onValueChange={(value) => setFilters({ ...filters, author: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="author-all" />
            <Label htmlFor="author-all">All</Label>
          </div>
          {authors.map((author) => (
            <div key={author} className="flex items-center space-x-2">
              <RadioGroupItem value={author} id={`author-${author}`} />
              <Label htmlFor={`author-${author}`}>{author}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Status</h3>
        <RadioGroup
          value={filters.published}
          onValueChange={(value) =>
            setFilters({ ...filters, published: value })
          }
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="status-all" />
            <Label htmlFor="status-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="status-published" />
            <Label htmlFor="status-published">Published</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="status-unpublished" />
            <Label htmlFor="status-unpublished">Unpublished</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        onClick={applyFilters}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        Apply Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Sarmad's Book Search Engine
            </h1>
          </div>
          <ModeToggle />
        </div>
      </header>

      <div className="mb-8 relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Search for books..."
                className="pl-10 pr-4"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-card shadow-md overflow-hidden"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button onClick={handleSearch}>Search</Button>

          {isDesktop ? (
            <Button
              variant="outline"
              onClick={() => setOpenFilters(!openFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {openFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Show applied filters as badges */}
        {(filters.category || filters.author || filters.published) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filters.category}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({ ...filters, category: "" })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.author && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Author: {filters.author}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({ ...filters, author: "" })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.published && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.published === "true" ? "Published" : "Unpublished"}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => setFilters({ ...filters, published: "" })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {(filters.category || filters.author || filters.published) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop filter panel */}
        {isDesktop && openFilters && (
          <aside className="w-64 shrink-0">
            <Card>
              <CardContent className="p-6">
                <FilterPanel />
              </CardContent>
            </Card>
          </aside>
        )}

        {/* Main content area */}
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Searching for books...</p>
              </div>
            </div>
          ) : (
            <>
              {books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Loader2 className="h-16 w-16 text-muted mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No books found</h3>
                  <p className="text-muted-foreground max-w-md">
                    We couldn't find any books matching your search criteria.
                    Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
