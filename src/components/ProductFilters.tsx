import { supabase } from "@/lib/supabase";
import React, { useState, useEffect } from 'react';
  
import Select from "react-select";

const ProductFilters = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [skuNames, setSkuNames] = useState([]);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSkuNames, setSelectedSkuNames] = useState([]);

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

  return (
    <div>
      <div>
        <label htmlFor="category">Category:</label>
        <Select
          id="category"
          isMulti
          options={categories}
          value={selectedCategories}
          onChange={setSelectedCategories}
        />
      </div>
      <div>
        <label htmlFor="brand">Brand:</label>
        <Select
          id="brand"
          isMulti
          options={brands}
          value={selectedBrands}
          onChange={setSelectedBrands}
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
          onChange={setSelectedSkuNames}
          isDisabled={selectedCategories.length === 0}
        />
      </div>
    </div>
  );
};

export default ProductFilters;