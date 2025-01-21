import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface Product {
  sku_name: string;
  brand: string;
  category: string;
}

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    brands: string[];
    categories: string[];
    skuNames: string[];
  }) => void;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [openBrands, setOpenBrands] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openSkus, setOpenSkus] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("sku_name, brand, category");
      
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }
      
      setProducts(data || []); // Ensure we always set an array, even if empty
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    onFiltersChange({
      brands: selectedBrands,
      categories: selectedCategories,
      skuNames: selectedSkus,
    });
  }, [selectedBrands, selectedCategories, selectedSkus, onFiltersChange]);

  // Ensure we have products before trying to get unique values
  const uniqueBrands = products ? Array.from(new Set(products.map((p) => p.brand))).filter(Boolean) : [];
  
  const filteredCategories = products ? Array.from(
    new Set(
      products
        .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
        .map((p) => p.category)
    )
  ).filter(Boolean) : [];

  const filteredSkus = products ? products
    .filter(
      (p) =>
        (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
        (selectedCategories.length === 0 || selectedCategories.includes(p.category))
    )
    .map((p) => p.sku_name) : [];

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      {/* Brands Filter */}
      <Popover open={openBrands} onOpenChange={setOpenBrands}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openBrands}
            className="justify-between"
          >
            {selectedBrands.length === 0
              ? "Select brands"
              : `${selectedBrands.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search brands..." />
            <CommandEmpty>No brand found.</CommandEmpty>
            <CommandGroup>
              {uniqueBrands.map((brand) => (
                <CommandItem
                  key={brand}
                  onSelect={() => {
                    setSelectedBrands((prev) =>
                      prev.includes(brand)
                        ? prev.filter((b) => b !== brand)
                        : [...prev, brand]
                    );
                    setOpenBrands(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBrands.includes(brand) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {brand}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Categories Filter */}
      <Popover open={openCategories} onOpenChange={setOpenCategories}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCategories}
            className="justify-between"
          >
            {selectedCategories.length === 0
              ? "Select categories"
              : `${selectedCategories.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {filteredCategories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    );
                    setOpenCategories(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCategories.includes(category) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* SKUs Filter */}
      <Popover open={openSkus} onOpenChange={setOpenSkus}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openSkus}
            className="justify-between"
          >
            {selectedSkus.length === 0
              ? "Select SKUs"
              : `${selectedSkus.length} selected`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search SKUs..." />
            <CommandEmpty>No SKU found.</CommandEmpty>
            <CommandGroup>
              {filteredSkus.map((sku) => (
                <CommandItem
                  key={sku}
                  onSelect={() => {
                    setSelectedSkus((prev) =>
                      prev.includes(sku)
                        ? prev.filter((s) => s !== sku)
                        : [...prev, sku]
                    );
                    setOpenSkus(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSkus.includes(sku) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {sku}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Filters Display */}
      <div className="flex flex-wrap gap-2">
        {selectedBrands.map((brand) => (
          <Badge
            key={brand}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setSelectedBrands((prev) => prev.filter((b) => b !== brand))}
          >
            {brand} ×
          </Badge>
        ))}
        {selectedCategories.map((category) => (
          <Badge
            key={category}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setSelectedCategories((prev) => prev.filter((c) => c !== category))}
          >
            {category} ×
          </Badge>
        ))}
        {selectedSkus.map((sku) => (
          <Badge
            key={sku}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setSelectedSkus((prev) => prev.filter((s) => s !== sku))}
          >
            {sku} ×
          </Badge>
        ))}
      </div>
    </div>
  );
}