
import { createContext } from 'react';

// Separate context file to avoid Fast Refresh warnings when exporting components.
export const ConfirmContext = createContext(null);

export default ConfirmContext;
