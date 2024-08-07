import React from 'react';
import { createRoot } from 'react-dom/client';
import {Tab} from "../Tab";

const container = document.createElement('div');
container.id = 'app';
document.body.appendChild(container);
const root = createRoot(container);

root.render(
  <div>
    <Tab/>
  </div>
);
