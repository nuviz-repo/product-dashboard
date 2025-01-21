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
import { supabase } from "@/lib/supabase";
import { Badge } from "./ui/badge";

interface Product {
  id: string;
  sku_name: string;
  brand: string;
  category: string;
}

export function ProductFilters() {
  const [open, setOpen] = useState({
    brand: false,
    category: false,
    sku: false,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, sku_name, brand, category");

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique values and filter based on selections
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));

  const filteredCategories = Array.from(
    new Set(
      products
        .filter((p) => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
        .map((p) => p.category)
    )
  );

  const filteredSkus = Array.from(
    new Set(
      products
        .filter(
          (p) =>
            (selectedBrands.length === 0 || selectedBrands.includes(p.brand)) &&
            (selectedCategories.length === 0 || selectedCategories.includes(p.category))
        )
        .map((p) => p.sku_name)
    )
  );

  if (loading) {
    return <div>Loading filters...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4 bg-white/90 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Product Filters</h2>
      
      {/* Brands Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Brands</label>
        <Popover open={open.brand} onOpenChange={(o) => setOpen({ ...open, brand: o })}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open.brand}
              className="w-full justify-between"
            >
              {selectedBrands.length > 0
                ? `${selectedBrands.length} selected`
                : "Select brands..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
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
        {selectedBrands.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedBrands.map((brand) => (
              <Badge
                key={brand}
                variant="secondary"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedBrands((prev) => prev.filter((b) => b !== brand))
                }
              >
                {brand} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Categories Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Categories</label>
        <Popover
          open={open.category}
          onOpenChange={(o) => setOpen({ ...open, category: o })}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open.category}
              className="w-full justify-between"
            >
              {selectedCategories.length > 0
                ? `${selectedCategories.length} selected`
                : "Select categories..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
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
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategories.includes(category)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedCategories((prev) =>
                    prev.filter((c) => c !== category)
                  )
                }
              >
                {category} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* SKUs Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">SKUs</label>
        <Popover open={open.sku} onOpenChange={(o) => setOpen({ ...open, sku: o })}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open.sku}
              className="w-full justify-between"
            >
              {selectedSkus.length > 0
                ? `${selectedSkus.length} selected`
                : "Select SKUs..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
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
        {selectedSkus.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSkus.map((sku) => (
              <Badge
                key={sku}
                variant="secondary"
                className="cursor-pointer"
                onClick={() =>
                  setSelectedSkus((prev) => prev.filter((s) => s !== sku))
                }
              >
                {sku} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}