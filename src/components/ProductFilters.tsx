import React, { useState, useEffect } from "react";
import Select, { MultiValue, ActionMeta, components } from "react-select";
import { supabase } from "@/lib/supabase";
import { Check } from "lucide-react";

interface ProductFiltersProps {
  onSkuNamesChange: (skuNames: string[]) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const Option = (props: any) => (
  <components.Option {...props}>
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 border rounded flex items-center justify-center ${
        props.isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
      }`}>
        {props.isSelected && <Check className="w-3 h-3 text-white" />}
      </div>
      <span>{props.label}</span>
    </div>
  </components.Option>
);

// Custom ValueContainer to show only the count
const ValueContainer = ({ children, ...props }: any) => {
  const { getValue, hasValue } = props;
  const selectedCount = getValue().length;
  
  return (
    <components.ValueContainer {...props}>
      {hasValue ? (
        <div>{selectedCount} Selected</div>
      ) : (
        children
      )}
    </components.ValueContainer>
  );
};

const ProductFilters = ({ onSkuNamesChange }: ProductFiltersProps) => {
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [skuNames, setSkuNames] = useState<SelectOption[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<SelectOption[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<SelectOption[]>([]);
  const [selectedSkuNames, setSelectedSkuNames] = useState<SelectOption[]>([]);

  const customStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '32px',
      height: '32px',
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: '32px',
      padding: '0 6px',
    }),
    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    option: (base: any) => ({
      ...base,
      padding: '4px 8px',
    })
  };

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("products").select("category");
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      const uniqueCategories = [...new Set(data.map((item) => item.category))];
      setCategories(uniqueCategories.map((category) => ({ value: category, label: category })));
    };
    fetchCategories();
  }, []);

  // Fetch brands based on selected categories
  useEffect(() => {
    const fetchBrands = async () => {
      if (selectedCategories.length === 0) {
        setBrands([]);
        return;
      }
      const { data, error } = await supabase
        .from("products")
        .select("brand")
        .in("category", selectedCategories.map((c) => c.value));
      if (error) {
        console.error("Error fetching brands:", error);
        return;
      }
      const uniqueBrands = [...new Set(data.map((item) => item.brand))];
      setBrands(uniqueBrands.map((brand) => ({ value: brand, label: brand })));
    };
    fetchBrands();
  }, [selectedCategories]);

  // Fetch SKU names based on selected categories and brands
  useEffect(() => {
    const fetchSkuNames = async () => {
      if (selectedCategories.length === 0) {
        setSkuNames([]);
        return;
      }
      const query = supabase
        .from("products")
        .select()
        .in("category", selectedCategories.map((c) => c.value));
      if (selectedBrands.length > 0) {
        query.in("brand", selectedBrands.map((b) => b.value));
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching SKU names:", error);
        return;
      }

      const uniqueSkuNames = [...new Set(data.map((item) => item.sku_name))];
      setSkuNames(uniqueSkuNames.map((skuName) => ({ value: skuName, label: skuName })));
    };
    fetchSkuNames();
  }, [selectedCategories, selectedBrands]);

  const handleCategoryChange = (newValue: MultiValue<SelectOption>, _: ActionMeta<SelectOption>) => {
    setSelectedCategories(newValue as SelectOption[]);
  };

  const handleBrandChange = (newValue: MultiValue<SelectOption>, _: ActionMeta<SelectOption>) => {
    setSelectedBrands(newValue as SelectOption[]);
  };

  const handleSkuNameChange = (newValue: MultiValue<SelectOption>, _: ActionMeta<SelectOption>) => {
    const newSelectedSkuNames = newValue as SelectOption[];
    console.log("New Selected SKU names: ", newValue)
    setSelectedSkuNames(newSelectedSkuNames);
    onSkuNamesChange(newSelectedSkuNames.map((option) => option.value));
  };

  return (
    <div className="flex gap-2">
      <div className="w-[180px]">
        <Select
          id="category"
          isMulti
          options={categories}
          value={selectedCategories}
          onChange={handleCategoryChange}
          styles={customStyles}
          components={{ Option, ValueContainer }}
          placeholder="Category..."
          noOptionsMessage={() => "No categories"}
        />
      </div>
      <div className="w-[180px]">
        <Select
          id="brand"
          isMulti
          options={brands}
          value={selectedBrands}
          onChange={handleBrandChange}
          isDisabled={selectedCategories.length === 0}
          styles={customStyles}
          components={{ Option, ValueContainer }}
          placeholder="Brand..."
          noOptionsMessage={() => "Select category"}
        />
      </div>
      <div className="w-[180px]">
        <Select
          id="skuName"
          isMulti
          options={skuNames}
          value={selectedSkuNames}
          onChange={handleSkuNameChange}
          isDisabled={selectedCategories.length === 0}
          styles={customStyles}
          components={{ Option, ValueContainer }}
          placeholder="Product..."
          noOptionsMessage={() => "Select category"}
        />
      </div>
    </div>
  );
};

export default ProductFilters;