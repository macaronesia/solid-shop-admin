import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CategoryCreate from '@/components/categories/CategoryCreate';
import CategoryEdit from '@/components/categories/CategoryEdit';
import CategoryList from '@/components/categories/CategoryList';

function CategoryModule() {
  return (
    <Routes>
      <Route path="/" element={<CategoryList />} />
      <Route path="create" element={<CategoryCreate />} />
      <Route path=":id" element={<CategoryEdit />} />
    </Routes>
  );
}

export default CategoryModule;
