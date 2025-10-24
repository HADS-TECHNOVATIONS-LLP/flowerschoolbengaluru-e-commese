import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import ShopNav from './ShopNav';
import Footer from '@/components/footer';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  image: string;
  imagefirst?: string;
  imagesecond?: string;
  imagethirder?: string;
  imagefoure?: string;
  imagefive?: string;
  inStock: boolean;
  featured: boolean;
  stockquantity: number;
}

interface FilterState {
  priceRange: [number, number];
  flowerTypes: string[];
  arrangements: string[];
  occasions: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
}

export default function ProductsListing() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const searchParam = searchParams.get('search');

  // Mobile filter drawer state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    flowerTypes: [],
    arrangements: [],
    occasions: [],
    colors: [],
    inStock: false,
    featured: false
  });

  const [forceRefetch, setForceRefetch] = useState(0);

  useEffect(() => {
    // Increment forceRefetch when category/subcategory changes
    setForceRefetch(prev => prev + 1);
    // Reset filters when category changes
    setFilters({
      priceRange: [0, 10000],
      flowerTypes: [],
      arrangements: [],
      occasions: [],
      colors: [],
      inStock: false,
      featured: false
    });
  }, [categoryParam, subcategoryParam, searchParam]);

  // Update query to include search parameter with proper refetch
  const { data: products, isLoading, refetch } = useQuery<Product[]>({
    queryKey: ['/api/products', categoryParam, subcategoryParam, searchParam, filters, forceRefetch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryParam) params.append('category', categoryParam);
      if (subcategoryParam) params.append('subcategory', subcategoryParam);
      if (searchParam) params.append('search', searchParam);

      // Add filter parameters
      if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString());
      if (filters.priceRange[1] < 10000) params.append('maxPrice', filters.priceRange[1].toString());
      if (filters.flowerTypes.length) params.append('flowerTypes', filters.flowerTypes.join(','));
      if (filters.arrangements.length) params.append('arrangements', filters.arrangements.join(','));
      if (filters.colors.length) params.append('colors', filters.colors.join(','));
      if (filters.inStock) params.append('inStock', 'true');
      if (filters.featured) params.append('featured', 'true');

      // const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const baseUrl = import.meta.env.VITE_API_URL || 'https://flowerschoolbengaluru.com';
      const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();

      // Filter products client-side as well
      return data.filter((product: Product) => {
        const price = parseFloat(product.price);
        const matchesSearch = !searchParam ||
          product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          product.description.toLowerCase().includes(searchParam.toLowerCase()) ||
          product.category.toLowerCase().includes(searchParam.toLowerCase());
        const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
        const matchesType = filters.flowerTypes.length === 0 || filters.flowerTypes.includes(product.category);
        const matchesArrangement = filters.arrangements.length === 0 || filters.arrangements.includes(product.subcategory);
        const matchesColor = filters.colors.length === 0 || filters.colors.some(color =>
          product.name.toLowerCase().includes(color.toLowerCase())
        );
        const matchesStock = !filters.inStock || product.inStock;
        const matchesFeatured = !filters.featured || product.featured;

        return matchesSearch && matchesPrice && matchesType && matchesArrangement &&
          matchesColor && matchesStock && matchesFeatured;
      });
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Trigger refetch when search params change
  useEffect(() => {
    refetch();
  }, [searchParam, refetch]);

  interface PriceRange {
    label: string;
    value: [number, number];
  }

  const [filterConfigs, setFilterConfigs] = useState({
    priceRanges: [
      { label: '500 to 999', value: [500, 999] as [number, number] },
      { label: '1000 to 1499', value: [1000, 1499] as [number, number] },
      { label: '1500 to 2999', value: [1500, 2999] as [number, number] },
      { label: '3000 and Above', value: [3000, 10000] as [number, number] }
    ] as PriceRange[],
    flowerTypes: [
      { label: 'Roses', count: 0 },
      { label: 'Lilies', count: 0 },
      { label: 'Tulips', count: 0 },
      { label: 'Orchids', count: 0 },
      { label: 'Carnations', count: 0 },
      { label: 'Mixed Flowers', count: 0 }
    ],
    arrangements: [
      { label: 'Bouquets', count: 0 },
      { label: 'Vase Arrangements', count: 0 },
      { label: 'Box Arrangements', count: 0 },
      { label: 'Basket Arrangements', count: 0 }
    ],
    colors: [
      { label: 'Red', count: 0 },
      { label: 'Pink', count: 0 },
      { label: 'White', count: 0 },
      { label: 'Yellow', count: 0 },
      { label: 'Purple', count: 0 },
      { label: 'Mixed', count: 0 }
    ]
  });

  useEffect(() => {
    if (products) {
      const newFilterConfigs = { ...filterConfigs };

      // Reset all counts first
      newFilterConfigs.flowerTypes.forEach(type => type.count = 0);
      newFilterConfigs.arrangements.forEach(arr => arr.count = 0);
      newFilterConfigs.colors.forEach(color => color.count = 0);

      // Count products
      products.forEach(product => {
        newFilterConfigs.flowerTypes.forEach(type => {
          if (product.category === type.label) {
            type.count++;
          }
        });

        newFilterConfigs.arrangements.forEach(arr => {
          if (product.subcategory === arr.label) {
            arr.count++;
          }
        });

        newFilterConfigs.colors.forEach(color => {
          if (product.name.toLowerCase().includes(color.label.toLowerCase())) {
            color.count++;
          }
        });
      });

      setFilterConfigs(newFilterConfigs);
    }
  }, [products]);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      flowerTypes: [],
      arrangements: [],
      occasions: [],
      colors: [],
      inStock: false,
      featured: false
    });
  };

  const [openSections, setOpenSections] = useState({
    price: true,
    flowerTypes: true,
    arrangements: true,
    colors: true,
    additional: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter component (reusable for both desktop and mobile)
  const FilterComponent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`bg-white rounded-lg shadow-sm p-4 space-y-4 ${isMobile ? 'h-full overflow-y-auto' : 'sticky top-4'}`}>
      {/* Mobile header */}
      {isMobile && (
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Reset Filters */}
      <button
        onClick={resetFilters}
        className="w-full text-xs bg-pink-50 text-pink-600 hover:bg-pink-100 py-2 rounded-md transition-colors"
      >
        Reset Filters
      </button>

      {/* Price Filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex justify-between items-center text-sm font-semibold text-gray-900 mb-2 hover:text-pink-600"
        >
          Price Range
          {openSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.price && (
          <div className="space-y-2 pt-2">
            {filterConfigs.priceRanges.map((range) => (
              <label key={range.label} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
                <Checkbox
                  checked={filters.priceRange[0] === range.value[0]}
                  onCheckedChange={() => {
                    setFilters(prev => ({
                      ...prev,
                      priceRange: range.value as [number, number]
                    }));
                  }}
                />
                <span className="text-xs text-gray-600">₹{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Flower Types */}
      <div>
        <button
          onClick={() => toggleSection('flowerTypes')}
          className="w-full flex justify-between items-center text-sm font-semibold text-gray-900 mb-2 hover:text-pink-600"
        >
          Flower Types
          {openSections.flowerTypes ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.flowerTypes && (
          <div className="space-y-2 pt-2">
            {filterConfigs.flowerTypes.map((type) => (
              <label key={type.label} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
                <Checkbox
                  checked={filters.flowerTypes.includes(type.label)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      flowerTypes: checked
                        ? [...prev.flowerTypes, type.label]
                        : prev.flowerTypes.filter(t => t !== type.label)
                    }));
                  }}
                />
                <span className="text-xs text-gray-600">
                  {type.label} ({type.count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Arrangements */}
      <div>
        <button
          onClick={() => toggleSection('arrangements')}
          className="w-full flex justify-between items-center text-sm font-semibold text-gray-900 mb-2 hover:text-pink-600"
        >
          Arrangements
          {openSections.arrangements ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.arrangements && (
          <div className="space-y-2 pt-2">
            {filterConfigs.arrangements.map((arr) => (
              <label key={arr.label} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
                <Checkbox
                  checked={filters.arrangements.includes(arr.label)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      arrangements: checked
                        ? [...prev.arrangements, arr.label]
                        : prev.arrangements.filter(a => a !== arr.label)
                    }));
                  }}
                />
                <span className="text-xs text-gray-600">
                  {arr.label} ({arr.count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Colors */}
      <div>
        <button
          onClick={() => toggleSection('colors')}
          className="w-full flex justify-between items-center text-sm font-semibold text-gray-900 mb-2 hover:text-pink-600"
        >
          Colors
          {openSections.colors ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.colors && (
          <div className="space-y-2 pt-2">
            {filterConfigs.colors.map((color) => (
              <label key={color.label} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
                <Checkbox
                  checked={filters.colors.includes(color.label)}
                  onCheckedChange={(checked) => {
                    setFilters(prev => ({
                      ...prev,
                      colors: checked
                        ? [...prev.colors, color.label]
                        : prev.colors.filter(c => c !== color.label)
                    }));
                  }}
                />
                <span className="text-xs text-gray-600">
                  {color.label} ({color.count})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Additional Filters */}
      <div>
        <button
          onClick={() => toggleSection('additional')}
          className="w-full flex justify-between items-center text-sm font-semibold text-gray-900 mb-2 hover:text-pink-600"
        >
          Additional Filters
          {openSections.additional ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {openSections.additional && (
          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
              <Checkbox
                checked={filters.inStock}
                onCheckedChange={(checked) =>
                  setFilters(prev => ({ ...prev, inStock: checked as boolean }))
                }
              />
              <span className="text-xs text-gray-600">In Stock Only</span>
            </label>
            <label className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded">
              <Checkbox
                checked={filters.featured}
                onCheckedChange={(checked) =>
                  setFilters(prev => ({ ...prev, featured: checked as boolean }))
                }
              />
              <span className="text-xs text-gray-600">Featured Items</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  // Handle loading state
  if (isLoading) {
    return (
      <>
        <ShopNav />
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ShopNav />
      <div className="container mx-auto px-2 py-4">
        <div className="flex gap-4 relative">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <FilterComponent />
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg">
                <FilterComponent isMobile={true} />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
              <h1 className="text-lg sm:text-xl font-bold">
                {searchParam ? `Search Results for "${searchParam}"` : (subcategoryParam || categoryParam || 'All Products')}
              </h1>

              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600">
                  {products?.length || 0} products found
                </p>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Responsive Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {products?.slice(0, 240).map((product) => (
                <div
                  key={product.id}
                  className="cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  onClick={() => setLocation(`/product/${product.id}`)}
                >
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-2">
                    {/* Product Name */}
                    <h3 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 min-h-[2rem]">
                      {product.name}
                    </h3>

                    {/* Price and Stock Status */}
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm sm:text-base font-bold text-pink-600">
                        ₹{parseFloat(product.price).toLocaleString()}
                      </p>
                      {!product.inStock && (
                        <span className="text-[10px] bg-red-50 text-red-500 px-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No products found message */}
            {products && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Show total count */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Showing {Math.min(products?.length || 0, 240)} products
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
