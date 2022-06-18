import React from 'react';
import { Route, Routes } from 'react-router-dom';

import WorkCreate from '@/components/works/WorkCreate';
import WorkEdit from '@/components/works/WorkEdit';
import WorkList from '@/components/works/WorkList';

function WorkModule() {
  return (
    <Routes>
      <Route path="/" element={<WorkList />} />
      <Route path="create" element={<WorkCreate />} />
      <Route path=":id" element={<WorkEdit />} />
    </Routes>
  );
}

export default WorkModule;
