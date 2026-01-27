import React from 'react';
import { Product, ProductListingProps } from './types';

const ProductListing: React.FC<ProductListingProps> = ({ products, onRowClick }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              ID
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => onRowClick?.(product)}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                {product.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="px-6 py-12 text-center text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
};

export default ProductListing;