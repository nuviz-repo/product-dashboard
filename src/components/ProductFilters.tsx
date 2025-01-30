import React, { useState, useEffect } from "react";
import Select, { MultiValue, ActionMeta, components } from "react-select";
import { Check, X } from "lucide-react";
import { getCategories, getBrandsByCategories, getSkuNamesByFilters } from '../services/api';
import { Button } from "@/components/ui/button";

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

  const [isLoading, setIsLoading] = useState({
    categories: false,
    brands: false,
    skuNames: false
  });

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

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(prev => ({ ...prev, categories: true }));
      try {
        const data = await getCategories();
        const options = data
          .filter(category => category && typeof category === 'string')
          .map(category => ({
            value: category,
            label: category
          }));
        setCategories(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(prev => ({ ...prev, categories: false }));
      }
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

      setIsLoading(prev => ({ ...prev, brands: true }));
      try {
        const data = await getBrandsByCategories(
          selectedCategories.map(c => c.value)
        );
        
        const options = data
          .filter(brand => brand && typeof brand === 'string')
          .map(brand => ({
            value: brand,
            label: brand
          }));
        setBrands(options);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([]);
      } finally {
        setIsLoading(prev => ({ ...prev, brands: false }));
      }
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

      setIsLoading(prev => ({ ...prev, skuNames: true }));
      try {
        const data = await getSkuNamesByFilters(
          selectedCategories.map(c => c.value),
          selectedBrands.map(b => b.value)
        );
        
        const options = data
          .filter(skuName => skuName && typeof skuName === 'string')
          .map(skuName => ({
            value: skuName,
            label: skuName
          }));
        setSkuNames(options);
      } catch (error) {
        console.error("Error fetching SKU names:", error);
        setSkuNames([]);
      } finally {
        setIsLoading(prev => ({ ...prev, skuNames: false }));
      }
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
    onSkuNamesChange(newSelectedSkuNames.map((option) => option.value));
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSkuNames([]);
    onSkuNamesChange([]);
  };

  // Check if any filters are selected
  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || selectedSkuNames.length > 0;

  return (
    <div className="flex gap-2 items-center">
      <div className="w-[180px]">
        <Select
          id="category"
          isMulti
          options={categories}
          value={selectedCategories}
          onChange={handleCategoryChange}
          isLoading={isLoading.categories}
          styles={customStyles}
          components={{ Option, ValueContainer }}
          placeholder="Category..."
          noOptionsMessage={() => isLoading.categories ? "Loading..." : "No categories"}
        />
      </div>
      <div className="w-[180px]">
        <Select
          id="brand"
          isMulti
          options={brands}
          value={selectedBrands}
          onChange={handleBrandChange}
          isLoading={isLoading.brands}
          isDisabled={selectedCategories.length === 0}
          styles={customStyles}
          components={{ Option, ValueContainer }}
          placeholder="Brand..."
          noOptionsMessage={() => isLoading.brands ? "Loading..." : "Select category"}
        />
      </div>
      <div className="w-[180px]">
        <Select
          id="skuName"
          isMulti
          options={skuNames}
          value={selectedSkuNames}
          onChange={handleSkuNameChange}
          isLoading={isLoading.skuNames}
          isDisabled={selectedCategories.length === 0}
          styles={customStyles}
          components={{ Option, ValueContainer }}
          placeholder="Product..."
          noOptionsMessage={() => isLoading.skuNames ? "Loading..." : "Select category"}
        />
      </div>
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="h-8 px-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default ProductFilters;