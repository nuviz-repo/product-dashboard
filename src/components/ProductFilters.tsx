import { supabase } from "@/lib/supabase";
import React, { useState, useEffect } from 'react';
import Select, { MultiValue, ActionMeta } from "react-select";

interface ProductFiltersProps {
  onSkuNamesChange: (skuNames: string[]) => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const ProductFilters = ({ onSkuNamesChange }: ProductFiltersProps) => {
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [skuNames, setSkuNames] = useState<SelectOption[]>([]);
  
  const [selectedCategories, setSelectedCategories] = useState<SelectOption[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<SelectOption[]>([]);
  const [selectedSkuNames, setSelectedSkuNames] = useState<SelectOption[]>([]);

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("products").select("category");

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories.map(category => ({ value: category, label: category })));
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
        .in("category", selectedCategories.map(c => c.value));

      if (error) {
        console.error("Error fetching brands:", error);
        return;
      }

      const uniqueBrands = [...new Set(data.map(item => item.brand))];
      setBrands(uniqueBrands.map(brand => ({ value: brand, label: brand })));
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
        .select("sku_name")
        .in("category", selectedCategories.map(c => c.value));

      if (selectedBrands.length > 0) {
        query.in("brand", selectedBrands.map(b => b.value));
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching SKU names:", error);
        return;
      }

      const uniqueSkuNames = [...new Set(data.map(item => item.sku_name))];
      setSkuNames(uniqueSkuNames.map(skuName => ({ value: skuName, label: skuName })));
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
    setSelectedSkuNames(newSelectedSkuNames);
    onSkuNamesChange(newSelectedSkuNames.map(option => option.value));
  };

  return (
    <div>
      <div>
        <label htmlFor="category">Category:</label>
        <Select
          id="category"
          isMulti
          options={categories}
          value={selectedCategories}
          onChange={handleCategoryChange}
        />
      </div>
      <div>
        <label htmlFor="brand">Brand:</label>
        <Select
          id="brand"
          isMulti
          options={brands}
          value={selectedBrands}
          onChange={handleBrandChange}
          isDisabled={selectedCategories.length === 0}
        />
      </div>
      <div>
        <label htmlFor="skuName">SKU Name:</label>
        <Select
          id="skuName"
          isMulti
          options={skuNames}
          value={selectedSkuNames}
          onChange={handleSkuNameChange}
          isDisabled={selectedCategories.length === 0}
        />
      </div>
    </div>
  );
};

export default ProductFilters;