export interface Product {
  id: string | number;
  name: string;
}

export interface ProductListingProps {
  products: Product[];
  onRowClick?: (product: Product) => void;
}